const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const todoall = express.Router();
//获取todo记录列表
todoall.get('/api/getTodoTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("SELECT * FROM todoList ORDER BY positionids", function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            toname: item.toname,
            ordertime: item.ordertime,
            remainder: item.remainder,
            ordertype: item.ordertype,
            positionids: item.remarks,
            remarks: item.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//添加todo信息
todoall.post('/api/postToDodata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO todoList(toname, ordertime, remainder, ordertype, remarks) VALUES(?,?,?,?,?)", [req.body.todoname, req.body.btime, req.body.revenue, req.body.type, req.body.remarks], function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//通过id获取todo信息以修改
todoall.get('/api/getToDoIdTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`SELECT * FROM todoList WHERE id = ?`, [req.query.ids], function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            toname: item.toname,
            ordertime: item.ordertime,
            remainder: item.remainder,
            ordertype: item.ordertype,
            remarks: item.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新todo信息
todoall.post('/api/updateToDodata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`UPDATE todoList SET toname = ?, ordertime = ?, remainder = ?, ordertype = ?, remarks = ? WHERE id = ?`, [req.body.todoname, req.body.btime, req.body.revenue, req.body.type, req.body.remarks, req.body.ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//完成todo信息
todoall.post('/api/updateCompleteToDodata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`UPDATE todoList SET ordertype = ? WHERE id = ?`, [req.body.type, req.body.ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '失败了' }]);
        } else {
            res.json([{ 'ret': true, 'code': '恭喜完成' }]);
        }
    });
});
//删除todo信息
todoall.post('/api/deleteToDoTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM todoList WHERE id = ?`, [req.body.ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除的记录` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//todo排序传输
todoall.post('/api/orderToDoTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    const ids = req.body.ids.split(',');
    ids.forEach((id, index) => {
        con.query(`UPDATE todoList SET positionids = ${index} WHERE id = ${id}`, (err, result) => {
            if (err) throw err;
        });
    });
});
//搜索todo记录
todoall.get('/api/searchToDoTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let mysqlCom = "SELECT * FROM todoList WHERE 1=1";
    if (req.query.toname != '') {
        mysqlCom += ` AND toname LIKE '%${req.query.toname}%'`;
    }
    if (req.query.type != '== 请选择 ==') {
        mysqlCom += ` AND remainder LIKE '%${req.query.type}%'`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        let arr = result.map(item => ({
            id: item.id,
            toname: item.toname,
            ordertime: item.ordertime,
            remainder: item.remainder,
            ordertype: item.ordertype,
            remarks: item.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});

module.exports = todoall