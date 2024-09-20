const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookoeParser = require('cookie-parser');
const router = require('./routers/router.js');
const newsall = require('./routers/newsall.js');
const indexall = require('./routers/indexall.js');
const investall = require('./routers/investall.js');
const strategyall = require('./routers/strategyall.js');
const expall = require('./routers/expall.js');
const balanceall = require('./routers/balanceall.js');
const safetyall = require('./routers/safetyall.js');
const todoall = require('./routers/todoall.js');
const brainall = require('./routers/brainall.js');
const settingsall = require('./routers/settingsall.js');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = new express();
app.use(express.static(__dirname + '/public'));
app.use('/lib/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/lib/wordcloud2', express.static(path.join(__dirname, 'node_modules/wordcloud2')));
app.use('/lib/layui', express.static(path.join(__dirname, 'node_modules/layui/dist')));
app.use('/lib/echarts', express.static(path.join(__dirname, 'node_modules/echarts/dist')));
app.use('/lib/jsmind', express.static(path.join(__dirname, 'node_modules/jsmind')));
app.use('/lib/jquery-ui', express.static(path.join(__dirname, 'node_modules/jquery-ui-dist')));
app.use('/lib/jquery-datetimepicker', express.static(path.join(__dirname, 'node_modules/jquery-datetimepicker')));
app.use(bodyParser.json());
app.use(urlencodedParser);
// 启用cookie
app.use(cookoeParser());
app.use(cors({
    origin: '*', //可以换成任意网址
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 360000*24
    }
}));
app.use(router).use(newsall).use(indexall).use(investall).use(strategyall);
app.use(expall) .use(balanceall).use(safetyall).use(todoall).use(brainall).use(settingsall);
app.listen(4000, () => {
    console.log('App listening on port 4000');
});