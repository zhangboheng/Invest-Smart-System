const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const settingsall = express.Router();

//获取首页所有菜单列表
settingsall.get('/api/getMenuList', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("SELECT * FROM menuList ORDER BY positionids", function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ id: row.id, menuname: row.menuname, pathway: row.pathway, link: row.link, imgurl: row.imgurl, positionids: row.positionids }));
        res.json([{ ret: true, code: JSON.stringify(arr) }]);
    });
});
//添加菜单信息
settingsall.post('/api/addMenuList', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    const { menuname, pathway, link, imgurl, positionids } = req.body;
    con.query("INSERT INTO menuList (menuname, pathway, link, imgurl, positionids) VALUES (?, ?, ?, ?, ?)", [menuname, pathway, link, imgurl, positionids], function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//通过id获取菜单信息
settingsall.get('/api/getMenuListId', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("SELECT * FROM menuList WHERE id = ?", [req.query.ids], function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ id: row.id, menuname: row.menuname, pathway: row.pathway, link: row.link, imgurl: row.imgurl, positionids: row.positionids }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新菜单信息
settingsall.post('/api/updateMenuList', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    const id = req.params.id;
    const { menuname, pathway, link, imgurl, positionids } = req.body;
    con.query("UPDATE menuList SET menuname = ?, pathway = ?, link = ?, imgurl = ?, positionids = ? WHERE id = ?", [menuname, pathway, link, imgurl, positionids, id], function (err, result) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//删除菜单信息
settingsall.post('/api/deleteMenuList', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("DELETE FROM menuList WHERE id = ?", [req.body.ids], function (err, result) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除的菜单` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//搜索菜单信息
settingsall.get('/api/searchMenuList', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let mysqlCom = "SELECT * FROM menuList WHERE 1=1";
    if (req.query.menuname == '') {
        mysqlCom + ' ORDER BY positionids'
    }else{
        mysqlCom += ` AND menuname LIKE '%${req.query.menuname}%'`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        let arr = result.map(row => ({ id: row.id, menuname: row.menuname, pathway: row.pathway, link: row.link, imgurl: row.imgurl, positionids: row.positionids }));
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});

module.exports = settingsall