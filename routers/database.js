const mysql = require('mysql');
//服务器
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "moneyspeed",
    multipleStatements: true
});
//判断数据库连接是否成功
con.connect(function (err) {
    if (err) throw err;
});

module.exports = con