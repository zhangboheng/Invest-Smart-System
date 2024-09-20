const express = require('express');
const con = require('./database.js');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const investall = express.Router();
//获取股票列表
investall.get('/api/getStockTable', (req, res) => {
    con.query("SELECT * FROM stockAnalytics", function (err, result) {
        if (err) throw err;
        let arr = result.map(item => ({
            'id': item.id,
            'stockname': item.stockname,
            'ipoday': item.ipoday,
            'city': item.city,
            'category': item.category,
            'inmarket': item.inmarket,
            'revenue': item.revenue,
            'dividends': item.dividends,
            'reason': item.reason,
            'remarks': item.remarks,
            'rate':item.rate
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//获取基金列表
investall.get('/api/getFundTable', (req, res) => {
    con.query("SELECT * FROM fundsAnalytics", function (err, result) {
        if (err) throw err;
        let arr = result.map(item => ({
            'id': item.id,
            'fundname': item.fundname,
            'manager': item.manager,
            'size': item.size,
            'reason': item.reason,
            'hold': item.hold,
            'remarks': item.remarks
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//获取优惠信息列表
investall.get('/api/getDiscountTable', (req, res) => {
    con.query("SELECT * FROM discountAnalytics", function (err, result) {
        if (err) throw err;
        let arr = result.map(item => ({
            'id': item.id,
            'infoname': item.infoname,
            'distincttype': item.distincttype,
            'outdate': item.outdate,
            'discription': item.discription,
            'remarks': item.remarks
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//搜索股票
investall.get('/api/searchStockTable', (req, res) => {
    let mysqlCom = "SELECT * FROM stockAnalytics WHERE 1=1";
    if (req.query.id != '') {
        mysqlCom += ` AND id LIKE '%${req.query.id}%'`;
    }
    if (req.query.name != '') {
        mysqlCom += ` AND stockname LIKE '%${req.query.name}%'`;
    }
    if (req.query.revenuePredict != '== 请选择 ==') {
        mysqlCom += ` AND revenue = '${req.query.revenuePredict}'`;
    }
    if (req.query.reasonWhy != '== 请选择 ==') {
        mysqlCom += ` AND reason = '${req.query.reasonWhy}'`;
    }

    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        let arr = result.map(item => ({
            'id': item.id,
            'stockname': item.stockname,
            'ipoday': item.ipoday,
            'city': item.city,
            'category': item.category,
            'inmarket': item.inmarket,
            'revenue': item.revenue,
            'dividends': item.dividends,
            'reason': item.reason,
            'remarks': item.remarks,
            'rate':item.rate
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//搜索基金
investall.get('/api/searchFundsTable', (req, res) => {
    let mysqlCom = "SELECT * FROM fundsAnalytics WHERE 1=1";
    if (req.query.id) {
        mysqlCom += ` AND id LIKE '%${req.query.id}%'`;
    }
    if (req.query.name) {
        mysqlCom += ` AND fundname LIKE '%${req.query.name}%'`;
    }
    if (req.query.revenuePredict !== '== 请选择 ==') {
        mysqlCom += ` AND reason = '${req.query.revenuePredict}'`;
    }
    if (req.query.reasonWhy !== '2') {
        mysqlCom += ` AND hold = '${req.query.reasonWhy}'`;
    }
    
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            fundname: item.fundname,
            manager: item.manager,
            size: item.size,
            reason: item.reason,
            hold: item.hold,
            remarks: item.remarks
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//搜索优惠信息
investall.get('/api/searchDiscountTable', (req, res) => {
    let mysqlCom = "SELECT * FROM discountAnalytics WHERE 1=1";
    if (req.query.name) {
        mysqlCom += ` AND infoname LIKE '%${req.query.name}%'`;
    }
    if (req.query.distincttype !== '0') {
        mysqlCom += ` AND distincttype = '${req.query.distincttype}'`;
    }
    
    con.query(mysqlCom, function (err, result) {
        if (err) throw err;
        const arr = result.map(item => ({
            id: item.id,
            infoname: item.infoname,
            distincttype: item.distincttype,
            outdate: item.outdate,
            discription: item.discription,
            remarks: item.remarks
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//通过id获取股票信息
investall.get('/api/getStockIdTable', (req, res) => {
    con.query(`SELECT * FROM stockAnalytics WHERE id = '${req.query.ids}'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            'id': row.id,
            'stockname': row.stockname,
            'ipoday': row.ipoday,
            'city': row.city,
            'category': row.category,
            'inmarket': row.inmarket,
            'revenue': row.revenue,
            'dividends': row.dividends,
            'reason': row.reason,
            'remarks': row.remarks,
            'rate':row.rate
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//通过id获取基金信息
investall.get('/api/getFundsIdTable', (req, res) => {
    con.query(`SELECT * FROM fundsAnalytics WHERE id = '${req.query.ids}'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            'id': row.id,
            'fundname': row.fundname,
            'manager': row.manager,
            'size': row.size,
            'reason': row.reason,
            'hold': row.hold,
            'remarks': row.remarks
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//通过id获取优惠信息
investall.get('/api/getDiscountIdTable', (req, res) => {
    con.query(`SELECT * FROM discountAnalytics WHERE id = '${req.query.ids}'`, function (err, result) {
        if (err) throw err;
        const arr = result.map(row => ({
            'id': row.id,
            'infoname': row.infoname,
            'distincttype': row.distincttype,
            'outdate': row.outdate,
            'discription': row.discription,
            'remarks': row.remarks
        }));
        res.header("Content-Type", "application/json; charset=utf-8");
        res.json([{ 'ret': true, 'code': JSON.stringify(arr) }]);
    });
});
//添加股票信息
investall.post('/api/postStockdata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO stockAnalytics VALUES(?,?,?,?,?,?,?,?,?,?,?)", [req.body.id, req.body.stockname, req.body.ipoday, req.body.city, req.body.category, req.body.inmarket, req.body.revenue, req.body.dividends, req.body.reason, req.body.remarks, req.body.rate], function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.json([{ 'ret': false, 'code': `${req.body.stockname}已经添加过了，请尝试其他股票` }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//添加基金信息
investall.post('/api/postfunddata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO fundsAnalytics VALUES(?,?,?,?,?,?,?)", [req.body.id, req.body.fundsName, req.body.manager, req.body.fundsSize, req.body.buyReason, req.body.hold, req.body.remarks], function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.json([{ 'ret': false, 'code': `${req.body.fundsName}已经添加过了，请尝试其他基金` }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//添加优惠信息
investall.post('/api/postdiscountdata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query("INSERT INTO discountAnalytics(infoname,distincttype,outdate,discription,remarks) VALUES(?,?,?,?,?)", [req.body.showname, req.body.discounttype, req.body.outdate, req.body.rule, req.body.remarks], function (err, result, fields) {
        if (err) {
            res.json([{ 'ret': false, 'code': '添加失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '添加成功' }]);
        }
    });
});
//删除股票信息
investall.post('/api/deleteStockTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM stockAnalytics WHERE ID IN (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_PARSE_ERROR') {
                res.json([{ 'ret': false, 'code': `请选择要删除股票` }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//删除基金信息
investall.post('/api/deleteFundTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM fundsAnalytics WHERE id IN (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_PARSE_ERROR') {
                res.json([{ 'ret': false, 'code': `请选择要删除基金` }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//删除优惠信息
investall.post('/api/deleteDiscountTable', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`DELETE FROM discountAnalytics WHERE id IN (${req.body.ids})`, function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_PARSE_ERROR') {
                res.json([{ 'ret': false, 'code': `请选择要删除优惠活动` }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '删除成功' }]);
        }
    });
});
//更新股票信息
investall.post('/api/updateStockdata', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`UPDATE stockAnalytics
    SET stockname = ?, ipoday = ?, city = ?, rate = ?, revenue = ?, reason = ?, dividends = ?, inmarket = ?, category = ?, remarks = ?
    WHERE id = ?`, [req.body.stockname, req.body.ipoday, req.body.city, req.body.rate, req.body.revenue, req.body.reason, req.body.dividends, req.body.inmarket, req.body.category, req.body.remarks, req.body.id], function (err) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.json([{ 'ret': false, 'code': '请填写信息' }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//更新基金信息
investall.post('/api/updateFundsData', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`UPDATE fundsAnalytics
    SET fundname = ?, manager = ?, size = ?, reason = ?, hold = ?, remarks = ?
    WHERE id = ?`, [req.body.fundsName, req.body.manager, req.body.fundsSize, req.body.buyReason, req.body.hold, req.body.remarks, req.body.id], function (err) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                res.json([{ 'ret': false, 'code': '请填写信息' }]);
            }
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});
//更新优惠信息
investall.post('/api/updateDiscountData', jsonParser, function (req, res) {
    res.header("Content-Type", "application/json; charset=utf-8");
    con.query(`UPDATE discountAnalytics
    SET infoname = ?, distincttype = ?, outdate = ?, discription = ?, remarks = ?
    WHERE id = ?`, [req.body.infoname, req.body.distincttype, req.body.outdate, req.body.discription, req.body.remarks, req.body.ids], function (err) {
        if (err) {
            res.json([{ 'ret': false, 'code': '更新失败' }]);
        } else {
            res.json([{ 'ret': true, 'code': '更新成功' }]);
        }
    });
});

module.exports = investall