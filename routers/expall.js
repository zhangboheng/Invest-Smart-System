const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const expall = express.Router();
//获取经验列表
expall.get('/api/getExperienceArticles', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("SELECT id, title, update_art FROM experienceShare ORDER BY update_art DESC", function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ id: row.id, title: row.title, update: row.update_art }));
        res.json([{ ret: true, code: JSON.stringify(arr) }]);
    });
});
//添加新经验
expall.post('/api/newExperienceArticles', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO experienceShare(title, content, publish, update_art) VALUES(?,?,?,NOW())", 
              [req.body.title, req.body.content, req.body.publish], function (err, result) {
        if (err) {
            console.error("Error:", err.message); // 打印错误信息
            res.json([{ 'false': false, 'code': '添加失败', 'error': err.message }]);
        } else {
            console.log("Insert ID:", result.insertId); // 打印插入ID
            res.json([{ 'ret': true, 'code': '添加成功', 'id': result.insertId }]);
        }
    });
});
//删除经验
expall.post('/api/deleteExperienceArticles', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM experienceShare WHERE id = (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除经验` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//通过id获取经验
expall.get('/api/getExperienceIdTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`SELECT * FROM experienceShare WHERE id = ${req.query.ids}`, function (err, result) {
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

// 更新经验
expall.post('/api/updateExperienceArticles', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    let updateExperience = `UPDATE experienceShare SET title = ?, content = ?, publish = ?, update_art = NOW() WHERE id = ?`;
    con.query(updateExperience, [req.body.title, req.body.content, req.body.publish, req.body.ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败', 'error': err.message }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//搜索经验
expall.get('/api/searchExperienceArticles', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let mysqlCom = "SELECT * FROM experienceShare WHERE 1=1";
    if (req.query.title) {
        mysqlCom += ` AND title LIKE '%${req.query.title}%'`;
    }
    if (req.query.content) {
        mysqlCom += ` OR content LIKE '%${req.query.content}%'`;
    }
    mysqlCom += " ORDER BY update_art DESC"
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

module.exports = expall