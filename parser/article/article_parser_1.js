var SUCCESS = 1;
var FAIL = -1;


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

}catch(exp){
    log('Parsing exception:' + exp.message);
}