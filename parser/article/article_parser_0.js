var SUCCESS = 1;
var FAIL = -1;

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
            result.content = content;
        }
    });

    if(result.content === undefined || result.content === '' || result.content === null){
        result.code = FAIL;
    }


}catch(exp){
    log('Parsing exception:' + exp.message);
}