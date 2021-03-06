/***
 * 自定义规则文件
 * @type {{doParser, log, loadLocalParser, initParser, PARSER_MAPPER}|*}
 */
var parserHandler = require('../parser_handler');
var config = require('../config/config');
var utils  = require('../utils/utils');
var work   = require('../utils/work');

var RULE_NAME = 'article_list';

const userInfo = {};

/**
 * 设置提示文本
 */
function getNotification () {
    return '<h1 style="color:red; font-size:30px; text-align: center; margin-top: 10px; margin-bottom: 10px;">请翻页,以便数据采集...... '+ '</h1>';
}

/**
 * 解析用户指纹 在拼装自定义url中需要用到的
 * 需要解析的字段：[pass_ticket,wap_sid2,wxtokenkey,wxuin,version,appmsg_token]
 */
function parserUserBaseInfo(requestDetail,responseDetail){
    utils.log('【Start parser user info】',config.LOG._LOG_LEVEL_DEBUG);
    const cookies = requestDetail.requestOptions.headers.Cookie;

    const htmlString = responseDetail.response.body.toString();
    //从cookies中解析我们想要的数据
    parserByCookie(cookies);

    //从url中解析需要的数据
    parserByUrl(requestDetail.url);

    //解析appmsg_token
    var appmsg_token_pattern = /window.appmsg_token = \"(.*?)\";/;
    userInfo.msgToken = appmsg_token_pattern.exec(htmlString)[1];

    utils.log('【The user cookies parser success】')
    utils.log('【UserInfo:】' + JSON.stringify(userInfo),config.LOG._LOG_LEVEL_INFO);
}

function parserByUrl(url) {
    let paramsObj = utils.parserUrlParams(url);
    userInfo.biz = paramsObj.__biz.replace('==','');
    userInfo.sn  = paramsObj.sn;
}

function parserByCookie(cookies){
    try{
        //解析原始请求的Cookie
        const cookieArray = cookies.split(';');

        for (let i = 0; i < cookieArray.length; i++) {

            const cookieColunm = cookieArray[i];
            const cookieKV = cookieColunm.split('=');
            if(cookieKV.length > 1){
                userInfo[cookieKV[0].trim()] = cookieKV[1];
            }
        }
    }catch(e){
        utils.log('【Parser user info fail】:' + e.message,config.LOG._LOG_LEVEL_ERROR);
    }
}
  


module.exports = {
    summary: "抓取微信公众号历史文章",
    * beforeSendResponse(requestDetail, responseDetail) {
        try {
            if (/mp\/homepage\?__biz=/.test(requestDetail.url)) {
                utils.log('【' + RULE_NAME + '】拦截成功......{homepage?}', config.LOG._LOG_LEVEL_INFO);
                const htmlString = responseDetail.response.body.toString();
                const result = parserHandler.doParser(htmlString, RULE_NAME);
                utils.log('【爬取到的公众号历史文章列表】' + JSON.stringify(result), config.LOG._LOG_LEVEL_INFO);

                //每次新请求都解析用户指纹
                parserUserBaseInfo(requestDetail,responseDetail);

                //持久化数据
                work.saveArticles(result.content,userInfo,function(data){
                    utils.log('【Do commit data success. Prepare for the next step 】',config.LOG._LOG_LEVEL_ERROR);
                },function(){
                    utils.log('【Do commit data err!!! 】',config.LOG._LOG_LEVEL_ERROR);
                });

                const newResponse = responseDetail.response;
                newResponse.body = getNotification() +  htmlString;

                return new Promise(((resolve, reject) => {
                    setTimeout(() => {
                        resolve({response:newResponse});
                    })
                }));
                // return null;
            } else {
                return null;
            }
        } catch (e) {
            utils.log('Rule handler throw exception:' + e.message);
            return null;
        }
    }
};
