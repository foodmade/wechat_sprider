/***
 * 自定义规则文件
 * @type {{doParser, log, loadLocalParser, initParser, PARSER_MAPPER}|*}
 */
var parserHandler = require('../parser_handler');
var config = require('../config/config');
var utils = require('../utils/utils');

var RULE_NAME = 'article_list';

module.exports = {
    summary: "抓取微信公众号历史文章",
    * beforeSendResponse(requestDetail, responseDetail) {
        try {
            if (/mp\/homepage\?__biz=/.test(requestDetail.url)) {
                utils.log('【' + RULE_NAME + '】拦截成功......{homepage?}', config.LOG._LOG_LEVEL_INFO);
                const htmlString = responseDetail.response.body.toString();
                const result = parserHandler.doParser(htmlString, RULE_NAME);
                utils.log('爬取到的公众号历史文章列表......................' + JSON.stringify(result), config.LOG._LOG_LEVEL_INFO);
                return null;
            } else {
                return null;
            }
        } catch (e) {
            utils.log('Rule handler throw exception:' + e.message);
            return null;
        }
    }
};
