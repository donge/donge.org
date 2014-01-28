title: Liunx
date: 2011-06-18 22:57:48
---

收集和记录一些常用的Linux命令，配置等等。

安装SSH:
apt-get install ﻿openssh-server
apt-get install ssh

安装Samba:
﻿apt-get install samba

安装卸载DEB:
sudo dpkg -i package_file.deb
sudo dpkg -r package_name

环境变量:
echo $PATH
export PATH=$PATH:&lt;one new path&gt;

Git:
下载库 git clone [http://xxx.git](http://xxx.git)
初始化库 git init

CD:
回退目录 cd -
用上一个命令参数作为目录 cd !$