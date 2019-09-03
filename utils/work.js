
const utils  = require('./utils');
const config = require('../config/config');
var   URL    = require("url");

var likeUrl = 'https://mp.weixin.qq.com/mp/getappmsgext?f=json&mock=&uin=777&key=777&pass_ticket=PASS_TICKET&wxtoken=777&devicetype=DEVICETYPE&clientversion=17000529&appmsg_token=MSG_TOKEN&x5=0&f=json';

/**
 * 提交文章列表数据到服务器
 */
function postArticleList(result,success,errback){

    if(!result){
        errback();
    }

    var postData = {
        result:result
    };

    var options = {
        hostname: config.DATA_CENTER.hostname,
        port: config.DATA_CENTER.port,
        path:config.DATA_CENTER.taskRspPath,
        method:config.DATA_CENTER.taskRspMethod,
        headers:config.DATA_CENTER.taskRspHeaders
    };

    utils.log('Do commit task result:' + JSON.stringify(postData), config.LOG._LOG_LEVEL_DEBUG);

    utils.httpRequest_POST(options,postData,
        function(err){
            utils.log('Do commit crwaling result data error:' + err.message, config.LOG._LOG_LEVEL_ERROR);
            success(result);
        },
        function(rsp, rspDataBuff){
            if(rsp.statusCode !== 200){
                utils.log('Do commit crwaling result data error, HTTP state:' + rsp.statusCode, config.LOG._LOG_LEVEL_ERROR);
                utils.log('Do commit crwaling result data error, rsp headers:' + JSON.stringify(rsp.headers), config.LOG._LOG_LEVEL_ERROR);
                success(result);
            }else{
                utils.log('Do commit crwaling result data SUCCESS, HTTP state:' + rsp.statusCode, config.LOG._LOG_LEVEL_INFO);
                utils.log('Do commit crwaling result data SUCCESS, rsp headers:' + JSON.stringify(rsp.headers), config.LOG._LOG_LEVEL_INFO);
                success(result);
            }
        }
    );

}

/**
 * https://mp.weixin.qq.com/mp/getappmsgext?f=json&mock=&uin=777&key=777&pass_ticket=OEhyH0CvFdeOhuJ%25252FTn10exJLWvAH1pHaSy0PtIPFbMWAYr4uKQFRdmKnDjGJbRro
 * &wxtoken=777&devicetype=iOS12.3.1&clientversion=17000529&appmsg_token=&x5=0&f=json
 * 组装获取阅读数等数据url
 * 
 * 需要组装的字段[pass_ticket,devicetype,clientversion,appmsg_token]
 */
function fetchArticleDetailInfo(data,userInfo){
    utils.log('【Start assembling to get the url that the article likes】',config.LOG._LOG_LEVEL_DEBUG);
    utils.log('【The length of the data to be parsed】:' + data.content.length,config.LOG._LOG_LEVEL_DEBUG);

    let newUrl = likeUrl;
    newUrl = newUrl.replace('PASS_TICKET',userInfo.pass_ticket);
    newUrl = newUrl.replace('DEVICETYPE',userInfo.devicetype);
    newUrl = newUrl.replace('MSG_TOKEN',userInfo.msgToken);

    let urlObj = URL.parse(newUrl);

    utils.log('【urlObj options:】' + JSON.stringify(urlObj),config.LOG._LOG_LEVEL_DEBUG);

    //组装Cookis
    let cookie = 'devicetype=' + userInfo.devicetype + ';';
    cookie = cookie + 'lang=zh_CN;'
    cookie = cookie + 'pass_ticket=' + userInfo.pass_ticket + ';';
    cookie = cookie + 'rewardsn=;'
    cookie = cookie + 'version=' + userInfo.version + ';';
    cookie = cookie + 'wap_sid2=' + userInfo.wap_sid2 + ';';
    cookie = cookie + 'wxtokenkey=' + userInfo.wxtokenkey + ';';
    cookie = cookie + 'wxuin=' + userInfo.wxuin + ';';

    //组装headers
    let options = {
        scheme:'https',
        hostname: urlObj.hostname,
        port: 443,
        path:urlObj.path,
        method:'post',
        headers:{
            'Host' :'mp.weixin.qq.com',
            'Accept' :'*/*',
            'X-Requested-With':'XMLHttpRequest',
            'Accept-Language':'zh-cn',
            'Accept-Encoding' :'br, gzip, deflate',
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin':'https://mp.weixin.qq.com',
            'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.5(0x17000523) NetType/WIFI Language/zh_CN',
            'Connection':'keep-alive',
            'Cookie':cookie
        }
    };

    utils.log('【Do commit request to weixin server options:】' + JSON.stringify(options),config.LOG._LOG_LEVEL_INFO);

    utils.httpRequest(options,function(msg){
        utils.log('【Do Request like interface fail】 ' + JSON.stringify(msg),config.LOG._LOG_LEVEL_ERROR);
    },function(rsp,rspData){
        utils.log('【Do Request like interface success】 ' + JSON.stringify(rspData),config.LOG._LOG_LEVEL_INFO);
    });
    
    utils.log('assembling url-----------------------------:' + newUrl,config.LOG._LOG_LEVEL_INFO);
}

exports.postArticleList        = postArticleList;
exports.fetchArticleDetailInfo = fetchArticleDetailInfo;
