const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const brainall = express.Router();
//获取思维导图列表
brainall.get('/api/getBrainMap', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("SELECT * FROM brainMapList ORDER BY title", function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ id: row.id, title: row.title, content: row.content, publish: row.publish }));
        res.json([{ ret: true, code: JSON.stringify(arr) }]);
    });
});
//添加新思维导图
brainall.post('/api/newBrainMap', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO brainMapList(title, content, publish) VALUES(?,?,?)", [req.body.title, req.body.content, req.body.publish], function (err, result, fields) {
        if (err) {
            res.json([{ 'false': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//删除思维导图
brainall.post('/api/deleteBrainMap', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM brainMapList WHERE id = (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除思维导图` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//通过id获取思维导图
brainall.get('/api/getBrainMapId', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`SELECT * FROM brainMapList WHERE id = ${req.query.ids}`, function (err, result) {
        if (err) throw err;
        let arr = result.map(row => ({
            'id': row.id,
            'title': row.title,
            'content': row.content,
            'publish': row.publish
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新思维导图
brainall.post('/api/updateBrainMap', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    let updateBrainMap = `UPDATE brainMapList SET title = ?, content = ?, publish = ? WHERE id = ?`;
    con.query(updateBrainMap, [req.body.title, req.body.content, req.body.publish, req.body.ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//搜索思维导图
brainall.get('/api/searchBrainMap', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let mysqlCom = "SELECT * FROM brainMapList WHERE 1=1";
    if (req.query.title) {
        mysqlCom += ` AND title LIKE '%${req.query.title}%'`;
    }
    if (req.query.content) {
        mysqlCom += ` OR content LIKE '%${req.query.content}%'`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            id: row.id,
            title: row.title,
            content: row.content,
            publish: row.publish
        }));
        res.json([{ ret: true, code: JSON.stringify(arr) }]);
    });
});
module.exports = brainall