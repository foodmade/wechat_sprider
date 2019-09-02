var fs = require('fs');//引用文件系统模块


/**
 * 获取所有文件
 */
function getFileList(path) {
    var files = [];
    fs.readdirSync(path).forEach(fileName=>{
        files.push(fileName);
    });

    return files;
}

function readDirAllFile(path) {
    var fileData = [];
    var files = getFileList(path);

    files.forEach(fileName => {
        fileData.push(readSyncFile(path + '/' + fileName));
    });
    return fileData;
}

function readSyncFile(filePath){
    return fs.readFileSync(filePath,"utf-8");
}

exports.getFileList    = getFileList;
exports.readSyncFile   = readSyncFile;
exports.readDirAllFile = readDirAllFile;
