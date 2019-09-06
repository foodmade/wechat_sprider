# wechat_sprider
基于(anyproxy)中间人注入方式,抓取微信公众号文章列表,阅读数,点赞数,评论列表

#快速启动
#### 1 依赖安装
```
npm install
```
#### 2 生成anyproxy证书
- 进入项目根目录
```
cd node_modules/anyproxy/bin/
node anyproxu-ca
```
#### 3 启动
```
Book-Air:wechat_sprider chen$ node index.js 
[AnyProxy Log][2019-09-06 23:58:21]: throttle :10000kb/s
[2019-09-06 23:58:21 <lvl:4> ]<Parser handler> Load [article_list] success
[2019-09-06 23:58:21 <lvl:4> ]<Mysql connection Success>
[AnyProxy Log][2019-09-06 23:58:21]: Http proxy started on port 8001
[AnyProxy Log][2019-09-06 23:58:21]: web interface started on port 8002
[AnyProxy Log][2019-09-06 23:58:21]: Active rule is: 抓取微信公众号历史文章
proxyServer is ready
```
#### 4 证书下载,安装  **(手机和电脑要在同一局域网下)**

手机浏览器访问:http://ip:8002/,点击RootCA > download。然后进行证书安装

`如果是IOS>=10.3系统,设置->通用->关于本机->证书信任设置 中把AnyProxy证书的开关打开`

#### 5 手机连接代理
- ifconfig/ipconfig 查看电脑内网ip (不懂怎么看的,google去~)
- 手机打开 设置>wifi>高级>代理设置>手动>
  - ip：电脑内网ip
  - 端口：8001

#### 6 打开微信,访问微信公众号,打开文章列表

仅是业余时间编写的demo,可能存在很多问题,仅供参考
