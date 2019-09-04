/***
 * 自定义规则文件
 * @type {{doParser, log, loadLocalParser, initParser, PARSER_MAPPER}|*}
 */
var parserHandler = require('../parser_handler');
var config = require('../config/config');
var utils  = require('../utils/utils');
var work   = require('../utils/work'); 

var RULE_NAME = 'article_list';

const userInfo = {
    collectCnt:0
};

/**
 * 设置提示文本
 */
function getNotification (cnt) {
    return '<h1 style="color:red; font-size:20px; text-align: center; margin-top: 10px; margin-bottom: 10px;">正在进行文章数据采集...... 数量： ' + cnt + '</h1>';
}

/**
 * 解析用户指纹 在拼装自定义url中需要用到的
 * 需要解析的字段：[pass_ticket,wap_sid2,wxtokenkey,wxuin,version,appmsg_token]
 */
function parserUserBaseInfo(requestDetail,responseDetail){
    utils.log('【Start parser user info】',config.LOG._LOG_LEVEL_DEBUG);
    const htmlString = responseDetail.response.body.toString();
    const cookies = requestDetail.requestOptions.headers.Cookie;

    //从cookies中解析我们想要的数据
    parserByCookie(cookies);

    //从url中解析需要的数据
    parserByUrl(requestDetail.url);

    //解析appmsg_token
    try {
        var appmsg_token_pattern = /window.appmsg_token = \"(.*?)\";/;
        userInfo.msgToken = appmsg_token_pattern.exec(htmlString)[1];
    }catch (e) {
        utils.log('【Parser appmsg_token throw err,jump ove】',config.LOG._LOG_LEVEL_DEBUG);
    }

    utils.log('【The user cookies parser success】');
    utils.log('【UserInfo:】' + JSON.stringify(userInfo),config.LOG._LOG_LEVEL_INFO);
}

function parserByUrl(url) {
    let paramsObj = utils.parserUrlParams(url);
    userInfo.biz = paramsObj.__biz.replace('==','');
    userInfo.sn  = paramsObj.sn;
}

function counterCnt() {
    ++userInfo.collectCnt;
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

function postDataAnd(){

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

                //发送数据到服务器端
                work.postArticleList(result.content,(data) => {
                    utils.log('【Do commit data success. Prepare for the next step 】',config.LOG._LOG_LEVEL_DEBUG);
                    //组装获取文章详情的url,自主请求
                    work.fetchArticleDetailInfo(data,userInfo, (likeData,msgId) => {
                        //回调获取阅读数,点赞数,发送数据到服务器端,文章列表和点赞数在服务器端进行合并,爬虫断不做复杂合并操作
                        counterCnt();
                        utils.log('【Do collect article like number info >>>>>>>>>>>>>>>>>>>】:: \n' + likeData + " msgId：：" + msgId,config.LOG._LOG_LEVEL_INFO)
                    });
                },() => {
                    utils.log('【Do commit data err!!! 】',config.LOG._LOG_LEVEL_ERROR);
                });

                const newResponse = responseDetail.response;
                //todo:在微信界面显示采集数量还存在问题,需要每次重定向到第一页才能满足条件
                newResponse.body =  getNotification(userInfo.collectCnt) + htmlString;

                return new Promise(((resolve, reject) => {
                    setTimeout(() => {
                        resolve({response:newResponse});
                    })
                }));
            } else {
                return null;
            }
        } catch (e) {
            utils.log('Rule handler throw exception:' + e.message);
            return null;
        }
    },

    /**
     * 请求前的拦截操作
     * @param {请求实体} requestDetail 
     */
    // * beforeSendRequest(requestDetail){
    //
    // },
    //
    // * beforeDealHttpsRequest(requestDetail){
    //     return true;
    // }
};
