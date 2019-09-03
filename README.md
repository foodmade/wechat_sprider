# wechat_sprider
基于(anyproxy)中间人注入方式,抓取微信公众号文章列表,阅读数,点赞数,评论列表

#快速启动
#### 1 依赖安装
```basj
npm install
```
#### 2 生成证书
```bash
node anyproxu-ca
```
#### 3 启动
```bash
node index.js
```
#### 4 证书下载,安装
```basj
手机浏览器访问:http://ip:8002/,点击RootCA > download。然后进行证书安装
```
`如果是IOS>=10.3系统,设置->通用->关于本机->证书信任设置 中把AnyProxy证书的开关打开`
#### 5 手机连接代理

#### 6 打开微信,访问微信公众号,打开文章列表

仅是业余时间编写的demo,可能存在很多问题,仅供参考
