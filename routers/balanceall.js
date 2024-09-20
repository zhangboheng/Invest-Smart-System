const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const balanceall = express.Router();
//获取收支记录列表
balanceall.get('/api/getBalanceTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("SELECT * FROM balanceAnalytics", function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            id: row.id,
            name: row.infoname,
            date: row.useday,
            money: row.money,
            baltype: row.baltype,
            remarks: row.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//添加收支记录信息
balanceall.post('/api/postBalancedata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO balanceAnalytics(infoname, useday, money, baltype, remarks) VALUES(?,?,?,?,?)", [req.body.infoname, req.body.useday, req.body.money, req.body.baltype, req.body.remarks], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//通过id获取收支记录以修改
balanceall.get('/api/getBalanceIdTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`SELECT * FROM balanceAnalytics WHERE id = '${req.query.ids}'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            id: row.id,
            infoname: row.infoname,
            useday: row.useday,
            money: row.money,
            baltype: row.baltype,
            remarks: row.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新收支记录
balanceall.post('/api/updateBalanceTable', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { infoname, useday, money, baltype, remarks, ids } = req.body;
    con.query(`UPDATE balanceAnalytics SET infoname = ?, useday = ?, money = ?, baltype = ?, remarks = ? WHERE id = ?`, [infoname, useday, money, baltype, remarks, ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//删除收支记录
balanceall.post('/api/deleteBalanceTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let idArr = req.body.ids;
    con.query(`DELETE FROM balanceAnalytics WHERE id IN (${idArr})`, function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除的记录` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//搜索收支记录
balanceall.get('/api/searchBalanceTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { infoname, useday, baltype } = req.query;
    let mysqlCom = "SELECT * FROM balanceAnalytics WHERE 1=1";
    const params = [];
    if (infoname) {
        mysqlCom += " AND infoname LIKE ?";
        params.push(`%${infoname}%`);
    }
    if (useday) {
        mysqlCom += " AND useday = ?";
        params.push(useday);
    }
    if (baltype && baltype !== '== 请选择 ==') {
        mysqlCom += " AND baltype = ?";
        params.push(baltype);
    }
    con.query(mysqlCom, params, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            id: row.id,
            infoname: row.infoname,
            useday: row.useday,
            money: row.money,
            baltype: row.baltype,
            remarks: row.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//获取每日收支结余
balanceall.get('/api/getFundsEcharts', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { stime, etime } = req.query;
    const queryKeys = `SELECT useday, SUM(IF(baltype = 0, -ROUND(money,2), ROUND(money,2))) AS money FROM balanceAnalytics WHERE useday BETWEEN ? AND ? GROUP BY useday ORDER BY useday;`;
    con.query(queryKeys, [stime, etime], function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ useday: row.useday, money: row.money }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//获取变动统计
balanceall.get('/api/getChangesEcharts', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { stime, etime } = req.query;
    const queryKeys = `
    SELECT infoname, SUM(ROUND(IF(baltype > 0 , money, -money),2)) AS money
    FROM  balanceAnalytics WHERE useday BETWEEN ? AND ?
    GROUP BY infoname ORDER BY money`;
    con.query(queryKeys, [stime, etime], function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ name: row.infoname, money: row.money }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});

module.exports = balanceall