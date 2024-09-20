const express = require('express');
const path = require('path');
const svgCaptcha = require('svg-captcha');
const con = require('./database.js');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/index.html'));
    } else {
        res.redirect('/login');
    }
});
//登录
router.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/pages/login.html'));
});
//登出
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
//寰宇新闻区
router.get('/globalnews', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/news/global-news.html'));
    } else {
        res.redirect('/');
    }
});
//数据分析区
router.get('/analytics', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/analytics/data-analytics.html'));
    } else {
        res.redirect('/');
    }
});
//投资遴选区
router.get('/power', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/invest/power.html'));
    } else {
        res.redirect('/');
    }
});
//策划谋略区
router.get('/idea', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/idea/future-idea.html'));
    } else {
        res.redirect('/');
    }
});
//经验总结区
router.get('/experience', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/experience/experience-share.html'));
    } else {
        res.redirect('/');
    }
});
//收支记录区
router.get('/balance', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/balance/income-expense-balance.html'));
    } else {
        res.redirect('/');
    }
});
//保险管理区
router.get('/insurance', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/insurance/insurance-control.html'));
    } else {
        res.redirect('/');
    }
});
//个人健康区
router.get('/health', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/health/body-health.html'));
    } else {
        res.redirect('/');
    }
});
//待办事项区
router.get('/todo', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/todo/calendar-to-do.html'));
    } else {
        res.redirect('/');
    }
});
//思维导图区
router.get('/brain', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/brain/brain-mapping.html'));
    } else {
        res.redirect('/');
    }    
});
//系统设置区
router.get('/settings', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.resolve(__dirname, '../public/pages/settings/settings-index.html'));
    } else {
        res.redirect('/');
    }    
});
// 创建一个验证码
router.get('/verifyCode', (req, res) => {
    // 创建验证码
    var captcha = svgCaptcha.create({
        color: true, // 彩色
        inverse: true,// 反转颜色
        width: 100, //  宽度
        height: 35, // 高度
        fontSize: 48, // 字体大小
        size: 4, // 验证码的长度
        noise: 1,// 干扰线条
        background: '#ccc',
        ignoreChars: '0oO1ilI' // 验证码字符中排除 0o1i
    });
    req.session.loginCaptcha = captcha.text.toLocaleLowerCase();
    res.send(captcha.data);
});
//登陆 api
router.post('/loginUser', (req, res) => {
    res.header("Content-Type", "text/html; charset=utf-8")
    con.query(`SELECT * FROM managerUser WHERE loginnum = '${req.body.login}'`, function (err, result) {
        if (result.length === 0) {
            res.json([{ 'ret': false, 'code': '没有该用户哦！' }]);
        } else {
            const user = result.find(user => user.loginnum === req.body.login && user.loginpwd === req.body.password);
            if (user && req.session.loginCaptcha === req.body.captcha) {
                req.session.user = req.body.login;
                res.json([{ 'ret': true, 'code': '登陆成功' }]);
            } else if (!user) {
                res.json([{ 'ret': false, 'code': '密码输入错误，请重新输入！' }]);
            } else {
                res.json([{ 'ret': false, 'code': '验证码错误，请重新输入！' }]);
            }
        }
    });
});
module.exports = router