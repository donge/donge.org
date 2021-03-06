---
title: 2021网络系统流行架构
date: 2021-03-08T01:00:00+08:00
draft: false
---

2021年了，看看网络系统的流行架构。

系统的质量属性要满足客户需求，所以架构的第一出发点也是需求。

有偏好的需求构成场景，架构的取舍就是基于应用场景的偏好。

网络系统在管道的位置，大致分为两类：

#### 傻快型：内容无感知，以交换和路由为主。如各种交换机，路由器等设备，主要靠硬件。

纯软件实现上的需求主要是牺牲一些硬件的高性能，换取管理和维护的方便和统一，如SDN，NFV。

目前为了融合硬件与软件，一般都采用x86的架构配合高速可编程的NIC和转发芯片（如支持P4）。

以获得性能与管理的双重优势。

但本质还是矛盾，硬件的特殊化就会带来管理的特殊化，具体问题需要具体讨论解决，不展开。

#### 智慧型：内容感知，以业务驱动的负载均衡和网关系统为主。如负载均衡，API网关等，主要靠软件。

今天重点说一下2021年软件上的流行架构。

因为两种类型没有明显分界，但内容感知程度是有的，业务驱动的网络系统在互联网行业需求很大。

所以网络基础架构软件化不仅仅是管理统一的问题，还有具体业务的问题很难在通用设备上完美解决。

软件实现虽然性能不行，但其灵活性和对硬件的解偶带来的收益是大于性能收益的，其横向扩展能力也弥补了全局性能。收益主要体现在迭代迅速（需求满足的速度），硬件统一，部署灵活，运维简单。所以暂时将引入硬件解决单点性能问题作为第二考虑的因素。

我们一层一层来说。

### eBPF - Passthrough

![/img/ebpf.png](/img/ebpf.png)

2021年eBPF打底应该没有争议吧，对比以eBPF实现的XDP与DPDK，结合我们刚说过的问题。DPDK还是有Intel，DPDK网卡的硬件约束。而eBPF系统约束更小，Kernel > 4.8即可。虽然性能稍微弱一些，但可以在纯Linux运行，可以灵活在用户态和内核态对接，需求迭代速度也远高与DPDK。所以软件上做傻快型可以选DPDK，但智慧型XDP更适合。

以此为基础的项目有k8s网络组件Cilium，Facebook的业务负载均衡Katran。

### Cilium - Network

迭代和硬件说完了，我们看下部署，部署上：盒子，私有系统，各种云。对应也就是Metal，VM，容器等。因为有了eBPF的约束，没有操作系统的Rare Metal就不在讨论范围内，它更适合傻快的方案。

各种部署下都能运行的网络就是用户态网络。XDP只要是内核满足的Linux，Cilium已经证明了和容器结合，DPDK更费劲。所以还是eBPF更有优势。以此为基础的软件系统，可以安装在任意Linux，VM，Docker上，实现各种环境的架构统一。

未来网络层应该还会有其他XDP的用户协议栈方案，如果不需要路由交换的网络功能，可直接与应用结合，如Katran。

### Envoy - Gateway

Cilium解决网络的问题，路由交换，简单策略。但业务感知还需要灵活的网关，关于网关的选择我之前也研究过。

https://donge.org/posts/envoy-vs-traefik/

这里网络如果选择了Cilium（主要是容器场景），那么结合最好的还是Envoy，Evony在四层进行业务感知，进行业务层面的路由和网关，有强大的策略配置驱动和插件机制，也是快速迭代的优选。

这里虽然拿了一个K8S中CNI的图，但Cilium也可以仅作为有网络路由功能的用户态协议栈使用，也可以省略。

![/img/cilium_envoy.png](/img/cilium_envoy.png)

### Golang - Plugins

采用通用网关驱动特定业务，插件或二次开发是绕不过的，平衡性能与迭代速度，Golang比C++，Lua，JavaScript，Rust都稍微占一些优势。因为开发效率和不俗的性能。Envoy是C++，有开发门槛，但插件系统较为完善，Cilium是Golang。

WASM插件也是强有力的方案，只是今年来看还优点早，得不偿失。而且和Golang也不冲突，Envoy同时也支持WASM和LUA。

但只要不是天天变化的逻辑，Golang中庸的综合实例还是略胜一点。

未来Rust with WASM很有想象力。

### 全家福

为什么叫2021流行架构，因为过几年也许还有更好的选择，就如同XDP对比DPDK的优势，顺应了一些DPDK出生时没有的潮流，比如容器化。

最后祭出这张原创全家福，欢迎抄袭。

![/img/2021_network_arch.png](/img/2021_network_arch.png)


以此为基础，可以快速满足大部分的网络系统，包括业务路由（负载均衡），WAF，API网关，单点认证，日志，QoS，跟踪系统等。并可部署与单机，私有化，混合云环境等无硬件依赖环境。

性能虽然在第二梯队，但XDP，Golang这样的选择也是第二梯队的王者。而网络性能的热点更可能会在IO，并发（锁），加解密/压缩反压缩（计算），而他们的解决方案从来不是哪种语言，有机会再探讨。

P.S. K3S是轻量级K8S，适用于小系统部署。

参考文档：

[http://arthurchiao.art/blog/transparent-chaos-testing-with-envoy-cilium-ebpf-zh/](http://arthurchiao.art/blog/transparent-chaos-testing-with-envoy-cilium-ebpf-zh/)

[https://gitlab.com/gitlab-org/gitlab/-/issues/205129](https://gitlab.com/gitlab-org/gitlab/-/issues/205129)

https://github.com/zoidbergwill/awesome-ebpf


