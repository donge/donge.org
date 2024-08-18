---
title: 基于Transformer异常序列实时检测
date: 2024-08-18T01:00:00+08:00
draft: false
---

最近在Transformer-based场景下的异常检测读了一些论文，但目前这个领域还没看到特别工程化的内容，这是其中一篇比较新的。

Few-Shot API Attack Detection - Overcoming DataScarcity with GAN-Inspired Learning
https://arxiv.org/pdf/2405.11258

**方法介绍**

论文提出了一种基于Transformer架构，特别是RoBERTa模型的新型少样本检测方法。
该方法利用最先进的Transformer架构增强了对API请求的上下文理解，与传统方法相比，提高了异常检测的能力。

**技术细节**
    - **GIAAD架构**：提出了一种名为GAN-Inspired Anomalous API Detection（GIAAD）的API异常检测方法，它基于少样本学习原则，并采用GAN启发式方法模拟GAN中的生成器概念。
    - **数据生成**：使用深度学习模型，基于RoBERTa架构，通过掩码语言模型（MLM）技术生成新的API请求示例。
    - **异常检测模型训练**：合并生成的数据集和少量样本数据集，然后训练RoBERTa MLM，以便在正常API请求上识别模式和语言规则。

这个方法虽然是学术上的，但目前Transformer方向的异常检测应该是大的趋势。

其中几个关键共性难题：
1. 工程化上流量检测需要高吞吐，transformer比RNN要有一定优势
2. 预训练模型部分，即base模型，API相似性差异比较大，比非通用比重大
3. 这个方法是有监督，需要少量标注的，再用GAN生成，依赖标记准确性

总体说假设还较多，工程落地还有一定差距。
