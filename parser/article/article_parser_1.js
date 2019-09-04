var SUCCESS = 1;
var FAIL    = -1;
var INDEX   = 1;
var VER     = '1.0.0';


function log(log){
    utils.log('{DParser wechat:history article list: ' + log);
}

try{

    var root = JSON.parse(htmlString);
    result.content = root.appmsg_list;

    if(result.content === undefined){
        result.code = FAIL;
    }else{
        result.code = SUCCESS;
    }

    parserInfo.ver = VER;
    parserInfo.index = INDEX;

}catch(exp){
    log('Parsing exception:' + exp.message);
}