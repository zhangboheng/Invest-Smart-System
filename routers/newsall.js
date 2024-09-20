var masync = require("async");
var request = require('request');
var cheerio = require('cheerio');
const express = require('express');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const con = require('./database.js');
var parseString = require('xml2js').parseString;
const { load, cut } = require('@node-rs/jieba')
//jieba Loading
load();
const stopwords = require('stopwords-zh');
const { removeStopwords } = require('stopword')
const newsall = express.Router();
var jiebaArr = [];
//获取新闻规则列表
newsall.get('/api/getRulesTable', (req, res) => {
  con.query(`SELECT * FROM editRulesTable`, function (err, result) {
    const arr = result.map(row => ({
      id: row.id,
      webname: row.webname,
      rulesname: row.rulesname,
      content: row.content,
      baltype: row.baltype,
      catalogue: row.catalogue,
      useday: row.useday,
      action: row.action,
      valid: row.valid,
      classmodel: row.classmodel,
      totals: row.totals
    }));
    res.header("Content-Type", "application/json; charset=utf-8")
    res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
  });
});
//添加新闻规则条目
newsall.post('/api/postRulesdata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8")
    con.query("INSERT INTO editRulesTable(webname, rulesname, content, baltype, catalogue, useday, action, classmodel) VALUES(?,?,?,?,?,?,?,?)", [req.body.web, req.body.name, req.body.content, req.body.baltype, req.body.catalogue, req.body.useday, req.body.action, req.body.classmodel], function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//通过id获取新闻规则条目
newsall.get('/api/getRulesIdTable', (req, res) => {
    con.query(`SELECT * FROM editRulesTable WHERE id = '${req.query.ids}'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            webname: item.webname,
            rulesname: item.rulesname,
            content: item.content,
            baltype: item.baltype,
            catalogue: item.catalogue,
            useday: item.useday,
            action: item.action,
            classmodel: item.classmodel,
            totals: item.totals
        }));
        res.header("Content-Type", "application/json; charset=utf-8")
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新新闻规则条目
newsall.post('/api/updateRulesTable', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8")
    const {web: webname, name: rulesname, useday, baltype, catalogue, content, action, classmodel, sentid} = req.body;
    const query = `UPDATE editRulesTable SET webname = ?, rulesname = ?, useday = ?, baltype = ?, catalogue = ?, content = ?, action = ?, classmodel = ? WHERE id = ?`;
    con.query(query,[webname,rulesname ,useday,baltype,catalogue,content ,action,classmodel,sentid], function (err,result) {
        if (err) {
            res.json([{ 'ret': false,'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true,'code': '更新成功' }]);
        }
    });
});
//删除新闻规则条目
newsall.post('/api/deleteRules', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8")
    con.query(`DELETE FROM editRulesTable WHERE id IN (${req.body.ids})`, function (err, result) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除的记录` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//搜索新闻规则条目
newsall.get('/api/searchRulesTable', (req, res) => {
    let mysqlCom = `SELECT * FROM editRulesTable WHERE 1=1`
    if (req.query.web != '') {
        mysqlCom += ` AND webname LIKE '%${req.query.web}%'`;
    }
    if (req.query.baltype != '== 请选择 ==') {
        mysqlCom += ` AND baltype = ${req.query.baltype}`;
    }
    if (req.query.action != '== 请选择 ==') {
        mysqlCom += ` AND action = ${req.query.action}`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            webname: item.webname,
            rulesname: item.rulesname,
            content: item.content,
            baltype: item.baltype,
            catalogue: item.catalogue,
            useday: item.useday,
            action: item.action,
            valid: item.valid,
            classmodel: item.classmodel,
            totals: item.totals
        }));
        res.header("Content-Type", "application/json; charset=utf-8")
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//提供寰宇新闻专区新闻采集信息
newsall.get('/api/globalNewsData', (req, res) => {
    var selectArr = [];//最新新闻集合
    var requests = [];
    var favorLists = [];//收藏新闻集合
    var totalsLists = {};//爬取数量集合
    con.query(`SELECT * FROM editRulesTable WHERE action = 1 AND catalogue = ${req.query.catalogue}; SELECT * FROM blackListWords WHERE id = 1; SELECT * FROM globalNewsTable ORDER BY stars;`, function (err, result, fields) {
        let resLength = result[0].length;
        let newsLength = result[2].length;
        for (let i = 0; i < resLength; i++) {
            requests.push({
                url: result[0][i].rulesname,
                method: 'GET',
                headers: {
                    'Content-Type': 'text/html; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
                }
            });
        }
        masync.map(requests,function (obj, callback) {
            request(obj, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    try{
                        if (body.trim()[0] != '<') {
                            body = JSON.parse(body);
                        }
                    }catch(err){
                        console.info(obj.url);
                    }
                    con.query(`UPDATE editRulesTable SET valid = 0 WHERE rulesname = '${obj.url}'`, function (err, result, fields) {});
                    callback(null, body);
                } else {
                    con.query(`UPDATE editRulesTable SET valid = 1, action = 0 WHERE rulesname = '${obj.url}'`, function (err, result, fields) {});
                    callback(error || response.statusCode);
                }
            });
        }, function (err, results) {
            if (err) {
                console.log(err)
            } else {
                for (var i = 0; i < results.length; i++) {
                    let checkClassModel = result[0][i].classmodel
                    let checkWebName = result[0][i].webname
                    let checkRulesName = result[0][i].rulesname
                    if (checkClassModel == 1) {
                        try{
                            for (let a of results[i].data) {
                                selectArr.push({ title: `【${checkWebName}】${a.target.title.trim()}`, url: `${`https://www.zhihu.com/question/` + a.target.id}` })
                            }
                        }catch(err){
                            selectArr.push({ title: "【知乎 api 出现问题，请检查地址以及配置规则】", url: "#" })
                        }
                    } else if (checkClassModel == 2) {
                        try{                        
                            for (let a of results[i].data.list) {
                                selectArr.push({ title: `【${checkWebName}】${a.title.trim()}`, url: `${a.url}` })
                            }
                        }catch(err){
                            selectArr.push({ title: "【腾讯新闻 api 出现问题，请检查地址以及配置规则】", url: "#" })
                        }
                    } else if (checkClassModel == 3) {
                        try{
                            for (let a of results[i].data.cards[0].card_group) {
                                selectArr.push({ title: `【${checkWebName}】${a.desc.trim()}`, url: `${a.scheme}` })
                            }
                        }catch(err){
                            selectArr.push({ title: "【微博 api 出现问题，请检查地址以及配置规则】", url: "#" })
                        }
                    } else if (checkClassModel == 4) {
                        const $ = cheerio.load(results[i]);
                        let splitArr = result[0][i].content.split(',');
                        for (let j = 0; j < splitArr.length; j++) {
                            $(`${splitArr[j]}`).each(function () {
                                if (checkRulesName == 'https://www.yicai.com/') {
                                    try{
                                        let keys = `${$(this).find('h2').text().match(/[\u4e00-\u9fa5]/gi) == null ? $(this).find('h2').text() : $(this).find('h2').text().trim()}`;
                                        selectArr.push({ title: `【${checkWebName}】` + keys, url: 'https://www.yicai.com' + `${$(this).attr('href')}` });
                                    }catch(err){
                                        selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                                    }
                                } else if (checkRulesName == 'https://business.sohu.com/') {
                                    try{
                                        let keys = `${$(this).text().match(/[\u4e00-\u9fa5]/gi) == null ? $(this).text() : $(this).text().trim()}`;
                                        selectArr.push({ title: `【${checkWebName}】` + keys, url: $(this).attr('href').indexOf('https') > -1 ? `${$(this).attr('href')}` : `https://www.sohu.com${$(this).attr('href')}` });
                                    }catch(err){
                                        selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                                    }
                                }else if(checkRulesName == 'https://369369.xyz/host/'){
                                    try{
                                        let keys = `${$(this).text().match(/[\u4e00-\u9fa5]/gi) == null ? $(this).text() : $(this).text().trim()}`;
                                        selectArr.push({ title: `【${checkWebName}】` + keys, url: `https://369369.xyz/host/${$(this).attr('href')}`});
                                    }catch(err){
                                        selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                                    }
                                }else if(checkRulesName == 'https://www.stcn.com/'){
                                    try{
                                        let paramName = `${$(this).attr('href')}`.indexOf('https://xp') == 0 ? `${$(this).attr('href')}` : new URL(checkRulesName).origin + `/${$(this).attr('href')}`;
                                        let keys = `${$(this).text().match(/[\u4e00-\u9fa5]/gi) == null ? $(this).text() : $(this).text().trim()}`;
                                        selectArr.push({ title: `【${checkWebName}】` + keys, url: paramName });
                                    }catch(err){
                                        selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                                    }
                                }else {
                                    try{
                                        let paramName = `${$(this).attr('href')}`.indexOf('/') == 0 ? `${$(this).attr('href')}` : `/${$(this).attr('href')}`;
                                        let keys = `${$(this).text().match(/[\u4e00-\u9fa5]/gi) == null ? $(this).text() : $(this).text().trim()}`;
                                        selectArr.push({ title: `【${checkWebName}】` + keys, url: new URL(checkRulesName).origin + paramName });
                                    }catch(err){
                                        selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                                    }
                                }
                            });
                        }
                    } else if (checkClassModel == 5) {
                        const $ = cheerio.load(results[i]);
                        let splitArr = result[0][i].content.split(',');
                        for (let j = 0; j < splitArr.length; j++) {
                            try{
                                $(`${splitArr[j]}`).each(function () {
                                    selectArr.push({ title: `【${checkWebName}】` + `${$(this).text().match(/[\u4e00-\u9fa5]/gi) == null ? $(this).text() : $(this).text().trim() }`, url: `${$(this).attr('href')}` })
                                });
                            }catch(err){
                                selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                            }
                        }
                    } else if (checkClassModel == 6) {
                        parseString(results[i], function (err, newsres) {
                            let rssList = newsres.rss.channel[0].item
                            try{
                                for(let i = 0; i < rssList.length; i++){
                                    selectArr.push({ title: `【${checkWebName}】` + rssList[i].title, url: rssList[i].link })
                                }
                            }catch(err){
                                selectArr.push({ title: `【${checkWebName} 出现问题，请检查地址以及配置规则】`, url: "#" });
                            }
                        });
                    }
                }
            }
            [...selectArr].map(x=>x.title.split('】')[0].slice(1)).forEach(function (x) { totalsLists[x] = (totalsLists[x] || 0) + 1; });
            let crawlTotalsKeys = Object.keys(totalsLists);
            let crawlTotalsVals = Object.values(totalsLists);
            for(let t = 0; t<crawlTotalsKeys.length; t++){
                con.query(`UPDATE editRulesTable SET totals = ${crawlTotalsVals[t]} WHERE webname = '${crawlTotalsKeys[t]}'`, function (err, result, fields) {});
            }
            const regex = new RegExp(`${result[1][0].title}`, 'g');
            selectArr = selectArr.sort((x, y) => x.title.length - y.title.length).filter(x => x.title.indexOf(`${req.query.yesfilter}`) > -1).filter((item, y) => !item.title.match(regex));
            selectArr = selectArr.filter(function (value, index) { return selectArr.map(x => x.title).indexOf(value.title) == index });
            //筛选出在收藏中文章
            for (let i = 0; i < newsLength; i++) {
                favorLists.push(result[2][i].title);
            }
            selectArr = selectArr.filter(x => favorLists.indexOf(x.title) == -1 && x.title.length >= 1);
            jiebaArr = selectArr.map(x=>x.title.replace(/【[^】]*】/g, ''));
            res.header("Content-Type", "application/json; charset=utf-8")
            res.json([{ 'ret': true, 'code': JSON.stringify(selectArr) }]);
        });
    });
});
//提供寰宇新闻专区政府公告信息
newsall.get('/api/globalAnnouncementData', (req, res) => {
    var selectArr = [];
    var page = req.query.page;
    var requests = [{
        uri: `http://sousuo.gov.cn/column/30469/${page}.htm`,
        method: 'GET',
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
        }
    },];
    masync.map(requests, function (obj, callback) {
        request(obj, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.indexOf('<') > -1) {
                    body = body
                } else {
                    body = JSON.parse(body);
                }
                callback(null, body);
            } else {
                callback(error || response.statusCode);
            }
        });
    }, function (err, results) {
        if (err) {
            console.log(err)
        } else {
            for (var i = 0; i < results.length; i++) {
                if (i == 0) {
                    const $ = cheerio.load(results[0]);
                    $('h4 a').each(function (index, ele) {
                        selectArr.push({ title: `${$(this).text()}`, url: `${$(this).attr('href')}` })
                    });
                }
            }
        }
        selectArr = [...new Set(selectArr)].filter(x => x.title.indexOf(`${req.query.keyword}`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8")
        res.json([{ 'ret': true, 'code': JSON.stringify(selectArr) }]);
    });
});
//添加收藏新闻
newsall.post('/api/globalNewsFavors', jsonParser, function (req, res) {
    let _title = req.body.titles;
    let _url = req.body.urls;
    let _timer = req.body.time;
    if (!_title.includes('_|_')) {
        _title = [_title];
        _url = [_url];
    } else {
        _title = _title.split('_|_');
        _url = _url.split('_|_');
    }
    for (let i = 0; i < _title.length; i++) {
        con.query(`INSERT INTO globalNewsTable(title, href, stars, remarks) VALUES("${_title[i]}","${_url[i]}","${_timer}","-")`, function (err) {});
    }
    res.header("Content-Type", "application/json; charset=utf-8")
    res.json([{ 'ret': true, 'code': "添加成功" }]);
});
//获取收藏新闻列表
newsall.get('/api/getNewsFavor', (req, res) => {
    con.query("SELECT * FROM globalNewsTable ORDER BY stars", function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({ id: item.id, title: item.title, url: item.href, stars: item.stars, remarks: item.remarks }));
        res.header("Content-Type", "application/json; charset=utf-8")
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//删除收藏新闻
newsall.post('/api/deleteNewsFavor', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8")
    con.query(`DELETE FROM globalNewsTable WHERE id IN (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': `请选择要删除的记录` }]);
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//通过搜索获取收藏列表
newsall.get('/api/searchFavorNewsTable', (req, res) => {
    let mysqlCom = "SELECT * FROM globalNewsTable WHERE 1=1";
    if (req.query.keys != '') {
        mysqlCom += ` AND title LIKE '%${req.query.keys}%'`;
    }
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({ id: item.id, title: item.title, url: item.href, stars: item.stars, remarks: item.remarks }));
        res.header("Content-Type", "application/json; charset=utf-8")
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//获取关键词黑名单
newsall.get('/api/getBlackListWords', (req, res) => {
    con.query("SELECT * FROM blackListWords WHERE id = 1", function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({ 'id': row.id, 'title': row.title, 'remarks': row.remarks }));
        res.header("Content-Type", "application/json; charset=utf-8")
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//更新关键词黑名单
newsall.post('/api/postBlackListWords', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8")
    con.query('UPDATE blackListWords SET title = ? WHERE id = 1', [req.body.title], function (err, result) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//调用词云
newsall.get('/api/getCloud', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8")
    const filteredWords = cut(jiebaArr.join(''), false)
        .filter(item => !/[^a-zA-Z\u4e00-\u9fa5\s]|^$|['" ]/.test(item))
        .filter(item => !stopwords.includes(item));
    const result = removeStopwords(filteredWords);
    res.json([{ 'ret': true, 'code': JSON.stringify(result) }]);
});

module.exports = newsall