---
title: "TDX-DuckDB: 基于 Agentic Workflow 的通达信公式回测系统"
author: "donge"
pubDatetime: 2026-03-22T21:00:00+08:00
modDatetime: 2026-03-22T21:00:00+08:00
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

在量化交易领域，通达信（TDX）公式因其简洁和贴近实战的语法，被广大投资者所喜爱。然而，原生的通达信软件在处理大规模历史数据回测时，往往受限于单机性能和闭源环境，难以进行复杂的多因子分析和全市场扫描。

为了解决这个问题，我开发了 **TDX-DuckDB/ClickHouse** 项目。它的核心思想是：**将通达信公式解析为抽象语法树（AST），再自动转换为 ClickHouse 高性能 SQL，利用列式存储引擎实现秒级的回测。**

## 系统架构

该项目采用模块化设计，主要包含以下组件：

1.  **Parser (解析器)**：手写词法分析（Tokenizer）和语法分析（Parser），支持通达信特有的赋值（`:=`）和输出（`:`）语法。
2.  **SQL Translator (转换器)**：将 AST 节点转换为 ClickHouse 特有的函数。例如，通达信的 `MA(CLOSE, 20)` 被转换为 SQL 的窗口函数 `avg(close) OVER (PARTITION BY code ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW)`。
3.  **Backtest Engine (回测引擎)**：基于 ClickHouse 的执行结果，计算买入、卖出信号，并生成详细的交易流水和收益曲线。
4.  **Agentic Integration**：这是本项目的一个亮点。通过引入 Agentic Workflow（如 OpenCode/Skill），系统可以自动理解用户的自然语言策略，将其编写为公式并直接运行回测。

## 核心技术点

### 1. 语法树转换

通达信公式中的 `REF`、`MA`、`CROSS` 等函数在 SQL 中并不直观。我们通过递归处理 AST，将这些有状态的计算转换为 SQL 窗口函数，极大地提升了计算效率。

### 2. 高性能回测

利用 ClickHouse 的列式存储特性，即使是千万级甚至亿级的数据量，复杂的公式扫描也能在数秒内完成。

### 3. Agentic Skill

项目集成了一个名为 `tdx.png` 的系统运行截图，展示了 AI Agent 如何辅助开发者进行系统集成和策略验证。

![系统集成运行截图](/tdx.png)
*图：系统通过 Agentic Workflow 自动执行回测任务*

## 快速开始

项目已经开源到 GitHub：[donge/tdx](https://github.com/donge/tdx)

```bash
# 运行一个简单的回测
python -m src.main "XG: CLOSE > MA(CLOSE, 20)" -s 2025-01-01 -e 2025-12-31
```

## 结语

量化交易不应该只是机构的专利。通过开源工具和 AI 的加持，每一个程序员都可以构建属于自己的“黑盒”系统。未来，我计划进一步支持更复杂的形态匹配和机器学习因子集成。
