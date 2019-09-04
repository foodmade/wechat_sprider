var SUCCESS = 1;
var FAIL    = -1;
var INDEX   = 0;
var VER     = '1.0.0';

function log(log){
    utils.log('{DParser wechat:history article list: ' + log);
}

try{

    var $ = cheerio.load(htmlString);

    $('script').each(function (i, ele) {
        if(i === 13){
            var content = $(this).text();
            var appendText = 'var window = {__initCatch:false};';
            content = content.replace('seajs.use','');
            content = appendText + content;
            content = eval('(function() {'+content+'; return data;})()');
            result.code = SUCCESS;
            
            var msgList = content.appmsg_list;
            
            result.content = msgList;

        }
    });

    if(result.content === undefined || result.content === '' || result.content === null){
        result.code = FAIL;
    }

    parserInfo.ver = VER;
    parserInfo.index = INDEX;


}catch(exp){
    log('Parsing exception:' + exp.message);
}