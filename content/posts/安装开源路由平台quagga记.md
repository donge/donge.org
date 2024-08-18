---
title: "[亲笔]安装开源路由平台Quagga记"
id: 9224
date: 2011-06-19 21:23:00
tags: 
- Linux
- quagga
categories: 
- Network
---

周末闲来无聊，准备学习一下Linux知识，索性想起了开源的路由系统Quagga，Quagga是为数不多的开源路由系统，源自Zebra（Zebra是斑马，Quagga是野驴，猜想也是一路的），Zebra大家可能还有人用过，不过早在N年前就没人维护了，Quagga支持主流的路由协议包括RIP, OSPF, ISIS, BGP等等，支持TE，支持IPv6，对于学习路由完全足够了，命令行界面克隆Cisco。当前Quagga最新版本是0.99.18。可以前往[http://www.quagga.net/](http://www.quagga.net/)获得。

1\. 安装编译运行系统
由于电脑是Windows，所以需要安装一个Linux编译环境，选择了DeepinLinux，一款国产优秀的面向桌面的Linux发行版，Ubuntu分支，轻量级界面还很漂亮。可以前往[http://www.deepinlinux.com](http://www.deepinlinux.com)获得。由于平时无法脱离Windows，所以安装到虚拟机中，VMWare, VisualBox, WMLite随你选了，废话不说，这个过程略了。

2\. 配置Linux环境
GCC编译环境，make，autoconf，essential-lib，git都不能少啊，我不是Linux铁粉，所以都用apt-get搞定，少什么加什么，不行就google。当然在Windows使用Linux，可以配置好SSH，在Windows下访问，Linux虚拟机后台运行命令行即可。

3\. 获得Quagga代码分支
可以从网站下载源码包，当然如果有网络的话，可以直接git。
`git clone git://code.quagga.net/quagga.git
`下载到本地后，看一下说明文件。

4\. 安装Quagga
第一步使用bootstrap.sh检查一下编译环境。
缺少那些工具或者lib都会有提示，按照提示配置完成。
第二步configure编译选项，这个步骤自动的，可以加参数配置，手册中说明很详细。
configure也用于修改软件的功能，如支持IPv6，关闭某个协议等等。
第三步make, make install，编译安装，OK。

5.运行Quagga
运行文件还是Zebra，不是Quagga，不要弄错了。有几个会出错的问题。
a. 如果遇到说zebra静态库找不到问题，可以将/usr/local/lib中的静态库cp到系统库中/lib快速解决，或者建立软链接，或者修改系统环境变量。
b.如果遇到说配置文件找不到(privs_init: could not lookup user quagga)。可以按如下操作，cp一个样例配置到配置中，再添加一下用户。
# cp -Rf /usr/local/etc/zebra.conf.sample /usr/local/etc/zebra.conf
# zebra -d -u root -g root
然后再zebra就作为守护进程启动了。

6\. 进入Quagga
Zebra默认端口号2601，可以在/etc/services中修改，可以用telnet登陆，登陆密码是zebra。登陆后就可以使用了，如果你用过Cisco IOS，就不用我多说了，哈哈~~

[root@donge:~/quagga](mailto:root@donge:~/quagga)# telnet localhost 2601
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.

Hello, this is Quagga (version 0.99.18).
Copyright 1996-2005 Kunihiro Ishiguro, et al.
User Access Verification

Password:
Router&gt;
Router&gt; show in
Router&gt; show interface
Interface eth0 is up, line protocol detection is disabled
  index 2 metric 1 mtu 1500
  flags: &lt;UP,BROADCAST,RUNNING,MULTICAST&gt;
  HWaddr: 00:0c:29:6d:c3:f7
  inet 192.168.128.128/24 broadcast 192.168.128.255
  inet6 fe80::20c:29ff:fe6d:c3f7/64
Interface lo is up, line protocol detection is disabled
  index 1 metric 1 mtu 16436
  flags: &lt;UP,LOOPBACK,RUNNING&gt;
  inet 127.0.0.1/8
  inet6 ::1/128