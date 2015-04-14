title: Go是一门和谐的语言
date: 2014-01-12 21:00:00
tags: golang

---

这周T神问我了一个问题，如果用Golang开发防火墙设备软件，你会有什么担心？
我无脑便答没什么可担心的，其实这个问题我自己问过自己，并在我的“无脑”中简单推导过几次。Go可以用在哪里？

![](/images/chbtc_0106_0112.png)

于是我按直觉上大致再捋了一下，软件粗分为两种：系统软件，应用软件。

先说应用软件，应该是距离用户最近的，满足用户各种异想天开的需求，也是种类繁多，变化频繁的。不用多说，写这样的软件如果用C那么简直就是自虐。
当然这也是有前提的，如果是1980年，那么也别无选择，LinkList也要自己实现。但在今日，随着硬件，操作系统，开源库的发展的基础上，用高级语言带来的好处显而易见，开发周期短，代码少，维护简单，变更迅速。例如：Android应用就是Java开发运行在dalvik虚拟机上的。

系统软件一般功能单一，完成对资源的分配和调度，这种软件虽然看起来好像管好自己的一块饼就可以了，但实际却不是这样。在一个规模系统中，资源需要弹性得分配，调度也需要做到并发/并行，这些资源的管理和调度需要按需进行，分布式部署。于是更多的层次和模块在这里产生了，大型系统中有各种资源调度的中间件，线程池，读写缓存，消息队列等待。使得现代系统变得很复杂，如果从头到尾维护一套，显然不划算。

> 做优秀的系统要集中精力做好这个系统上最有价值的部分。

问题需要分治解决，软件设计上就是对系统分层，分模块，我不想凭空的大谈理论，实际这些理论是与工程相互结合的。先不细节，我想暴力定义每层可以使用不同的技术或者不同的语言。这种分离无疑是最强的，比方说用Java写一个让JVM Crash的程序就很难，或者用C语言来摧毁CPU也不太容易，用Golang维护世界和平也是不可能的...当然...“三个代表，和谐社会”也不行。

简单做从包处理角度看一个系统。

####一. ####
首先进入包处理系统的底层，这里可以逐级使用ASIC，NP，CPU做信号数字化，Pattern Match，查表，转发，策略，QoS调度等。用到的语言可能是专用微码，汇编，兼容C语言。
####二. ####
然后进入协议栈这层，这时报文可能按包属性被分发到不同CPU处理，可用C语言写IP协议栈，报文行为识别，安全策略执行。对于4-7层报文安全处理，80%的通用协议用可以C语言，或者协处理芯片。20%的不常见的应用报文，或者定制的处理，完全可以考虑Golang或者Lua脚本语言完成。
####三. ####
报文通过后，应该有个中间件层，各种应用构筑在它之上，它承载资源虚拟化，缓存，负载均衡等能力。软件中间件尽量与硬件无关，可以选择能构建在llvm虚拟机或者java虚拟机上的技术，他们通过通用的中间字节码，引入了更多优雅的语言。既降低开发难度，又保证不失性能，如C++0x，Object-C，Java，Scala，甚至各种已经支持的语言Haskell, Ruby, Python等等。这样大量的第三方库就可以被导入，轻松构筑弹性的资源层面，为上层应用平台服务。
####四. ####
报文最后被应用软件处理。应用软件可以根据自己的喜好，用特性选择不同的语言。比如SSH/FTP/HTTP这些成熟基础应用可以继续用过去的C/C++语言。高同步/高并发类的网游可以用erlang语言，数据库CRUD类的可以用动态解析脚本语言Python，Ruby，PHP...。
又扯远了，回到我熟悉的路由协议，配置管理，OAM，北向接口等控制类应用来说。这些应用有一定的变化，但又不大，要求性能，但又不会海量，最好还能赶个时髦，支持虚拟化，弹性，多核并发，当然还要开发简单，容易维护。这里我自然想到了Golang，Golang是编译型语言，性能不错，又隐藏了并发处理中调度和通讯的细节。

####接着黑####
当然如果你有华为的团队，你完全可以用C语言来搞定一切，一个应用协议20人维护，一个系统至少1000人交叉开发。产品性能不错，开发效率很低，软件维护痛苦，产品演进缓慢。
地球上没有几个这样的平台，所以如果我是架构师，我也许会用一个转发平面erlang，控制平面golang的结构。erlang代码两成，处理八成工作，重在并发。golang代码八成，实际两成常用，重在性价比。当然这是我的臆想了...想喷请留言...

####FIN####
Golang是一门中庸的语言，每个方面都是80分，当你它注定不是文艺青年的最爱，对我这种媳妇口中的“性价比哥”来说再好不过。看来我已经把使用一种语言上升到价值观的高度了，不能再远了。
好吧，说个近的，其实我对golang感兴趣，是因为它的吉祥物gopher很萌，像个屌丝二货工程师。


#### P.S. 关于这丑陋的贴图
是这周我的Bitcoin自动交易机器人(绰号:无脑赔钱货)7*24小时无中断的一周交易记录

时间 | 动作 | 成交价 | 收益率(100%) | 币数(100元) 
:---|:---|---:|---:|---:
2014-01-12 10:33:08 | 卖出 | 5410.0 | 5.9879% |
2014-01-12 05:22:41 | 买入 | 5440.0 |       | 0.019591
2014-01-12 04:53:41 | 卖出 | 5405.01 | 6.5756%
2014-01-12 04:22:20 | 买入 | 5421.99 |      | 0.019718
2014-01-12 03:03:25 | 卖出 | 5395.03 | 6.9104%
2014-01-11 17:00:47 | 买入 | 5310.89 |      | 0.019816
2014-01-11 14:35:13 | 卖出 | 5256.11 | 5.2430% 
2014-01-10 23:52:51 | 买入 | 5006.66 |      | 0.020023
2014-01-10 21:48:00 | 卖出 | 4990.01 | 0.2483%
2014-01-10 16:19:50 | 买入 | 5020.0 |        | 0.020090
2014-01-10 12:41:22 | 卖出 | 4982.1 | 0.8508%
2014-01-10 04:30:13 | 买入 | 4972.0 |        | 0.020243
2014-01-10 02:34:09 | 卖出 | 4888.01 | 0.6463%
2014-01-10 01:32:42 | 买入 | 4968.0 |        | 0.020590
2014-01-09 19:36:13 | 卖出 | 4956.12 | 2.2934%
2014-01-09 04:52:09 | 买入 | 4807.99 |       | 0.020640
2014-01-08 22:08:13 | 卖出 | 4870.0 | -0.7640%
2014-01-08 17:16:22 | 买入 | 4908.99 |      |  0.020377
2014-01-08 13:32:47 | 卖出 | 4812.0 | 0.0307%
2014-01-08 10:30:40 | 买入 | 5061.4 |        | 0.020788
2014-01-08 10:27:43 | 卖出 | 5695.0  | 5.2152%
2014-01-07 08:35:17 | 买入 | 5668.01 |        | 0.018475
2014-01-07 07:32:38 | 卖出 | 5612.01 | 4.7165%
2014-01-07 05:26:13 | 买入 | 5736.59 |        | 0.018659
2014-01-06 20:22:46 | 卖出 | 5786.01 | 7.0411%
2014-01-06 08:22:10 | 买入 | 5464.56 |        | 0.0185
2014-01-06 07:06:24 | 卖出 | 5358.0 | 1.0943% |

机器人启动时是持币状态，差不多从5300开始(100元=0.018868 Bitcoin)，截至这篇文章结束差不多也是回到5300(105.99元=0.019997 Bitcoin)。

本周结果我很满意，但市场总是会调节的，需要运气。

机器人是Python脚本，因为Python很擅长http和JSON处理，适合做原型。我也正在尝试用golang重写它，做得完善一些。如果有人感兴趣，我可以写写关于Bitcoin的话题。



