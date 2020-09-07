---
title: "关于规则引擎的思考(3)"
date: 2020-07-29T01:00:00+08:00
draft: false
---

做一个安全风控的引擎，用规则配置，需要能够自反馈。所以也不是一个简单的规则引擎。

也就是实时引擎 + 离线引擎两个部分。或者说是 数据平面 + 控制平面也行。

实时引擎在业务流量上处理，离线引擎给实时引擎提供弹药。

1. 实时引擎：

逻辑匹配70%：if else

有状态的计算30%：虽然比重小，但实现麻烦。

state管理的流式数据计算。原理参考Spark，Flink，但又不是通用系统。不能用Spark，Flink是需要同步做决策，Spark，Flink显然不合适。

[https://spark.apache.org/docs/1.6.2/api/java/org/apache/spark/streaming/State.html](https://spark.apache.org/docs/1.6.2/api/java/org/apache/spark/streaming/State.html)

有需求边界夹持，可以做的更快，更小。

举个例子：状态防火墙中的session table，以IP五元祖为key，其中一种状态是tcp状态。

我们使用数据流式处理如何实现呢

key: ip 5-tuple

state: 就是tcp状态顺序，在一定生命周期下统计，有明确开始(create)，和退出时机(remove)。

```jsx
def sequnceFunction(ip, tcp_action, state) := {

if (state.exists) {
    if (tcp_ack == FIN_ACK) {
          state.remove()
    } else {
         state.update(transState(tcp_action));
    }

} else {
    state.update(initStatinitState(tcp_action));
}
```

这个例子的状态比较具体，如果抽象一些，这个状态大概分为这些

[https://ci.apache.org/projects/flink/flink-docs-stable/dev/stream/state/state.html](https://ci.apache.org/projects/flink/flink-docs-stable/dev/stream/state/state.html)


| 状态 | 场景 | 需求 |
| ---- | ---- | ---- |
| ValueState | 单值统计 | 需要 |
| ListState | 序列统计 | 需要 | 
| ReducingState | 单值 | 不是简单累加，比如求唯一数量，可以用近似算法HyperHyperLog，这样就变成单值
| AggregatingState | 复杂统计 | Reducing 和 ListState更复杂的表达，目前不需要
| MapState | 二维矩阵 | 目前不需要，场景上可以用预测接口PMML替代

实时引擎要有嵌入机器学习模型的能力，使用PMML。

2. 离线引擎：

需要能和实时引擎配合，因为是离线的，所以Spark，Clickhouse等工具都可以。

离线一般采用定时任务，从配置的规则中执行数据筛选，获得规律的统计参数，模型。然后作用到实时引擎上。可以从机器学习角度理解，就是train完model后，还需要用这个model predict。

Spark ML训练的模型要能更新到PMML中。

模型有很多类型，有数据相关的，如KNN，也有数据无关的，如决策树。

所以最后输出的是

1. 数据：如：路由表，风险用户列表。
2. 参数：当前没小时访问次数风险阈值，单一用户支付的风险金额。
3. 模型：数据+参数的组合组合。

逻辑是这个逻辑，但大多工程实践上AI并没有那么强，所以这些口子留出来。

```jsx
//状态管理
risk_state(data)
//表查询
risk_table.lookup(data.key)
//动态调参
risk_params(data.val) 

//逻辑匹配
if data.a else risk
//模型匹配
risk_module.predict(data.feature)
```

最终很可能if else起了70%的作用，表查询起了20%的作用，调参数起了7%的作用，模型起了3%的作用。

符合典型的奥卡姆剃刀原理。

大概就是这些想法了。
