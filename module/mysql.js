var mysql = require('mysql');
/**
 * 这里的地址要修改哇 服务器的地址
 */
module.exports = function (sql, val, callback) {
    var config = mysql.createConnection({
        // host: "localhost", //数据库的地址
        // user: "root",
        // password: "kiss15081166065..",
        host: "39.107.65.250", //数据库的地址
        user: "admin",
        password: "admin1",
        port: "3306", //数据库端口
        database: "blog"
    });
    config.connect();//开始连接
    //进行数据库操作 1.数据库代码 2.回调
    config.query(sql, val, (err, data) => {
        callback && callback(err, data);
    });
    config.end(); //结束连接
};
