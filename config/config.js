var _LOG_LEVEL_NO_LOG = 0;
var _LOG_LEVEL_ERROR = 1;
var _LOG_LEVEL_WARNING = 2;
var _LOG_LEVEL_INFO = 4;
var _LOG_LEVEL_DEBUG = 8;

module.exports = {

    PARSER_MAPPER:{
        //获取文章列表
        'article_list':'./parser/article'
    },
    SERVER:{
        proxy_port:8001,
        web_port:8002
    },
    DATA_CENTER:{
        taskRspPath:'/commitTaskResult.do',//Submit crawler parsed data to the server
        taskRspMethod:'POST',
        taskRspHeaders:{
            'Host':'127.0.0.1',
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'identity',
            'Connection':'keep-alive'
        }
    },
    DATA_CENTER:{
        accessToken:'',
        hostname:'127.0.0.1',              //Server address
        port:80,
        agent:false,
        taskRspPath:'/commitTaskResult.do',//Submit crawler parsed data to the server
        taskRspMethod:'POST',
        taskRspHeaders:{
            'Host':'127.0.0.1',
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'identity',
            'Connection':'keep-alive'
        }
    },
    LOG:{
        level:_LOG_LEVEL_INFO,
        _LOG_LEVEL_NO_LOG:_LOG_LEVEL_NO_LOG,
        _LOG_LEVEL_ERROR:_LOG_LEVEL_ERROR,
        _LOG_LEVEL_WARNING:_LOG_LEVEL_WARNING,
        _LOG_LEVEL_INFO:_LOG_LEVEL_INFO,
        _LOG_LEVEL_DEBUG:_LOG_LEVEL_DEBUG
    },

};