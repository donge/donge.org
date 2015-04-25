title: 项目
date: 2015-04-25 09:00:00
---


2015 
[wFilter](https://github.com/donge/wfilter)
===========================================

介绍
--------

wFilter是一个实时对网络报文进行关键字过虑，告警，拦截的一个项目。
可以理解为一个Mini GFW，也是一个Mini的Full-stack项目。

**原理**主要是基于DPDK的针对网络二层帧的实时深度解析，字符串多模同时匹配(Aho-Corasick算法)。

**优点**是集成了DPDK大页内存管理(hugepage)，应用处理报文无拷贝(uio)，CPU独占(core affinity)和Aho-Corasick算法的字符串一次便利，多模同时匹配特性。实时性高，性能高。

Aho-Corasick: https://www.youtube.com/watch?v=-7Pv1Lsa0Nw

架构和部署
--------
wFilter项目实际包括三部分。
1. [报文过滤器 wFilter](https://github.com/donge/wfilter): 
底层(数据面) ，负责报文转发和关键字过虑告警。可以根据压力调节CPU独占情况。

2. [管理后端 wFilter-back](https://github.com/donge/wfilter-back):
中间层(控制面)，以MongoDB为中心，存储配置信息和实时告警日志。对下使用syslog-ng对接过滤器日志，对上试用RESTful API提供配置和日志的CRUD服务。

3. [管理前端 wFilter-front](https://github.com/donge/wfilter-front):
上层(表现层)，提供Web形式的管理页面，使用MEAN架构(MongoDB, ExpressJS, AngularJS, Node.js)，提供无刷新SPA(single page application) UI体验。

**架构优点**是部署灵活，接口标准，可以扩展至Web，桌面，移动APP。

报文过滤器需要**部署**在X86 Linux服务器上，CPU硬件支持DPDK，支持双网卡。与管理前端后端和统一部署在一台服务器(single deploy)。也可以分布式部署到两台，三台甚至更多服务器上(multiple deploy)。

举一个例子，用户有N个报文过滤器分布部署，数据后端可以根据压力情况部署N/2个，即每两个过滤器共享一个数据库。前端可以只有一个页面整体展示数据。未来如果需要对数据做MapReduce，可以扩展中间件层。


