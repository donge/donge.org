title: "[ZT]对下一代高端通信系统设计的七个展望"
id: 9217
date: 2011-06-17 00:13:59
tags: 
categories: 
- Network
---

转一篇陈首席的文章，慢慢理解一下~~

高端通信系统设计从来就是一个困难的话题。一个优秀的系统设计往往决定了其竞争力和相应的生命周期。

本文试图阐述笔者对下一代高端通信系统设计的一些展望。抛豆腐引砖块，其目的是通过读者的评论，使得美军，共军，国军，伪军等的知识和经验可以共享。使得Open Source的精神发扬光大。

**1。 LDF Rule（Legacy Decides Future）**
系统都是演变的，而非设计的。一个好的系统设计必须首先满足对历史系统，历史代码的演进路标。否则，就是在做Science，而非Engineering。这方面最大的挑战就是在哪个release去掉哪些历史遗留问题。改良的代价一定是小于革命。

在这个第一重要的法则里，要求的是系统设计师必须了解细节。需要能进能出［想歪了的同学请自己惩罚一下自己邪恶的心灵］。要的是能bottom up。然后在bottom up的基础上，进行top down的设计。缺一不可。只能bottom inside，是一个单纯的工程师；只能top through就是一个玩胶片的大忽悠。

**2。 CDMD Convergence Rule**
（Control Plane，Data Plane，Management Plane and Debug Plane Convergence）
这个rule类似与我大宋气功中的一句经典法则：人身无处不丹田。啥意思呢？
控制平面，数据平面，管理平面，调试平面都将是一个逻辑的概念，而非一个物理的实体，例如控制平面卡，数据平面卡。。。

上述的各个Plane都是你中有我，我中有你。［想歪了的同学请自己惩罚一下自己邪恶的心灵］。

在任何一个环节都需要有相应的逻辑部分。整体系统的任何一个平面是通过分布在系统各个环节中的子平面来共同构成的。

这方面最大的挑战是：系统架构师必须对分布式系统的设计非常过敏，sorry，敏感。

在分布式系统设计中，一个最重要的理论悖论是： 在分布式系统中，在任何时刻，在任何一个节点上，是无法知道当时的全局状态的。

这是啥意思呢？

就是，除了上帝，你在一个时刻点Ti，是不可能知道Ti时刻系统其他信息的。你能知道的信息只能是T（i＋Delta）。这个Delta就是通信开销所带来的。

大白话就是，杨小姐（杨贵妃），从理论上，Y从来就没有吃过新鲜的荔枝，no matter驿道上的马儿跑的有多快。

在这个分布式天生的死穴问题上，带来的问题是最多的。

作为系统架构师，必须对时序逻辑（Temporal Logic）有所掌握。Otherwise, 系统设计一定是漏洞十出。

另外，分布式系统的nature决定了任何全局算法的优化一定不是最优的，而是次优的。
在CDMD Convergence的设计基础上，一个很大的演变就是：C，D，M，D的计算资源的自适应（Adaptive）的调配。而非静态的划分。

要充分利用计算池的模型，Processing on Demand。

**3。CTP（Close To Port） Rule**
计算或者存储能力一定要离端口（Port）近。越远，越歇火。 当官是要离党中央近。做系统是要离Traffic近。

这里的一个设计Case study 是：要充分利用系统中线卡，处理卡，I/O卡上的计算能力。这些计算能力是离端口最近的，对Traffic而言，是Local Bus的距离，而非Interconnect的长途跋涉。

计算是分布的。分布计算的集合就是系统的总体计算和（或）处理能力。

**4。 CCNUMA Adoption Rule**
CCNUMA一定会被广泛的用在将来的高端通信系统中。

只有CCNUMA的应用，才能达到分布式技术的同时，又能支持历史系统，CDMD的融合和Close to Port的法则。

在CCNUMA系统设计中，必须对Memory的分布非常敏感。跨Interconnect，例如QPI，的过分存取，一定是带来硬伤。

系统架构师必须对Cache，L1，L2，和L3和ccNUMA－Interconnect，例如QPI等一些知识有足够的积累和实战能力。否则，很难把握CCNUMA系统。

**5。 Hybrid Model Rule**
ASIC，FPGA等等不会消亡。消亡的是你革命的心。任何设计都是一个性价比的折衷。
天下没有最美丽的女子；只有最适合你的女人。
在这个设计法则方面，要各位主要ASIC或者FPGA上的控制CPU的计算能力的浪费。
在CCNUMA的基础上，所有的CPU的整合就是一个CPU。所不同的是处理的数据可以不同而已。

**6。 MapReduce Rule**

经典的并行计算的MIMD模型应该被广泛的应用。

多个计算流形成一个计算池；
多个数据流形成一个数据池。

MapReduce不应该只是Loosely Coupled Distributed Computing的宠儿，例如Google，Facebook。

MapReduce的思想精髓应该，而且也会被广泛的应用在高端通信系统（Tightly Coupled Distributed Computing）的设计上。

**7。 x86＋ zero－overhead Linux **
x86＋Linux的在通信系统中一定会得到广泛的应用。从而使得通信系统能够迅速的实现，更为重要的是，支持大量的3rd party的应用。

任何不adopt Linux／Unix的力量都是错误的。历史的将来会证明这一点。。。

应用决定一切。 Linux的强大中的强大就是无数的应用。