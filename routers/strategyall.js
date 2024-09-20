const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const strategyall = express.Router();
const localCityInfo = require('../public/js/mapjson/citylocation.json');
const localCityBeijing = require('../public/js/mapjson/beijingCityGeo.json');
const localCityShenzhen = require('../public/js/mapjson/shenzhenCityGeo.json');
//获取思维扩展列表
strategyall.get('/api/getIdeasExtentions', (req, res) => {
    const keyword = req.query.keyword;
    con.query(`SELECT * FROM ideaArticles WHERE title LIKE '%${keyword}%'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ id: row.id, title: row.title, content: row.content }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': arr }]);
    });
});
//添加思维扩展列表
strategyall.post('/api/postIdeasExtensions', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO ideaArticles(title,content) VALUES(?,?)", [req.body.title, req.body.content], function (err, result) {
        if (err) {
            res.status(500).json({ 'ret': false, 'code': '添加失败' });
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//删除思维扩展列表
strategyall.post('/api/deleteIdeasExtensions', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM ideaArticles WHERE id IN (${req.body.ids})`, function (err, result) {
        if (err) {
            res.status(500).json({ 'ret': false, 'code': `删除失败` });
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//通过id获取思维扩展详情
strategyall.get('/api/getIdeasContent', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query('SELECT * FROM ideaArticles WHERE id = ?', [req.query.ids], function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ id: row.id, title: row.title, content: row.content }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新思维扩展详情
strategyall.post('/api/updateIdeasContent', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
  try {
    const { title, content, id } = req.body;
    const query = 'UPDATE ideaArticles SET title = ?, content = ? WHERE id = ?';
    con.query(query, [title, content, id]);
    res.json([{ 'ret': true, 'code': '更新成功' }]);
  } catch (err) {
    if (err.code == 'ER_DUP_ENTRY') {
      res.json([{ 'ret': false, 'code': '请填写信息' }]);
    } else {
      res.json([{ 'ret': false, 'code': '更新失败' }]);
    }
  }
});
//获取城市投资列表
strategyall.get('/api/getInvestTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`SELECT * FROM investTable WHERE area = ?`, [req.query.area], function (err, result, fields) {
        if (err){
            res.json([{ 'ret': true, 'code': '获取列表失败' }]);
        }else{
            let arr = result.map(row => ({
                id: row.id,
                investname: row.investname,
                useday: row.useday,
                baltype: row.baltype,
                publish: row.publish,
                revenue: row.revenue,
                remarks: row.remarks
            }));
            res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
        }
    });
});
//添加投资城市信息
strategyall.post('/api/postInvestdata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO investTable(investname, useday, baltype, publish, revenue, remarks, area) VALUES(?,?,?,?,?,?,?)", [req.body.name, req.body.useday, req.body.baltype, req.body.publish, req.body.revenue, req.body.remarks, req.body.area], function (err, result) {
        if (err) {
            res.json([{ 'ret': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//通过id获取投资城市信息以修改
strategyall.get('/api/getInvestIdTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`SELECT * FROM investTable WHERE id = '${req.query.ids}'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            id: row.id,
            investname: row.investname,
            useday: row.useday,
            baltype: row.baltype,
            publish: row.publish,
            revenue: row.revenue,
            remarks: row.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新投资城市信息条目
strategyall.post('/api/updateInvestTable', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    let query = `UPDATE investTable SET investname = ?, useday = ?, baltype = ?, publish = ?, revenue = ?, remarks = ? WHERE id = ?`;
    let values = [req.body.name, req.body.useday, req.body.baltype, req.body.publish, req.body.revenue, req.body.remarks, req.body.sentid];
    con.query(query, values,function (err,result) {
        if (err) {
            res.json([{ 'ret': false,'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true,'code': '更新成功' }]);
        }
    });
});
//获取投资城市区域划分
strategyall.get('/api/getCityChoose', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8")
    if (req.query.city == 'shenzhen') {
        res.json([{ 'ret': true, 'code': JSON.stringify(localCityShenzhen) }]);
    } else if (req.query.city == 'beijing') {
        res.json([{ 'ret': true, 'code': JSON.stringify(localCityBeijing) }]);
    } else if (req.query.city == 'locationInfo') {
        res.json([{ 'ret': true, 'code': JSON.stringify(localCityInfo) }]);
    }
});
//删除投资城市信息条目
strategyall.post('/api/deleteInvest', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM investTable WHERE id IN (?)`, [req.body.ids], function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除的记录` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//搜索投资城市条目
strategyall.get('/api/searchInvestTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { area, name = '', useday = '', baltype } = req.query;
    let mysqlCom = `SELECT * FROM investTable WHERE area = '${area}'`;
    if (name) {
        mysqlCom += ` AND investname LIKE '%${name}%'`;
    }
    if (useday) {
        mysqlCom += ` AND useday = '${useday}'`;
    }
    if (baltype && baltype !== '== 请选择 ==') {
        mysqlCom += ` AND baltype = ${baltype}`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            investname: item.investname,
            useday: item.useday,
            baltype: item.baltype,
            publish: item.publish,
            revenue: item.revenue,
            remarks: item.remarks
        }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});

module.exports = strategyall
