title: 云计算
date: 2012-08-13 15:33:10
---

过去做过Web，接触过虚拟主机，VPS，知道网络，存储，计算服务的开通，没觉得很麻烦。

结果做了几年网络平台软件下来，又回到了这个话题，看来IT的基础还是软件，硬件和集成。

可以把当前云计算的技术理解为“自动集成”的技术。

各方面的学习材料：

**1、云平台**
OpenStack：

[http://os.51cto.com/art/201111/304714.htm](http://os.51cto.com/art/201111/304714.htm)

蒋清野的云管理软件比较 [http://www.qyjohn.net/?p=1247](http://www.qyjohn.net/?p=1247)

**2、网络虚拟化**

EMC中国研究院对网络虚拟化的介绍，挺不错。
 [http://qing.weibo.com/2294942122/88ca09aa33000833.html](http://qing.weibo.com/2294942122/88ca09aa33000833.html)

Open vSwtich：
[http://bengo.blog.51cto.com/4504843/791213](http://bengo.blog.51cto.com/4504843/791213)

**3、各种概念：**
**Amazon EC2 (Elastic Compute Cloud)** 是一个让用户可以租用[云电脑](http://baike.baidu.com/view/3084840.htm)运行所需应用的系统。EC2借由提供web服务的方式让用户可以弹性地运行自己的Amazon机器[镜像文件](http://baike.baidu.com/view/928.htm)，用户将可以在这个[虚拟机](http://baike.baidu.com/view/1132.htm)上运行任何自己想要的[软件](http://baike.baidu.com/view/37.htm)或[应用程序](http://baike.baidu.com/view/330120.htm)。

Amazon Simple Storage Service (S3) 是一个公开的服务，Web 应用程序开发人员可以使用它存储数字资产，包括图片、视频、音乐和文档。 S3 提供一个 RESTful API 以编程方式实现与该服务的交互。

我理解就是对应OpenStack的Nova(含glance)和Switch组件。