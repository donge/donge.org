title: TRILL-Hello协议
date: 2011-07-13 23:40:08
---

**4.4 TRILL-Hello协议**
TRILL-Hello协议与L3 IS-IS LAN Hello有一点点不同。TRILL定义了一种新的Hello报文类型，区别于L3 IS-IS Hello报文。

**4.4.1 TRILL-Hello原理**
在三层一个LAN可能选择多个DR，因为部分路由器之间可能没有2-way连通。所以L3 IS-IS在发送Hello报文时，需要填充到最大MTU，保证相互连通。一个路由器如果MTU小于这个最大MTU，那么就无法收到其他人的Hello报文。这样的结果就会在LAN中出现多个小的区域，产生多个伪节点。
L3 IS-IS使用这种方式没有问题，在L2中则会产生环路问题。

另一个原因是TRILL-Hello需要保证信息可以被划分成多个子集处理(<span style="color: #0000ff;">分片</span>)，就好像LSP，CSNP这样。TRILL-Hello虽然不需要填充，但有可能会变得很大。比如某些骨干网互联技术可以将上百台TRILL设备连接在一个超大以太网中。这样RB就会在一个Link上建立数百个邻居。

在TRILL网络中(不同于L3 IS-IS)，DRB选举仅通过<span style="color: #0000ff;">优先级</span>和<span style="color: #0000ff;">MAC地址</span>，换句话说RB2只要收到RB1中携带的优先级更高，就会选举RB1作为DRB，而不需要判断RB1的TRILL-Hello邻居列表中是否有RB2的地址。

虽然<span style="color: #0000ff;">TRILL-Hello中的邻居列表不影响DRB选举，但是还决定在LSP中发布的邻居信息</span>。当RB1在一个Link上成为DRB后，如果RB1，RB2之间没有2-way连通(可能是MTU不一致，可能是单通)，那么RB2就不会发布一个到RB1(或伪节点)的Link到LSP中。RB1(伪节点)也不会发布到RB2的Link。

**4.4.2 TRILL-Hello报文内容和周期**
TRILL-Hello有新的报文类型，固定报文头与IS-IS LAN Hello相同，携带7-bit的DRB优先级。发送周期与IS-IS LAN Hello相同。

TRILL-Hello包括Outer.MacDA，Outer.MacSA，除去Outer.VLAN或其他tag，<span style="color: #0000ff;">一定(MUST)不能超过1470字节，不需要(SHOULD)填充。</span>

<span style="color: #0000ff;"><span style="color: #000000;">以下信息<span style="color: #0000ff;">必须(MUST)</span>在每个TRILL-Hello中携带[layer2]:
1\. Designated VLAN的VLAN ID。
2\. 报文内复制携带一份Outer.VLAN标签。
3\. 指定的16-bit的端口ID，标示发出Hello的端口，不能重复。
4\. 发送RB的Nickname。
5\. 两个标记:
a. 表示发送者探测到VLAN mapping在2个Holding Timer内。
b. 表示发送者认为自己是appointed forwarder在这个TRILL Hello发出的VLAN和端口上。</span></span>

<span style="color: #0000ff;"><span style="color: #000000;">以下信息<span style="color: #0000ff;">可以(SHOULD)</span>出现
1\. 端口上使能的所有CE VLAN集合。
2\. 几个标记位:
a. 表示发送者端口被设置为ACCESS端口。
b. 表示发送者端口被设置为TRUNK端口。
c. 忽略伪节点(bypass pseudonode)标记，见后面描述。
3\. 如果发送者是DRB，则一些RB(除了自己)会被指定成为这个Link上VLAN的appointed forwarder。如下描述，并不一定所有的指定信息都在一个Hello报文中描述，如果不描述，则表示继续沿用过去的指定信息。
4\. TRILL邻居列表，不同于L3 IS-IS邻居列表，是一个新TLV。以适应分片和描述Link的MTU值。(Section 4.4.2.1)</span></span>

<span style="color: #0000ff;"><span style="color: #000000;">Appointed Forwarders TLV描述一个VLAN范围，在这个范围内，指定一个RB。这个RB不是DRB的时候才发[layer2]。<span style="color: #0000ff;">DRB发送的AF TLV最终要覆盖所有可用的VLAN</span>。如果指定一个RB是appointed forwarder，但在这个端口上没有使能这个VLAN，则是无效的。</span></span>

<span style="color: #0000ff;"><span style="color: #000000;">大部分网络情况下，邻居都是point-to-point邻居，这种情况下伪节点是不需要的。所以DRB可以设置bypass pseudonode bit，除非这个Link上有两个以上邻居。自从Link上次重启时。（<span style="color: #0000ff;">初始选举的DRB可以默认设置，Link上超过两个邻居后取消</span>）</span></span>

**<span style="color: #0000ff;"><span style="color: #000000;">4.4.2.1 TRILL邻居列表
</span></span>**<span style="color: #0000ff;"><span style="color: #000000;">新的TRILL邻居TLV，对每个邻居包括如下信息:
1\. 邻居的MAC地址。
2\. 到这个邻居的MTU值，2个字节无符号(在4字节块中)，0表示未探测。
3\. MTU探测失败标记。</span></span>

<span style="color: #0000ff;"><span style="color: #000000;">为了分片，<span style="color: #0000ff;">可以携带部分邻居列表，邻居列表必须按ID从小到大排序<span style="color: #000000;">。如RB1的邻居列表(X1 &lt; X2 &lt; X3, ... &lt; Xn)，RB2的ID不在X1到Xn中，那么肯定不在RB1的Hello报文中。这样RB2就可以知道RB1的邻居列表中没有自己。
<span style="color: #ff0000;">#这个ID是system id?</span>
另外有两个标记表示:<span style="color: #0000ff;">最大/最小的邻居ID在Hello报文中</span>。如果在一个分片中描述了所有的邻居，则两个标记同时置位。
为保证RB2准确知道RB1中是否有自己，RB1的邻居分片信息最终要覆盖最大/最小ID。如果X1是最小的邻居ID，但在当前的分片中没有，那么一定在后面的分片中。
<span style="color: #ff0000;">#或者邻居ID可能重叠，如何重叠？</span></span></span></span></span>

 **4.4.3 TRILL MTU探测和TRILL Hello VLAN标记
**MTU探测用于决定RB之间的传输MTU值。MTU探测和MTU探测确认信息只有DB进行发送。
RB维护的VLAN信息与Bridge相同，包括接口上使能的VLAN集合(Section 4.9.2)。除此之外BR还对每个端口维护一下特殊的VLAN参数：
a. Desired Designated VLAN: RB上的VLAN，如果是DRB，会在TRILL-Hellos中携带，并在Link上都使用这个VLAN来传输TRILL报文，除了一些TRILL-Hello报文。这个VLAN必须是RB上使能的VLAN。默认是接口上使能最小数字的VLAN，默认配置就是VLAN 1。
<span style="color: #ff0000;">#没有配置的情况下是所有vlan使能？
<span style="color: #000000;">b. Designated VLAN: Designated VLAN用于这个Link上所有TRILL报文，除了一些TRILL-Hello。这个是RB的Desired Designated VLAN如果，RB认为它就是DRB，或者是DRB Hello报文中的Designated VLAN，如果RB认为自己不是DRB。
c. Announcing VLANs集合: 缺省是接口上已经使能的VLAN集合，但是可以配置成为是接口VLAN的子集。
d. Forwarding VLANs集合: 这个是接口在成为appointed VLAN forwarder的VLAN集合。必须是接口使能了的VLAN，所以有可能是全部使能的VLAN。</span></span>

<span style="color: #ff0000;"><span style="color: #000000;">在每一个没有配置为P2P的接口上，RB需要发送Outer.VLAN为每个接口每个VLAN集合。这个集合是由RB的DRB状态和以上参数决定的。RB发送Hello报文的Outer.VLAN使用Designated VLAN，除非这个VLAN在接口上没有使能。此外，<span style="color: #0000ff;">DRB需要发布所有Outer.VLAN为Announcing VLANs集合的Hello</span>。所有的<span style="color: #0000ff;">非DRB的发送Hello的Outer.VLAN是所有Announcing VLANs与Forwarding VLANs的交集</span></span></span>。更形象的说
      If sender is DRB
         intersection ( Enabled VLANs,
            union ( Designated VLAN, Announcing VLANs ) )

      If sender is not DRB
         intersection ( Enabled VLANs,
            union ( Designated VLAN,
               intersection ( Forwarding VLANs, Announcing VLANs ) ) )
配置Announcing VLANs为空时，可以最小化TRILL-Hello的数量，这种情况下TRILL-Hello只使用Designated VLAN。需要非常小心的是当配置RB不在任何VLAN中发Hello报文时，如果RB被认为是appointed  forwarder，一些情况下回导致环路。

TRILL-Hello数量会最大化，当配置Announcing VLANs是所有的使能VLAN，默认情况。这种情况下DRB会发送TRILL-Hello用它所有使能的VLAN，非DRB使用Designated VLAN发送，如果可用。还要发所有是appointed forwarder的VLAN。（这样可能会发很多Hello，尤其是非DRB在所有使能的VLAN上发，它既不是appointed forwarder，也不是Designated VLAN。但这样比更深一步的通讯和处理负担更无害一些）

当RB端口启动，直到它监听到一个更高优先级的Hello前，它都认为自己是DRB，并按上述原则发送报文。尽管在Link上可能同时相互识别，但一段时间后，如果自己收到Hello中没有更高优先级时，就向IS-IS中描述的，则认为自己重新是DRB。

**4.4.4 多个端口在一个Link上
**<span style="color: #000000;">一个RB上有多个端口在一个在一个Link上需要进行识别。举个例子，如果RB1是VLAN A的appointed  forwarder，那么RB1知道自己只有一个接口可以转发VLAN A数据。
RB1通过接收到的TRILL-Hello有相同的伪节点ID在不同接口收上来的来判断。RB1可能有{ p1, p2, p3 }在一个Link上，{ p4, p5 }在另一个Link上，p6, p7, p8各属于一个Link，我们把这一的端口集合叫"port group"。
如果RB1探测到{ p1, p2, p3 }是一个组的，RB1必须保证在封装和解封装流量时不产生环路。如果RB1是VLAN A的appointed  forwarder在这个以太链路上，RB1<span style="color: #0000ff;">必须</span>使用一个端口进行封装或解封装。如果RB1是多个VLAN的appointed  forwarder,可以选择不同的端口平均分担作为appointed  forwarder。</span>

<span style="color: #0000ff;">如果RB1探测到VLAN mapping，那么一定不能将VLAN appointed  forwarder分担。必须使用一个组中相同的端口封装或解封装。
</span><span style="color: #000000;">当转发TRILL封装多播报文时，在端口组上时，RB1可以从组中选择不同接口进行分担转发。需要保证没有重复得帧，并且每个流在每个端口上是不变的。如果RB2是RB1的邻居，RB2<span style="color: #0000ff;">必须</span>接收RB1所有邻居的流量。</span>

<span style="color: #000000;">如果多个接口使用相同MAC地址，可以使用TRILL-Hellos中的端口ID区分。</span>

**<span style="color: #000000;">4.4.5 在一个Link中的VLAN mapping
</span>**<span style="color: #000000;">IEEE定义不允许改变传输帧的C-tag。但是一些交换机产品提供了这样的功能，这种情况下桥VLAN可以被配置，和显示。举例一个桥端口可以配置剥离tag，并转发到另外一个端口后安装一个新的配置的tag。尽管这样的配置是合法的，但不能对一台单独的用户交换机使用。不然这些有相同VLAN的用户交换机就会发生割离。VLAN mapping又叫 "VLAN ID translation"。</span>

<span style="color: #000000;">RB使用外层VLAN封装TRILL-Hello, 当一个RB收到TRILL-Hello时，会比较外层VLAN与Hello报文中带的VLAN信息比较。如果外层是Y，Hello中带的是X，那么X就说明被映射成了Y。</span>

<span style="color: #000000;">当非DRB RB2探测到VLAN mapping时，需要在其Hello中设置标记，并维持两个Holding timer时间从最后一次探测时间起。当DRB RB1听说发生VLAN mapping时（发现了VLAN mapping，或者从邻居列表中查到），RB1需要重新指定VLAN forwarder，保证所有的VLANs选择一个为forwarder。</span>

&nbsp;

&nbsp;