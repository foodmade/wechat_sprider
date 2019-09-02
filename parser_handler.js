const cheerio = require('cheerio');
const urlencode = require('urlencode');
const utils = require('./utils/utils');
const vm = require('vm');
const lineReader = require('line-reader');
const iconv = require('iconv-lite');
const HashMap = require('hashmap');
const fileUtil = require('./utils/file_util');
const config = require('./config/config');

const SUCCESS = 1;
const FAIL = -1;

module.exports = {
    PARSER_MAPPER:new HashMap(),
    initParser:function (parserOptions) {
        var THIS_MODULE = this;
        THIS_MODULE.loadLocalParser(parserOptions);
    },

    //加载解析器文件
    loadLocalParser:function (options) {

        var THIS_MODULE = this;

        if(options == undefined){
            THIS_MODULE.log('Not found anything parser mapper,Please check config');
            return;
        }
        THIS_MODULE.log('Parser options:' + JSON.stringify(options),config.LOG._LOG_LEVEL_DEBUG);

        const keys = Object.keys(options);

        THIS_MODULE.log('Parser mapper all keys:' + JSON.stringify(keys),config.LOG._LOG_LEVEL_DEBUG);

        if(keys.length === 0){
            THIS_MODULE.log('No parsers!!!',config.LOG._LOG_LEVEL_ERROR);
            return;
        }
        var i = 0;
        for(let key in options){
            THIS_MODULE.log('Read parser filePath['+i+']：' + options[key],config.LOG._LOG_LEVEL_DEBUG);
            var parsers = fileUtil.readDirAllFile(options[key]);
            THIS_MODULE.log('Data parser['+key+']:  ' + parsers,config.LOG._LOG_LEVEL_DEBUG);
            THIS_MODULE.PARSER_MAPPER.set(key,parsers);
            THIS_MODULE.log('Load ['+key+'] success',config.LOG._LOG_LEVEL_INFO);
            i++;
        }
        THIS_MODULE.log('Cache parser list=============>:' + THIS_MODULE.PARSER_MAPPER.get('article_list'),config.LOG._LOG_LEVEL_DEBUG);
    },

    //执行解析规则
    doParser:function(htmlString,ruleNam){
        var THIS_MODULE = this;
        var result = {
            code:SUCCESS,

        };

        var parsers = THIS_MODULE.PARSER_MAPPER.get(ruleNam);

        if(parsers == undefined || parsers.length === 0){
            THIS_MODULE.log('Not found ruleName\'s ['+ruleNam+'] parser handler');
            result.code = FAIL;
            return result;
        }

        THIS_MODULE.log('Get '+parsers.length+' parsers,ruleName:[' + ruleNam +']',config.LOG._LOG_LEVEL_DEBUG)

        for(var i = 0; i < parsers.length; ++i){
            try{
                var dParser = parsers[i];
                var sharedParam = {
                    vm:vm,
                    iconv:iconv,
                    urlencode:urlencode,
                    htmlString:htmlString,
                    utils:utils,
                    cheerio:cheerio,
                    config:config,
                    parserInfo:{},
                    result:{}
                };

                vm.runInNewContext(dParser, sharedParam);
                result = sharedParam.result;
                var parserInfo = sharedParam.parserInfo;
                if(result.code === SUCCESS){
                    THIS_MODULE.log('DParser ' + parserInfo.index + '(ver ' + parserInfo.ver +  ') parse OK, retcode:' + result.code,
                        config.LOG._LOG_LEVEL_INFO);
                    return result;
                }else{
                    THIS_MODULE.log('DParser ' + parserInfo.index + '(ver ' + parserInfo.ver +  ') parse Failed, retcodes:' + result.code,
                        config.LOG._LOG_LEVEL_WARNING);
                }

            }catch(exp){
                THIS_MODULE.log('DParser ' + i + ' do parsing exception:' + exp.message, config.LOG._LOG_LEVEL_ERROR);
                THIS_MODULE.log('DParser ' + i + ' do parsing exception:' + exp.stack, config.LOG._LOG_LEVEL_ERROR);
            }
        }
    },

    log:function (log,level) {
        utils.log('<Parser handler> ' + log, level);
    }

};