---
title: "FW: syslog的编程和配置"
id: 5204
date: 2011-03-15 16:25:40
tags: 
- Linux
categories: 
- OS
---

<div id="art" style="margin: 15px;">
<div><span style="font-size: large; font-family: 隶书;">syslog的编程和配置</span></div>
<div>&nbsp;</div>
<div>本文档的Copyleft归yfydz所有，使用GPL发布，可以自由拷贝，转载，转载时请保持文档的完整性，严禁用于任何商业用途。
msn: [yfydz_no1@hotmail.com](mailto:yfydz_no1@hotmail.com)
来源：[http://yfydz.cublog.cn](http://yfydz.cublog.cn/)</div>
<div>&nbsp;</div>
<div>参考文献：man syslog syslogd syslog.conf openlog, RFC3164</div>
<div>&nbsp;</div>
<div>1\. 前言</div>
<div>&nbsp;</div>
<div>syslog是UNIX系统中提供的一种日志记录方法(RFC3164)，syslog本身是一个服务器，程序中凡是使用syslog记录的信息都会发送到该服务器，服务器根据配置决定此信息是否记录，是记录到磁盘文件还是其他地方，这样使系统内所有应用程序都能以统一的方式记录日志，为系统日志的统一审计提供了方便。</div>
<div>&nbsp;</div>
<div>2\. 日志格式</div>
<div>&nbsp;</div>
<div>syslog记录的日志格式为：</div>
<div>月 日 时:分:秒 主机名 标志 日志内容</div>
<div>&nbsp;</div>
<div>3\. syslog编程</div>
<div>&nbsp;</div>
<div>为记录日志，通常用到3个函数，openlog(3)，syslog(3)和closelog(3)，openlog(3)和closelog(3)不是必须的，没有openlog(3)的话将用系统缺省的方式记录日志。</div>
<div>&nbsp;</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; #include &lt;syslog.h&gt;</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; void openlog( char *ident, int option, int&nbsp; facility)</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; void syslog( int priority, char *format, ...)</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; void closelog( void )</div>
<div>&nbsp;</div>
<div>openlog(3)有三个参数，第一个参数是标志字符串，也就是日志中的第5个字段，不设的话缺省取程序名称；</div>
<div>第二个参数是选项，是下面一些标志位的组合：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_CONS：日志信息在写给日志服务器的同时打印到终端
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_NDELAY：立即记录日志
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_PERROR：把日志信息也输出到标准错误流
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_PID：在标志字段中记录进程的PID值</div>
<div>第三个参数是说明日志类型的，定义了以下类型(各类型啥意思就自己看或猜吧，俺就不多说了)：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_AUTH
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_AUTHPRIV
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_CRON
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_DAEMON
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_KERN
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_LOCAL0 through LOG_LOCAL7
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_LPR
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_MAIL
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_NEWS
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_SYSLOG
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_USER(default)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_UUCP</div>
<div>&nbsp;</div>
<div>syslog(3)函数主要的是第一个参数priority，后面那些参数就是和printf(3)函数用法一样了，priority值表示该条日志的级别，日志级别分8级，由高到低的顺序为：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_EMERG
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_ALERT
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_CRIT
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_ERR
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_WARNING
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_NOTICE
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_INFO
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LOG_DEBUG</div>
<div>如果openlog(3)时没有指定facility，是可以把facility的值或到priority中的，如(LOG_AUTH | LOG_INFO)，已经设置了就可以不用或了。</div>
<div>&nbsp;</div>
<div>closelog(3)这个没啥好说的了，关闭日志记录。</div>
<div>
4\. syslog服务器配置</div>
<div>&nbsp;</div>
<div>syslog服务器的配置文件为/etc/syslog.conf，syslog(3)函数把想记录的日志信息都发送给日志服务器，但此日志最终是否记录到文件或发送给远程服务器，则是由此配置文件来决定的，该配置文件就是告诉日志服务器要记录那些类型和级别的日志，如何记录等信息。</div>
<div>&nbsp;</div>
<div>配置文件是文本文件，每行配置分两个字段，第一字段是说明要记录哪类日志，第二字段是说明日志存放位置，可以是本地文件，也可以是远程服务器。</div>
<div>&nbsp;</div>
<div>第一字段：
第一字段基本格式是&ldquo;facility.priority&rdquo;，可以同时定义多个，中间用逗号&ldquo;,&rdquo;或分号&ldquo;;&rdquo;分隔。
facility名称就是上面说的facility值的后半部的小写，如news, mail，kern, cron等，也可以用&ldquo;*&rdquo;表示所有facility类型；
priority名称就是上面说的priority值的后半部的小写，如emerg, alert，err, info等，也可以用&ldquo;*&rdquo;表示所有priority类型，比此级别高的日志都会自动记录，用none表示不记录；</div>
<div>举例：
kern.* : 所有级别的内核类型日志
mail.err: 错误及错误级别以上的mail类型日志</div>
<div>如果不记录某级别的日志，在级别前加&ldquo;!&rdquo;，如：
auth.info;auth.!err ：info及info级别以上但不包括err级别的auth类型日志</div>
<div>
第二字段：
第二字段分两类，本地文件和远程服务器
本地文件：直接就是写本地文件的文件名，如 /var/log/messages。一般来说日志信息会立即写到文件中，但会降低系统效率，可以在文件名前加减号&ldquo;-&rdquo;表示先将信息缓存，到一定量后再一次性写入文件，这样可以提高效率；
远程服务器：格式是[&ldquo;@address](mailto:&ldquo;@address)&rdquo;，&ldquo;@&rdquo;表示进行远程记录，将日志发送到远程的日志服务器，日志服务器的端口是UDP514，address可以是IP地址，也可以是域名</div>
<div>&nbsp;</div>
<div>举例：</div>
<div># 将所有级别的内核日志发送到终端
kern.*&nbsp; /dev/console&nbsp;</div>
<div>&nbsp;</div>
<div># 将所有类型所有级别的日志记录到/var/log/messages文件
*.* /var/log/messages</div>
<div>&nbsp;</div>
<div># 所有info级别以上的信息，不包括mail类型所有级别和authpriv类型的err级别信息，</div>
<div># 记录到/var/log/messages文件，不立即写入
*.info;mail.none;authpriv.!err&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -/var/log/messages</div>
<div>&nbsp;</div>
<div>#将所有级别的内核日志发送到远程syslog服务器
kern.*&nbsp; @1.1.1.1</div>
<div>&nbsp;</div>
<div>5\. syslog服务器</div>
<div>&nbsp;</div>
<div>在linux下提供了sysklogd的syslog服务器的实现，可以记录本机日志也可以接收(syslogd的-r选项)和转发(syslogd的-h选项)来自外部的日志。</div>
<div>&nbsp;</div>
<div>sysklogd包括两个程序，klogd和syslogd，klogd用于接收内核日志，再发送到syslogd，syslogd则可以直接接收应用程序和远程的日志，syslogd是通过一个域socket(AF_UNIX)来接收数据的，syslog()函数记录的日志都发送到此域socket，socket文件是/dev/log。</div>
<div>&nbsp;</div>
<div>syslog(3)函数发送给syslogd服务器的日志信息前都加上了类型和级别信息，具体格式是&ldquo;&lt;x&gt;&rdquo;，&ldquo;x&rdquo;是一个0～255的数，8位，低3位表示日志级别，所以共8级，高五位表示日志类型，最多32种，不过目前没用到那么多，可以看看/usr/include/sys/syslog.h中的定义就知道了。</div>
<div>&nbsp;</div>
<div>要生成日志信息时，syslogd是先生成日志前部信息：月 日 时:分:秒 主机名 标志，再和日志内容信息拼接起来的，日期用ctime(3)函数获取，隐去了前4个表示星期的字节和后面年的信息，最终生成你所看到的日期格式，老实说那段代码及其丑陋。</div>
<div>&nbsp;</div>
<div>6\. 结论</div>
<div>&nbsp;</div>
<div>syslog方便了程序信息的记录，由于使用了统一的格式记录使得审计也可以比较方便。要记录日志，除了在应用程序中用syslog(3)函数记录外，还要正确配置/etc/syslog.conf文件，使服务器能正确记录那些想记录的日志。</div>
</div>