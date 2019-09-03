
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
 * 需要组装的字段[pass_ticket,devicetype,clientversion,appmsg_token,__biz,sn,title,]
 */
function fetchArticleDetailInfo(data,userInfo){
    utils.log('【Start assembling to get the url that the article likes】',config.LOG._LOG_LEVEL_DEBUG);
    utils.log('【The length of the data to be parsed】:' + data.length,config.LOG._LOG_LEVEL_DEBUG);

    let options = assemblyOptions(userInfo);

    utils.log('【Do commit request to weixin server options:】' + JSON.stringify(options),config.LOG._LOG_LEVEL_DEBUG);

    let basePostdata = '0.9587195974263992&__biz=BIZ%3D%3D&appmsg_type=9&mid=APPMSGID&sn=SN&idx=1&scene=19&title=' +
        '&abtest_cookie=BAABAAoACwASABMABAAjlx4AVpkeAM2ZHgD5mR4AAAA%3D&devicetype=DEVICETYPE' +
        '&version=17000529&is_need_ticket=0&is_need_ad=0&comment_id=893275290804387842&is_need_reward=0&both_ad=0' +
        '&reward_uin_count=0&send_time=&msg_daily_idx=1&is_original=0&is_only_read=1&req_id=0322CfLjhUzPBI2R1UxyeSJf' +
        '&pass_ticket=PASS_TICKET&is_temp_url=0&item_show_type=0&tmp_version=1&more_read_type=0' +
        '&appmsg_like_type=2&related_video_sn=&vid=';

    for (let i=0; i<data.length; i++){

        let msgid = data[i].appmsgid;
        let sn = parserSign(data[i].link);

        let newPostdata = basePostdata;
        newPostdata = newPostdata.replace('BIZ',userInfo.biz);
        newPostdata = newPostdata.replace('DEVICETYPE',userInfo.devicetype);
        newPostdata = newPostdata.replace('PASS_TICKET',userInfo.pass_ticket);
        newPostdata = newPostdata.replace('APPMSGID',msgid);
        newPostdata = newPostdata.replace('SN',sn);

        let body = {r:newPostdata};

        options.body = JSON.stringify(body);

        utils.log('【Send post options:】'+ JSON.stringify(options),config.LOG._LOG_LEVEL_INFO);

        utils.httpsPost(options,function(msg){
            utils.log('【Do Request like interface fail】 ' + JSON.stringify(msg),config.LOG._LOG_LEVEL_ERROR);
        },function(rsp,rspData){
            utils.log('【Do Request like interface success】 ' + JSON.stringify(rspData),config.LOG._LOG_LEVEL_INFO);
        });
    }
}

function parserSign(link) {
    let urlObj = URL.parse(link);
    let query = urlObj.query;

    let params = query.split("&");
    for (let i=0; i<params.length; i++){
        let param = params[i];
         let p =param.split("=");
         if(p[0] === 'sn'){
             return p[1];
         }
    }
    return "";
}

function assemblyOptions(userInfo){
    let newUrl = likeUrl;
    newUrl = newUrl.replace('PASS_TICKET',userInfo.pass_ticket);
    newUrl = newUrl.replace('DEVICETYPE',userInfo.devicetype);
    newUrl = newUrl.replace('MSG_TOKEN',userInfo.msgToken);

    let urlObj = URL.parse(newUrl);

    utils.log('【urlObj options:】' + JSON.stringify(urlObj),config.LOG._LOG_LEVEL_DEBUG);

    //组装Cookis
    let cookie = 'devicetype=' + userInfo.devicetype + ';';
    cookie = cookie + 'lang=zh_CN;';
    cookie = cookie + 'pass_ticket=' + userInfo.pass_ticket + ';';
    cookie = cookie + 'rewardsn=;';
    cookie = cookie + 'version=' + userInfo.version + ';';
    cookie = cookie + 'wap_sid2=' + userInfo.wap_sid2 + ';';
    cookie = cookie + 'wxtokenkey=' + userInfo.wxtokenkey + ';';
    cookie = cookie + 'wxuin=' + userInfo.wxuin + ';';

    return {
        url:'https://' + urlObj.hostname + urlObj.path,
        method:'POST',
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
        },
        body:''
    };
}

exports.postArticleList        = postArticleList;
exports.fetchArticleDetailInfo = fetchArticleDetailInfo;
