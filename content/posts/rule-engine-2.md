---
title: "关于规则引擎的思考(2)"
date: 2020-07-29T00:00:00+08:00
draft: false
---
### 规则 & 引擎

规则引擎字面隐含的需求：

规则：简单人能读懂的条件

引擎：快速执行规则背后的机器指令

所以人们想用简单的表达来指导复杂的工作，这种化繁为简的银弹是真实需求。

但规则到指令不是等量的，所以一定有细节的损失，也就是规则不能表达的逻辑。

```jsx
 UI —- 配置 —- DSL — * — 脚本 —- 静态语言 —— 汇编/机器指令
```

所以规则引擎的过程是一个语义表达从简单到复杂的过程。

中间有一个人到机器的分界。（程序员是人，也是机器） 

回到之前举的例子，我也正好比较熟悉。

ACL或eBPF：保过滤规则引擎

配置层面（人读）：

```jsx
router#show access-list
  Extended IP access list test
      permit ip host 2.2.2.2 host 3.3.3.3
      permit tcp host 1.1.1.1 host 5.5.5.5 eq www
      permit icmp any any
      permit udp host 6.6.6.6 10.10.10.0 0.0.0.255 eq domain

```

```jsx
host 192.168.0.1 and not host 10.1.1.1 and (port 138 or port 139 or port 445)
```

UI界面，配置文件，DSL都认为是人读的。

配置的指令会转化/编译为执行，下发到引擎，让引擎来执行。

被隐藏的细节是什么呢，ip这个字段在报文的什么位置，如果有人想匹配一个内容中的ip地址，这个也许在目前规则上就表达不了，如果需要这样的需求，过度复杂规则又会变成阴间的玩意儿。

### 规则的逻辑

包过滤规则的逻辑确实是if else这样的条件组合，复杂条件组合及决策树。

[https://zh.wikipedia.org/zh-hans/决策树学习](https://zh.wikipedia.org/zh-hans/%E5%86%B3%E7%AD%96%E6%A0%91%E5%AD%A6%E4%B9%A0)

条件匹配：这是最典型的规则，但也是最简单的规则。目测70%规则引擎都是需要表达逻辑匹配。

条件是数据？还是程序？程序君这篇很有启发。

[https://mp.weixin.qq.com/s/Ym0CttjcOV6fy67craPmLQ](https://mp.weixin.qq.com/s/Ym0CttjcOV6fy67craPmLQ) Policy Engine 的前世今生

前面提到，程序语言除了条件，还能表达计算和数据。这样也就产生了复杂规则。

比如SQL：以数据为中心，可以用SELECT叠加各种表达式筛选内容。

数据筛选：和匹配是一个意思，但重心在数据集合上，数据量上千万量级，放在条件里面就无法热更新了。

计算：计算在规则中的作用都是临时的，用于达到逻辑匹配和数据筛选的变换，但这个也很重要。

### 规则的定义：协议 or 模式

规则如果是预先定义的，那么就是协议，强匹配。

如果规则不能预先定义，通过规律定义，弱匹配，那么就是模式。

有时两者都要坚固，相互作用。能做到一个可以闭环生长的反馈系统。

以上问题可能要考虑到：

1. 需求边界的限定
2. 有限的可读配置
3. 能覆盖需求的逻辑
4. 既要事前预测，事中匹配，还要事后分析，并可以反馈。
