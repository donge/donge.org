---
title: "TDX-ClickHouse: 基于 Agentic Workflow 的通达信公式回测系统"
author: "donge"
pubDatetime: 2026-03-22T08:00:00+08:00
modDatetime: 2026-03-22T08:00:00+08:00
featured: true
draft: false
tags:
  - "quant"
  - "python"
  - "clickhouse"
  - "ai"
description: "介绍一个将通达信公式自动转换为 ClickHouse SQL 并进行大规模回测的开源项目，结合了 LLM Agent 的开发模式。"
---

## 背景

在量化交易领域，通达信（TDX）公式因其简洁和贴近实战的语法，被广大投资者所喜爱。然而，原生的通达信软件在处理大规模历史数据回测时，往往受限于单机性能。

为了解决这个问题，我开发了 **TDX-ClickHouse** 项目。它的核心思想是：**手动实现词法与语法解析器，将通达信公式转换为 ClickHouse 高性能 SQL，利用列式存储引擎实现秒级的全市场回测。**

## 系统架构

该项目采用模块化设计，主要包含以下组件：

1.  **Parser (解析器)**：纯 Python 实现的词法分析（Tokenizer）和语法分析（Parser），支持通达信特有的赋值（`:=`）和输出（`:`）语法。
2.  **SQL Translator (转换器)**：将 AST 节点转换为 ClickHouse 特有的 SQL 函数。例如，通达信的 `MA(CLOSE, 20)` 被转换为 SQL 的窗口函数 `avg(close) OVER (PARTITION BY code ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW)`。
3.  **Backtest Engine (回测引擎)**：执行 SQL 并根据信号计算买入（当日收盘）、卖出（次日收盘）逻辑，生成交易流水。
4.  **Agentic Integration**：通过 Agentic Workflow，系统可以自动理解自然语言描述的策略，生成公式并执行回测。

## 核心技术点

### 1. 语法树转换
通达信公式中的 `REF`、`MA`、`CROSS` 等有状态函数通过递归处理 AST，转换为 ClickHouse 的窗口函数，极大提升了计算效率。

### 2. 高性能回测
利用 ClickHouse 的列式存储，即使是千万级数据量，复杂的公式扫描也能在极短时间内完成。

![系统集成运行截图](/tdx.png)
*图：系统通过 Agentic Workflow 自动执行回测任务*

## 快速开始

项目已经开源到 GitHub：[donge/tdx](https://github.com/donge/tdx)

```bash
# 运行一个简单的回测
python -m src.main "XG: CLOSE > MA(CLOSE, 20)" -s 2025-01-01 -e 2025-12-31
```

