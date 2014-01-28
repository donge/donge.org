title: "Vagrant up!"
id: 9397
date: 2013-07-02 15:26:23
tags: 
categories: 
- 未分类
---

使用easy_install时会出现这个错误的话，尝试安装这些依赖。

error: Setup script exited with error: command 'gcc' failed with exit status 1

$ sudo apt-get install gcc

$ sudo apt-get install python-dev

$ sudo apt-get install libxml2 libxml2-dev

$ sudo apt-get install libxslt1.1 libxslt1-dev

&nbsp;

&nbsp;

错误的easy_install会可以找到错误的依赖。

vagrant@precise64:/vagrant/scrapy/Scrapy.egg-info$ cat requires.txt
Twisted&gt;=8.0
w3lib&gt;=1.2
queuelib
lxml

&nbsp;

还是SOHU的源快
<pre>/etc/apt/sources.list</pre>
<pre>deb http://mirrors.sohu.com/ubuntu/ quantal main restricted universe multiverse
deb http://mirrors.sohu.com/ubuntu/ quantal-security main restricted universe multiverse
deb http://mirrors.sohu.com/ubuntu/ quantal-updates main restricted universe multiverse
deb http://mirrors.sohu.com/ubuntu/ quantal-proposed main restricted universe multiverse
deb http://mirrors.sohu.com/ubuntu/ quantal-backports main restricted universe multiverse
deb-src http://mirrors.sohu.com/ubuntu/ quantal main restricted universe multiverse
deb-src http://mirrors.sohu.com/ubuntu/ quantal-security main restricted universe multiverse
deb-src http://mirrors.sohu.com/ubuntu/ quantal-updates main restricted universe multiverse
deb-src http://mirrors.sohu.com/ubuntu/ quantal-proposed main restricted universe multiverse
deb-src http://mirrors.sohu.com/ubuntu/ quantal-backports main restricted universe multiverse</pre>