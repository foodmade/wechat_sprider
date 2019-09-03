const config = require('../config/config');
var http     = require('http');
var https    = require('https');
var domain   = require('domain');
var URL      = require("url");
var request  = require("request");
var querystring = require("querystring");

var _SOCK_TIME_OUT = 10000;

function log(content,level){
    if(!level){
        level = config.LOG._LOG_LEVEL_INFO;
    }

    if(config.LOG.level >= level){
        console.log('[' + dateTimeFormat(new Date(),'yyyy-MM-dd hh:mm:ss') + ' <lvl:' + level + '> ]' + content);
    }
}

function dateTimeFormat(date, fmt) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function httpRequest_POST(options, postData, errorCallback, successCallBack){


    if(typeof errorCallback != 'function'){
        errorCallback = function(){}
    }

    if(typeof successCallBack != 'function'){
        successCallBack = function(){}
    }

    if(postData == null || postData == undefined){
        postData = {};
    }

    //var dataString = JSON.stringify(postData);


    var dm = domain.create();


    dm.on('error', function(err) {
        moduleLog('HTTP POST error(httpRequest_POST):' + err.message, config.LOG._LOG_LEVEL_ERROR);
        errorCallback(err);
    });

    dm.run(function(){

        var dataString = '';

        if(typeof  postData == 'object'){
            dataString = JSON.stringify(postData);
        }else{
            dataString = postData;
        }


        var req = http.request(options, function(rsp) {

            var byteRecvCount = 0;
            var byteChunks = [];

            rsp.on('data', function (chunk) {

                byteRecvCount += chunk.length;
                byteChunks.push(chunk);

            });

            rsp.on('end', function(){
                var rspData = (Buffer.concat(byteChunks, byteRecvCount));
                successCallBack(rsp, rspData);
            });
        });

        req.setTimeout(_SOCK_TIME_OUT, function(){
            moduleLog('HTTP POST Timeout (httpRequest_POST)', config.LOG._LOG_LEVEL_ERROR);
            //req.abort();
            errorCallback({message:'<App error> conn time out.'});

        });

        req.on('error', function(e) {
            moduleLog('HTTP POST error(httpRequest_POST):' + e.message, config.LOG._LOG_LEVEL_ERROR);
            errorCallback(e);

        });

        /*
        req.on('close', function() {
            errorCallback({message:'<App error> conn closed.'});
            log('Utils HTTP POST close (httpRequest_POST):connection closed.', config.LOG._LOG_LEVEL_ERROR);
        }); */



        req.write(dataString + '\n');
        req.end();

    });

}

function httpsRequest_POST(options, postData, errorCallback, successCallBack){


    if(typeof errorCallback != 'function'){
        errorCallback = function(){}
    }

    if(typeof successCallBack != 'function'){
        successCallBack = function(){}
    }

    var dataString = JSON.stringify(postData);


    var dm = domain.create();


    dm.on('error', function(err) {
        moduleLog('HTTPS POST error(httpsRequest_POST):' + err.message, config.LOG._LOG_LEVEL_ERROR);
        errorCallback(err);
    });

    dm.run(function(){


        var req = https.request(options, function(rsp) {

            var byteRecvCount = 0;
            var byteChunks = [];

            rsp.on('data', function (chunk) {

                byteRecvCount += chunk.length;
                byteChunks.push(chunk);

            });

            rsp.on('end', function(){
                var rspData = (Buffer.concat(byteChunks, byteRecvCount));
                successCallBack(rsp, rspData);
            });
        });

        req.setTimeout(_SOCK_TIME_OUT, function(){
            moduleLog('HTTPS POST Timeout (httpsRequest_POST)', config.LOG._LOG_LEVEL_ERROR);
            errorCallback({message:'<App error> conn time out.'});

        });

        req.on('error', function(e) {
            moduleLog('HTTPS POST error(httpsRequest_POST):' + e.message, config.LOG._LOG_LEVEL_ERROR);
            errorCallback(e);

        });



        req.write(dataString + '\n');
        req.end();

    });

}



function httpRequest_GET(options, errorCallback, successCallBack){

    if(typeof errorCallback != 'function'){
        errorCallback = function(){}
    }

    if(typeof successCallBack != 'function'){
        successCallBack = function(){}
    }

    var dm = domain.create();

    dm.on('error', function(err) {
        moduleLog('HTTP GET error(domain catch):' + err.message, config.LOG._LOG_LEVEL_ERROR);
        errorCallback(err);

    });

    dm.run(function(){

        var getReq = http.get(options, function(rsp) {
            var byteRecvCount = 0;
            var byteChunks = [];

            moduleLog('Http rsp state code:' + rsp.statusCode, config.LOG._LOG_LEVEL_DEBUG);
            rsp.on('data', function (chunk) {
                byteRecvCount += chunk.length;
                byteChunks.push(chunk);
                moduleLog('Http rsp data coming,chunk length:' + chunk.length + ', total:' + byteRecvCount, config.LOG._LOG_LEVEL_DEBUG);
            });

            rsp.on('end', function () {
                moduleLog('Http rsp data end.', config.LOG._LOG_LEVEL_DEBUG);
                var rspData = (Buffer.concat(byteChunks, byteRecvCount));
                successCallBack(rsp, rspData);

            });

            getReq.on('error', function (err) {
                moduleLog('HTTP GET DATA error:' + err.message, config.LOG._LOG_LEVEL_ERROR);
                errorCallback(err);
            });

            /*
            getReq.on('close', function() {
                errorCallback({message:'<App error> conn closed.'});
                log('Utils HTTP GET close (httpRequest_GET): connection closed.', config.LOG._LOG_LEVEL_ERROR);
            }); */
        });

        getReq.setTimeout(_SOCK_TIME_OUT, function(){
            moduleLog('HTTP GET Timeout (httpRequest_GET)', config.LOG._LOG_LEVEL_ERROR);
            //getReq.abort();
            errorCallback({message:'<App error> conn time out.'});

        });

        getReq.end();


    });

}


function httpsRequest_GET(options, errorCallback, successCallBack){

    if(typeof errorCallback != 'function'){
        errorCallback = function(){}
    }

    if(typeof successCallBack != 'function'){
        successCallBack = function(){}
    }

    var dm = domain.create();

    dm.on('error', function(err) {
        moduleLog('HTTP GET error(domain catch):' + err.message, config.LOG._LOG_LEVEL_ERROR);
        errorCallback(err);

    });

    dm.run(function(){

        var getReq = https.get(options, function(rsp) {
            var byteRecvCount = 0;
            var byteChunks = [];

            moduleLog('Http rsp state code:' + rsp.statusCode, config.LOG._LOG_LEVEL_DEBUG);
            rsp.on('data', function (chunk) {
                byteRecvCount += chunk.length;
                byteChunks.push(chunk);
                moduleLog('Http rsp data coming,chunk length:' + chunk.length + ', total:' + byteRecvCount, config.LOG._LOG_LEVEL_DEBUG);
            });

            rsp.on('end', function () {
                moduleLog('Http rsp data end.', config.LOG._LOG_LEVEL_DEBUG);
                var rspData = (Buffer.concat(byteChunks, byteRecvCount));
                successCallBack(rsp, rspData);

            });

            getReq.on('error', function (err) {
                moduleLog('HTTP GET DATA error:' + err.message, config.LOG._LOG_LEVEL_ERROR);
                errorCallback(err);
            });

            /*
             getReq.on('close', function() {
             errorCallback({message:'<App error> conn closed.'});
             log('Utils HTTP GET close (httpRequest_GET): connection closed.', config.LOG._LOG_LEVEL_ERROR);
             }); */
        });

        getReq.setTimeout(_SOCK_TIME_OUT, function(){
            moduleLog('HTTP GET Timeout (httpRequest_GET)', config.LOG._LOG_LEVEL_ERROR);
            //getReq.abort();
            errorCallback({message:'<App error> conn time out.'});

        });

        getReq.end();


    });

}





function httpRequest(options, errorCallback, successCallBack){

    var method = options.method;

    switch(method){
        case 'GET':
        case 'get':
        case 'Get':
            if(options.scheme == 'http'){

                moduleLog('Do http GET', config.LOG._LOG_LEVEL_WARNING);
                httpRequest_GET(options, errorCallback, successCallBack);

            }else if(options.scheme == 'https'){

                moduleLog('Do https GET', config.LOG._LOG_LEVEL_WARNING);
                httpsRequest_GET(options, errorCallback, successCallBack);

            }else{
                moduleLog('Do http GET by default', config.LOG._LOG_LEVEL_WARNING);
                httpRequest_GET(options, errorCallback, successCallBack);
            }
            break;
        case 'POST':
        case 'Post':
        case 'post':
            if(options.scheme == 'http'){
                moduleLog('Do http POST', config.LOG._LOG_LEVEL_WARNING);
                httpRequest_POST(options, options.postdata, errorCallback, successCallBack);
            }
            else if(options.scheme == 'https'){
                moduleLog('Do https POST', config.LOG._LOG_LEVEL_WARNING);
                httpsRequest_POST(options, options.postdata, errorCallback, successCallBack);
            }else{

                moduleLog('Do http POST by default', config.LOG._LOG_LEVEL_WARNING);
                httpRequest_POST(options, options.postdata, errorCallback, successCallBack);

            }

            break;
        default :
            moduleLog('Do http GET by undefined method type', config.LOG._LOG_LEVEL_WARNING);
            httpRequest_GET(options, errorCallback, successCallBack);

    }
}




function httpGet(url, errorCallback, successCallBack){
    if(typeof errorCallback != 'function'){
        errorCallback = function(){}
    }

    if(typeof successCallBack != 'function'){
        successCallBack = function(){}
    }

    var dm = domain.create();

    dm.on('error', function(err) {
        errorCallback(err);
        moduleLog('httpGET() error:' + err.message, config.LOG._LOG_LEVEL_ERROR);
    });

    dm.run(function(){

        var getReq = http.get(url, function(rsp){
            var byteRecvCount = 0;
            var byteChunks = [];

            moduleLog('httpGET() rsp state code:' + rsp.statusCode, config.LOG._LOG_LEVEL_DEBUG);
            rsp.on('data', function (chunk) {
                byteRecvCount += chunk.length;
                byteChunks.push(chunk);
                moduleLog('httpGET() rsp data coming,chunk length:' + chunk.length + ', total' + byteRecvCount, config.LOG._LOG_LEVEL_DEBUG);
            });

            rsp.on('end', function () {
                var rspData = (Buffer.concat(byteChunks, byteRecvCount));
                successCallBack(rsp, rspData);
                moduleLog('httpGET() rsp data end.', config.LOG._LOG_LEVEL_DEBUG);
            });

            getReq.on('error', function (err) {
                errorCallback(err);
            });

        });

        getReq.setTimeout(_SOCK_TIME_OUT/*, function(){
            errorCallback({message:'<App error> conn time out.'});
            log('Utils HTTP GET Timeout (httpGet)', config.LOG._LOG_LEVEL_ERROR);
        }*/);

        getReq.on('error',function(err){
            errorCallback(err);
            moduleLog('httpGET() error:' + err.message, config.LOG._LOG_LEVEL_ERROR);
        });



    });


}




function httpsGet(url, errorCallback, successCallBack){
    if(typeof errorCallback != 'function'){
        errorCallback = function(){}
    }

    if(typeof successCallBack != 'function'){
        successCallBack = function(){}
    }

    var dm = domain.create();

    dm.on('error', function(err) {
        errorCallback(err);
        moduleLog('httpsGET() error:' + err.message, config.LOG._LOG_LEVEL_ERROR);
    });

    dm.run(function(){

        var getReq = https.get(url, function(rsp){
            var byteRecvCount = 0;
            var byteChunks = [];

            moduleLog('httpsGET() rsp state code:' + rsp.statusCode, config.LOG._LOG_LEVEL_DEBUG);
            rsp.on('data', function (chunk) {
                byteRecvCount += chunk.length;
                byteChunks.push(chunk);
                moduleLog('httpsGET() rsp data coming,chunk length:' + chunk.length + ', total' + byteRecvCount, config.LOG._LOG_LEVEL_DEBUG);
            });

            rsp.on('end', function () {
                var rspData = (Buffer.concat(byteChunks, byteRecvCount));
                successCallBack(rsp, rspData);
                moduleLog('httpsGET() rsp data end.', config.LOG._LOG_LEVEL_DEBUG);
            });

            getReq.on('error', function (err) {
                errorCallback(err);
            });

        });

        getReq.setTimeout(_SOCK_TIME_OUT/*, function(){
            errorCallback({message:'<App error> conn time out.'});
            log('Utils HTTP GET Timeout (httpsGet)', config.LOG._LOG_LEVEL_ERROR);
        }*/);

        getReq.on('error',function(err){
            errorCallback(err);
            moduleLog('httpsGET() error:' + err.message, config.LOG._LOG_LEVEL_DEBUG);
        });


    });
}

function httpsPost(options,errback,successback) {
    request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            successback(response,body);
        }else{
            errback(error);
        }
    });
}

/**
 * 解析url中的参数
 * @param url 原始url
 * @returns {ParsedUrlQuery} 参数对象
 */
function parserUrlParams(url) {
    let arg = URL.parse(url).query;
    return querystring.parse(arg);
}


function moduleLog(lg, level){
    log('<Utils>' + lg, level);
}

exports.log               = log;
exports.httpRequest_POST  = httpRequest_POST;
exports.httpRequest_GET   = httpRequest_GET;
exports.httpsRequest_POST = httpsRequest_POST;
exports.httpsRequest_GET  = httpsRequest_GET;
exports.httpRequest       = httpRequest;
exports.httpsGet          = httpsGet;
exports.httpGet           = httpGet;
exports.httpsPost         = httpsPost;
exports.parserUrlParams   = parserUrlParams;
