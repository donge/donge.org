---
title: Envoy VS Traefik
date: 2020-11-06T01:00:00+08:00
draft: false
---

云原生场景，产生了很多的Edge Router，Load balance，API Gate Way，Proxy等组件。

最近研究了一下，分享几个喜欢的项目，它们大致分为两类：

- Gateway为主：Kong，Krakend
- Proxy为主：Envoy，Traefik

但两类没有实际功能的边界，Proxy为主，一般要支持在L4，Gateway为主，支持在L7即可。

Proxy主要位置是中间，可以做sidecar，Gateway在服务endpoint前面。

再比如传统的HAProxy就是Proxy，Nginx就偏Gateway。

这个概念和数据通信网络的Core Router和Edge/Service Router是差不多的，Edge Router是感知服务的，理论上功能更多，Data Plane基本一样，Control Plane功能更丰富而已。

所以Gateway一般是一个Control Plane + Data Plane，比如Kong的Data Plane就是OpenResty。

使用Envoy作为Data Plane的Control Plane有Solo.io（Istio族下）。

从需求角度，我有几个偏好：

- 高性能：C++，Rust，Golang还可以，其他语言就别Data Plane了
- 高扩展：必须支持插件，动态(如LuaJIT)或者静态(链接库)。
- 独立：Serverless，无依赖，无状态，单daemon，最好自带UI。
- 小而美：其实和上面几个也是一个意思，最好带简单Control Plane，但要节制。

功能性能上，需要看场景。我关注在差异上，也就是高扩展与独立。

- Envoy：C++原生性能没得说，线程模型比Nginx还先进，水平扩展，所有配置均支持动态接口。最吸引我的是WASM的插件机制，逻辑上WASM可以编译到原生水平，还有很好的容器属性。只要push/pull就能增加插件进行使用。
- Traefik在今年上半年选型时，我很看好，独立，2.0开始支持L4，与Swarm，K8S结合都很好，性能也与Nginx不相上下，但配置动态还自带UI，可惜当时不支持插件，惜败。没想到从2.3开始支持golang的动态链接库和golang代码解析执行两种（Dev Mode），实验阶段。
- Kong/OpenResty：Nginx性能没的说，Lua动态没得说，Kong增加了控制平面的动态能力，差就差在Kong是几个东西组合的，大而全，但不小也不美，配置部署都麻烦。
- Krakend：这个是个欧洲公司，小众，golang，插件支持Lua与Golang，性能说是比Kong高，有很技术后发优势，小而美，自带UI。但生态上还是和几个大哥差太多了，怕半路夭折了，长期观望。

Envoy VS Traefik

- C++ VS Golang
- WASM插件 VS Golang插件
- 小而聚(无控制) VS 小而全(自带UI）

Envoy WASM插件：

[https://github.com/envoyproxy/envoy/tree/master/examples/wasm-cc](https://github.com/envoyproxy/envoy/tree/master/examples/wasm-cc)

BodyRewrite的流程，弄了一遍，总体不算太痛苦，哭在写C++上比较烦，当前还支持Rust，所以不算缺点。

本身插件是WASM文件，如果支持容器，还需要一些繁琐的步骤。据说性能目前还不行。可以先用Lua。

这里是Hub的生态，还比较冷清

[https://docs.solo.io/web-assembly-hub/latest](https://webassemblyhub.io/)

Traefik插件：

[https://github.com/traefik/plugindemo](https://github.com/traefik/plugindemo)

Golang的开发成本更低，写起来比较快，动态性上差点。

Plugins的生态更冷清。

[https://pilot.traefik.io/plugins](https://pilot.traefik.io/plugins)

虽然在插件概念上，大家都各用奇招。但插件需求还是比较高级的开发者需求，普通用户不一定用到。

我关注的其他功能

- gRPC：都支持。
- 状态：虽说Proxy无状态的，但状态是我的特殊需求，比如RateLimit如何实现，分布式下如何存储状态，效率如何。两者实现默认都是无状态的，不能集群全局RateLimit。Envoy给了一种gRPC实现有状态的实现的例子。
- 数据收集：Traefik比较弱，主要是文本输出Access，Envoy更加灵活可以将日志通过gPRC protobuf输出。

总结

Envoy的门槛更高，定位更有想象力，聚焦Data Plane，CloudNative的网红。

Traefik自带Control，上手快速，功能不花哨，就和它的Sologan一样 “Just Works“。

各有优劣，不相上下，持续关注吧。