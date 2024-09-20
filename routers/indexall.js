var masync = require("async");
var request = require('request');
var cheerio = require('cheerio');
const iconv = require('iconv-lite');
const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
const indexall = express.Router();
// 提供数据专区汇率信息
indexall.get('/api/getCurrencyData', (req, res) => {
    var keyArr = [];
    var valueArr = [];
    var timeArr = [];
    var joinArr = [];
    // News List
    var requests = [{
            uri: 'https://www.boc.cn/sourcedb/whpj/index.html',
            method: 'GET',
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
            }
        }];
    masync.map(requests, function (obj, callback) {
        request(obj, function (error, response, body) {
            if (! error && response.statusCode == 200) {
                if (body[0] == '<') {
                    body = body
                } else {
                    body = JSON.parse(body);
                } callback(null, body);
            } else {
                callback(error || response.statusCode);
            }
        });
    }, function (err, results) {
        if (err) {
            console.log(err)
        } else {
            const $ = cheerio.load(results[0]);
            $('td:nth-child(1)').each(function (index, ele) {
                if (index > 0 && index < 28) {
                    keyArr.push($(this).text());
                }
            });
            $('td:nth-child(6)').each(function (index, ele) {
                if (index != 0) {
                    valueArr.push($(this).text());
                }
            });
            $('td:nth-child(7)').each(function (index, ele) {
                if (index != 0) {
                    timeArr.push($(this).text());
                }
            });
            for (var i = 0; i < keyArr.length; i++) {
                joinArr.push({
                    key: keyArr[i],
                    value: (valueArr[i] / 100).toFixed(4),
                    time: timeArr[i]
                });
            }
        }
        joinArr = joinArr.filter(x => x.key.indexOf(`${req.query.keyword}`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(joinArr) }]);
    });
});
// 提供数据专区证券信息
indexall.get('/api/getStockChangeData', (req, res) => {
    var sentArr = [];
    // News List
    var requests = [{
            uri: 'https://cn.stockq.org/',
            method: 'GET',
            headers: {
                'Content-Type': 'text/html; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36'
            }
        }];
    masync.map(requests, function (obj, callback) {
        request(obj, function (error, response, body) {
            if (! error && response.statusCode == 200) {
                if (body.trim()[0] == '<') {
                    body = body
                } else {
                    body = JSON.parse(body);
                } callback(null, body);
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
                    const $ = cheerio.load(results[i]);
                    $('.marketdatatable').each(function (index, ele) {
                        if (index == 0) {
                            $(this).find('td a').each(function () {
                                let name = $(this).text() == '上海综合' ? '上证指数' : $(this).text();
                                let stockIndex = $(this).parent().next().text();
                                let upAndDown = $(this).parent().next().next().text()
                                let upAndDownPercent = $(this).parent().next().next().next().text();
                                sentArr.push({name: name, stockIndex: stockIndex, upAndDown: upAndDown, upAndDownPercent: upAndDownPercent});
                            });
                        }
                        if (index == 1) {
                            $(this).find('td a').each(function () {
                                let name = $(this).text();
                                let stockIndex = $(this).parent().next().text();
                                let upAndDown = $(this).parent().next().next().text()
                                let upAndDownPercent = $(this).parent().next().next().next().text();
                                sentArr.push({name: name, stockIndex: stockIndex, upAndDown: upAndDown, upAndDownPercent: upAndDownPercent});
                            });
                        }
                        if (index == 2) {
                            $(this).find('td a').each(function () {
                                let name = $(this).text();
                                let stockIndex = $(this).parent().next().text();
                                let upAndDown = $(this).parent().next().next().text()
                                let upAndDownPercent = $(this).parent().next().next().next().text();
                                sentArr.push({name: name, stockIndex: stockIndex, upAndDown: upAndDown, upAndDownPercent: upAndDownPercent});
                            });
                        }
                    });
                }
            }
        } sentArr = sentArr.filter(x => x.name.indexOf(`${
            req.query.keyword
        }`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(sentArr) }]);
    });
});
// 提供数据专区中国期货信息
indexall.get('/api/getFuturesChangeData', (req, res) => {
    var sentArr = [];
    request('https://quote.stockstar.com/futures/futures.shtml', function (error, response, body) {}).pipe(iconv.decodeStream('gb2312')).collect(function (err, body) {
        const $ = cheerio.load(body);
        $('#datalist tr').each(function (index, ele) {
            $(this).find('td').each(function (index, ele) {
                if (index == 0) {
                    let name = $(this).text();
                    let futuresIndex = $(this).next().next().text();
                    let upAndDown = $(this).next().next().next().text();
                    let upAndDownPercent = $(this).next().next().next().next().text();
                    sentArr.push({name: name, futuresIndex: futuresIndex, upAndDown: upAndDown, upAndDownPercent: upAndDownPercent});
                }
            });
        });
        sentArr = sentArr.filter(x => x.name.indexOf(`${
            req.query.keyword
        }`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(sentArr) }]);
    });
});

// 提供数据专区国际期货信息
indexall.get('/api/getFuturesGlobalChangeData', (req, res) => {
    var sentArr = [];
    request('https://quote.stockstar.com/futures/futuresglobal.shtml', function (error, response, body) {}).pipe(iconv.decodeStream('gb2312')).collect(function (err, body) {
        const $ = cheerio.load(body);
        $('#datalist tr').each(function (index, ele) {
            $(this).find('td').each(function (index, ele) {
                if (index == 0) {
                    let name = $(this).text();
                    let futuresIndex = $(this).next().next().text();
                    let upAndDown = $(this).next().next().next().text();
                    let upAndDownPercent = $(this).next().next().next().next().text();
                    sentArr.push({name: name, futuresIndex: futuresIndex, upAndDown: upAndDown, upAndDownPercent: upAndDownPercent});
                }
            });
        });
        sentArr = sentArr.filter(x => x.name.indexOf(`${
            req.query.keyword
        }`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(sentArr) }]);
    });
});
// 提供数据专区贵金属信息
indexall.get('/api/getMetalChangeData', (req, res) => {
    var sentArr = [];
    request('https://quote.stockstar.com/gold/SHFE.shtml', function (error, response, body) {}).pipe(iconv.decodeStream('gb2312')).collect(function (err, body) {
        const $ = cheerio.load(body);
        $('#datalist1 tr td').each(function(index, ele){
            if (index % 10 == 0) {
                let name = $(this).text();
                let metalIndex = $(this).next().text();
                let upAndDown = $(this).next().next().text();
                let upAndDownPercent = $(this).next().next().next().text();
                sentArr.push({name: name, metalIndex: metalIndex, upAndDown: upAndDown, upAndDownPercent: upAndDownPercent});
            }
        });
        sentArr = sentArr.filter(x => x.name.indexOf(`${
            req.query.keyword
        }`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(sentArr) }]);
    });
});
// 提供数据专区中国基金排行信息
indexall.get('/api/getFundsChangeData', (req, res) => {
    var sentArr = [];
    var page = req.query.page;
    request(`https://quote.stockstar.com/fund/open_5_1_${page}.html`, function (error, response, body) {}).pipe(iconv.decodeStream('gb2312')).collect(function (err, body) {
        const $ = cheerio.load(body);
        $('#datalist tr').each(function (index, ele) {
            $(this).find('td').each(function (index, ele) {
                if (index == 0) {
                    let tcode = $(this).text();
                    let href = $(this).find('a').attr('href');
                    let name = $(this).next().text();
                    let values = $(this).next().next().text();
                    let percent = $(this).next().next().next().next().next().text();
                    sentArr.push({
                        tcode: tcode,
                        name: name,
                        link: href,
                        values: values,
                        percent: percent
                    });
                }
            });
        });
        sentArr = sentArr.filter(x => x.name.indexOf(`${
            req.query.keyword
        }`) > -1);
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(sentArr) }]);
    });
});

module.exports = indexall