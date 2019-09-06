'use strict';
const mysql      = require('mysql');
const utils      = require('../utils/utils');
const config     = require('../config/config');

/**
 * mysql连接
 */
class Db{

    /**
     * 初始化mysql连接
     */
    constructor(){
        this.host       = config.DB_CONFIG.host;
        this.port       = config.DB_CONFIG.port;
        this.username   = config.DB_CONFIG.username;
        this.password   = config.DB_CONFIG.password;
        this.database   = config.DB_CONFIG.database;
        this.connection = {};
        this.connectionDB();
    }

    static _INSTALL(){

        if(!Db.install){
            Db.install = new Db();
        }
        return Db.install;
    }

    connectionDB(){
        try {
            this.connection = mysql.createConnection({
                host: this.host,
                user: this.username,
                password: this.password,
                port: this.port,
                database: this.database
            });
            this.connection.connect();
        } catch (e) {
            utils.log('<Mysql connection init load error!!>' + e.message,config.LOG._LOG_LEVEL_ERROR);
            return;
        }

        utils.log('<Mysql connection Success>',config.LOG._LOG_LEVEL_INFO);
    }

    /**
     * Execute query sql for mysql connection
     */
    exec_query(sql, success, err){
        this.connection.query(sql,function (error, results, fields) {
            if (error) {
                err(error);
            }else{
                success(results);
            }
        })
    }

    /**
     * Execute insert sql for mysql
     */
    exec_sp(sql, params, item,success, err){
        this.connection.query(sql,params,function (error, result) {
            if (error) {
                err(error);
            }else{
                success(result,item);
            }
        });
    }
}

module.exports = Db;
