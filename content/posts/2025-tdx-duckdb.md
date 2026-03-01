---
title: 用 DuckDB 读通达信数据文件
date: 2026-03-01T00:00:00+08:00
draft: false
---

最近做了个小工具，写了个 DuckDB 扩展，让 `.day`、`.lc1`、`.lc5` 这些通达信的行情文件可以直接用 SQL 查：

```sql
SELECT * FROM read_tdx('sh000001.day');
```

### 为啥要做这个

每次用通达信数据都要先写一段解析代码，struct.unpack 搞完再塞进 pandas，烦透了。DuckDB 支持自定义扩展，干脆做一个，以后直接 SQL 搞定。

### 踩了哪些坑

**格式全靠猜。** 通达信没有官方文档，32字节一条记录，小端序，没有文件头，只能 hexdump 对着软件显示的价格一个字段一个字段猜。猜格式这件事其实挺上头的。

**ABI 不对就崩。** 给 Python `duckdb` 包写扩展得用 C_STRUCT ABI，不能用 C++ ABI——因为 pip 里的 duckdb 是静态编译的，不导出任何 C++ 符号，加载就崩。C_STRUCT ABI 就是通过一个结构体传函数指针，文档几乎没有，全靠翻源码。

**存指针不如复制结构体。** C_STRUCT ABI 的入口参数 `access` 指向的是调用方栈上的临时变量，函数返回就失效了。我一开始存的是指针，然后莫名崩溃了很久。改成复制整个结构体就好了：

```cpp
static duckdb_ext_api_v1 api;
void tdx_init(duckdb_ext_api_v1 *access) {
    api = *access;  // 复制，不是存指针
}
```

### 用起来

```python
import duckdb
con = duckdb.connect()
con.load_extension("./tdx_extension.duckdb_extension")
con.execute("SELECT MAX(close) FROM read_tdx('sh000001.day')").fetchdf()
```

代码在 [GitHub: donge/tdx_ext](https://github.com/donge/tdx_ext)，支持 `.day` / `.lc1` / `.lc5`，针对 Python duckdb 1.4.4 编译。
