const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const safetyall = express.Router();
//获取保险管理列表
safetyall.get('/api/getInsuranceTable', (req, res) => {
    con.query("SELECT * FROM insuranceControl", function (err, result) {
        if (err) throw err;
        let arr = result.map(row => ({ id: row.id, ccode: row.ccode, name: row.name, useday: row.useday, baltype: row.baltype, publish: row.publish, revenue: row.revenue, remarks: row.remarks }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//添加保险记录信息
safetyall.post('/api/postInsurancedata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { ccode, name, useday, baltype, publish, revenue, remarks } = req.body;
    const query = "INSERT INTO insuranceControl(ccode,name,useday,baltype,publish,revenue,remarks) VALUES(?,?,?,?,?,?,?)";
    con.query(query,[ccode,name,useday,baltype,publish,revenue,remarks], function (err,result) {
        if (err) {
            res.json([{ 'ret': false,'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true,'code': '添加成功' }]);
        }
    });
});
//通过id获取保险管理以修改
safetyall.get('/api/getInsuranceIdTable', (req, res) => {
    const query = `SELECT * FROM insuranceControl WHERE id = ?`;
    con.query(query,[req.query.ids], function (err,result) {
        if (err) throw err;
        const arr = result.map(row => ({id: row.id, ccode: row.ccode,name: row.name,useday: row.useday,baltype: row.baltype,publish: row.publish,revenue: row.revenue,remarks: row.remarks}));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true,'code': JSON.stringify(arr)}]);
    });
});

//更新保险管理条目
safetyall.post('/api/updateInsuranceTable', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { ccode,name,useday,baltype,publish,revenue,remarks,sentid } = req.body;
    const query = `UPDATE insuranceControl SET ccode = ?, name = ?, useday = ?, baltype = ?, publish = ?, revenue = ?, remarks = ? WHERE id = ?`;
    con.query(query,[ccode,name,useday,baltype,publish,revenue,remarks,sentid], function (err,result) {
        if (err) {
            res.json([{ 'ret': false,'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true,'code': '更新成功' }]);
        }
    });
});
//删除保险管理条目
safetyall.post('/api/deleteInsurance', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM insuranceControl WHERE id IN (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': '请选择要删除的记录' }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//搜索保险管理条目
safetyall.get('/api/searchInsuranceTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let mysqlCom = "SELECT * FROM insuranceControl WHERE 1=1";
    if (req.query.name) {
        mysqlCom += ` AND name LIKE '%${req.query.name}%'`;
    }
    if (req.query.useday) {
        mysqlCom += ` AND useday = '${req.query.useday}'`;
    }
    if (req.query.baltype && req.query.baltype !== '== 请选择 ==') {
        mysqlCom += ` AND baltype = ${req.query.baltype}`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            ccode: item.ccode,
            name: item.name,
            useday: item.useday,
            baltype: item.baltype,
            publish: item.publish,
            revenue: item.revenue,
            remarks: item.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});

module.exports = safetyall