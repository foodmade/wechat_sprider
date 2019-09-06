//引入anyproxy
const AnyProxy = require('anyproxy');
//引入自定义规则
const rule = require('./rule/rule_custom');
//config文件
const config = require('./config/config');
const parserhandler = require('./parser_handler');
//mysql
const db = require('./db/db');

function init() {
    //Crawler parser handler init load
    parserhandler.initParser(config.PARSER_MAPPER);
    //Mysql connection init load
    db._INSTALL();
}

const options = {
    //代理监听端口
    port: config.SERVER.proxy_port,
    //指定自定义规则文件的路径
    rule: rule,
    //web控制台配置
    webInterface: {
        enable: true,
        webPort: config.SERVER.web_port
    },
    throttle: 10000,
    forceProxyHttps: true,
    wsIntercept: true, // 不开启websocket代理
    silent: false
};
const proxyServer = new AnyProxy.ProxyServer(options);

init();

proxyServer.on('ready', () => { console.log("proxyServer is ready") });
proxyServer.on('error', (e) => { console.log("proxyServer Error:") + e.toString() });
proxyServer.start();

