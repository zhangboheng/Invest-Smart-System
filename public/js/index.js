//通用列表传参开始
const stockApi = '/api/searchStockTable'; //股票
const fundApi = '/api/searchFundsTable'; //基金
const discountApi = '/api/searchDiscountTable'; //优惠
const stockSlug = '#gridTable';
const fundSlug = '#gridTableTwo';
const discountSlug = '#gridTableThree';
function stockGetInner(_arr, _longth) {
    for (let i = 0; i < _longth.length; i++) {
        _arr.push({ id: _longth[i].id, name: _longth[i].stockname, date: _longth[i].ipoday.split('T')[0], city: _longth[i].city, rate: _longth[i].rate, predict: _longth[i].revenue, dividends: _longth[i].dividends, reasons: _longth[i].reason, inmarket: _longth[i].inmarket, category: _longth[i].category, analytics: _longth[i].remarks });
    }
}
function fundGetInner(_arr, _longth) {
    for (let i = 0; i < _longth.length; i++) {
        _arr.push({ id: _longth[i].id, fundname: _longth[i].fundname, manager: _longth[i].manager, size: _longth[i].size, reason: _longth[i].reason, hold: _longth[i].hold, remarks: _longth[i].remarks });
    }
}
function discountGetInner(_arr, _longth) {
    for (let i = 0; i < _longth.length; i++) {
        _arr.push({ id: _longth[i].id, infoname: _longth[i].infoname, distincttype: _longth[i].distincttype, outdate: _longth[i].outdate.split('T')[0], discription: _longth[i].discription, remarks: _longth[i].remarks });
    }
}
//股票通用方法
function customStock() {
    let stockArrPara = {
        id: String($('#stockid').val()),
        name: $('#stname').val(),
        revenuePredict: $('#revenuePredict').val(),
        reasonWhy: $('#reasonWhy').val()
    };
    newJQgrid(stockApi, stockArrPara, stockSlug);
}
//基金通用方法
function customFund() {
    let fundArrPara = {
        id: String($('#stockidTwo').val()),
        name: $('#stnameTwo').val(),
        revenuePredict: $('#buyReason').val(),
        reasonWhy: $('#ownOrNot').val()
    };
    newJQgrid(fundApi, fundArrPara, fundSlug);
}
//优惠通用方法
function customDiscount() {
    let discountArrPara = {
        name: $('#stockidThree').val(),
        distincttype: $('#stnameThree').val(),
    };
    newJQgrid(discountApi, discountArrPara, discountSlug);
}
//通用列表传参结束

//刷新股票页面
$('#btnSearch').on('click', function () {
    window.location.href = '/power';
});

//刷新基金页面
$('#btnSearchTwo').on('click', function () {
    window.location.href = '/power';
});

//刷新优惠信息页面
$('#btnSearchThree').on('click', function () {
    window.location.href = '/power';
});

//搜索股票按钮
$('#searchBtn').on('click', function () {
    customStock();
});

//搜索基金按钮
$('#searchBtnTwo').on('click', function () {
    customFund();
});

//搜索优惠按钮
$('#searchBtnThree').on('click', function () {
    customDiscount();
});

//添加股票页面
var addStock = document.getElementById("btnAdd");
addStock.addEventListener("click", function () {
    customAddPage('addStock', '添加投资标的股票', './pages/invest/tab-stock-add.html');
});
//添加基金页面
var addFund = document.getElementById("btnAddTwo");
addFund.addEventListener("click", function () {
    customAddPage('addFund', '添加投资标的基金', './pages/invest/tab-funds-add.html');
});
//添加优惠信息页面
var addDiscount = document.getElementById("btnAddThree");
addDiscount.addEventListener("click", function () {
    customAddPage('addDiscount', '添加优惠信息', './pages/invest/tab-discount-add.html');
});

//添加股票、基金、优惠信息通用方法
function customAddPage(_id, _title, _content) {
    layer.open({
        id: _id, //设定一个id，防止重复弹出
        type: 2,
        title: _title,
        area: ['400px', '450px'],
        shade: 0,
        maxmin: false,
        skin: 'btnAddLayui',
        content: _content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            if (_id == 'addStock') {
                var tcodeName = layero.find('iframe').contents().find('#tcodeAdd');
                var stockName = layero.find('iframe').contents().find('#nameAdd');
                var beginTime = layero.find('iframe').contents().find('#stimeAdd');
                var cityName = layero.find('iframe').contents().find('#cityAdd');
                var revenueInfo = layero.find('iframe').contents().find('#revenueAdd');
                var dividendsInfo = layero.find('iframe').contents().find('#dividendsAdd');
                var reasonInfo = layero.find('iframe').contents().find('#reasonAdd');
                var inmarketInfo = layero.find('iframe').contents().find('#inornotAdd');
                var categoryInfo = layero.find('iframe').contents().find('#categoryAdd');
                var analyticsInfo = layero.find('iframe').contents().find('#analyticsAdd');
                if (String(tcodeName[0].value).length != 6 || stockName[0].value == '' || beginTime[0].value == '' || cityName[0].value == '' || revenueInfo[0].value == '== 请选择 ==' || reasonInfo[0].value == '== 请选择 ==' || analyticsInfo[0].value == '') {
                    DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                } else {
                    let reasonBox = { "high": 1, "middle": 0.618, "low": 0.382 }
                    let dividendsBox = {  2: 1, 1: 0.618, 0: 0.382 }
                    let revenueBox = { "low": 0.382, "mid": 0.618, "high": 1 }
                    let rateToBase = mean([revenueBox[revenueInfo[0].value], reasonBox[reasonInfo[0].value], dividendsBox[dividendsInfo[0].value]]);
                    rateToBase = rateToBase * Number(inmarketInfo[0].value);
                    $.ajax({
                        url: '/api/postStockdata',
                        type: 'POST',
                        data: {
                            id: String(tcodeName[0].value),
                            stockname: stockName[0].value,
                            ipoday: beginTime[0].value,
                            city: cityName[0].value,
                            rate: rateToBase,
                            revenue: revenueInfo[0].value,
                            dividends: dividendsInfo[0].value,
                            reason: reasonInfo[0].value,
                            inmarket: inmarketInfo[0].value,
                            category: categoryInfo[0].value,
                            remarks: analyticsInfo[0].value
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data[0].ret) {
                                DialogMessageTop(0, `${data[0].code}`, 3);
                                layer.closeAll();
                                customStock();
                            } else {
                                DialogMessage(0, `${data[0].code}`, 4);
                            }
                        }
                    });
                }
            } else if (_id == 'addFund') {
                var tcodeName = layero.find('iframe').contents().find('#tcodeAdd');
                var fundsName = layero.find('iframe').contents().find('#nameAdd');
                var manager = layero.find('iframe').contents().find('#managerAdd');
                var fundsSize = layero.find('iframe').contents().find('#sizeAdd');
                var buyReason = layero.find('iframe').contents().find('#buyReasonAdd');
                var hold = layero.find('iframe').contents().find('#holdAdd');
                var remarks = layero.find('iframe').contents().find('#remarksAdd');
                if (String(tcodeName[0].value).length != 6 || fundsName[0].value == '' || manager[0].value == '' || fundsSize[0].value == '' || buyReason[0].value == '== 请选择 ==' || hold[0].value == '2' || remarks[0].value == '') {
                    DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                } else {
                    $.ajax({
                        url: '/api/postfunddata',
                        type: 'POST',
                        data: {
                            id: String(tcodeName[0].value),
                            fundsName: fundsName[0].value,
                            manager: manager[0].value,
                            fundsSize: fundsSize[0].value,
                            buyReason: buyReason[0].value,
                            hold: hold[0].value,
                            remarks: remarks[0].value
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data[0].ret) {
                                DialogMessageTop(0, `${data[0].code}`, 3);
                                layer.closeAll();
                                customFund();
                            } else {
                                DialogMessage(0, `${data[0].code}`, 4);
                            }
                        }
                    });
                }
            } else if (_id == 'addDiscount') {
                var showname = layero.find('iframe').contents().find('#showname');
                var discounttype = layero.find('iframe').contents().find('#discounttype');
                var outdate = layero.find('iframe').contents().find('#outdate');
                var rule = layero.find('iframe').contents().find('#rule');
                var remarksAdd = layero.find('iframe').contents().find('#remarksAdd');
                if (showname[0].value == '' || discounttype[0].value == '' || outdate[0].value == '== 请选择 ==' || rule[0].value == '' || remarksAdd[0].value == '') {
                    DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                } else {
                    $.ajax({
                        url: '/api/postdiscountdata',
                        type: 'POST',
                        data: {
                            showname: showname[0].value,
                            discounttype: discounttype[0].value,
                            outdate: outdate[0].value,
                            rule: rule[0].value,
                            remarks: remarksAdd[0].value
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data[0].ret) {
                                DialogMessageTop(0, `${data[0].code}`, 3);
                                layer.closeAll();
                                customDiscount();
                            } else {
                                DialogMessage(0, `${data[0].code}`, 4);
                            }
                        }
                    });
                }
            }
        },
        btn2: function () {
            layer.closeAll();
        },
        zIndex: layer.zIndex,
        success: function (layero) {
            layer.setTop(layero);
        }
    });
}

//编辑股票页面
var editStock = document.getElementById("btnEdit");
editStock.addEventListener("click", function () {
    customEditPage('#gridTable', 'editStock', '修改投资标的股票', './pages/invest/tab-stock-edit.html?ids=');
});

//编辑基金页面
var editFund = document.getElementById("btnEditTwo");
editFund.addEventListener("click", function () {
    customEditPage('#gridTableTwo', 'editFund', '修改投资标的基金', './pages/invest/tab-funds-edit.html?ids=');
});

//编辑优惠信息
var editDiscount = document.getElementById("btnEditThree");
editDiscount.addEventListener("click", function () {
    customEditPage('#gridTableThree', 'editDiscount', '修改优惠信息', './pages/invest/tab-discount-edit.html?ids=');
});

//编辑股票、基金、优惠信息通用方法
function customEditPage(_gridTable, _id, _title, _content) {
    let id = jQuery(_gridTable).jqGrid('getGridParam', 'selrow');
    if (id != null) {
        layer.open({
            id: _id, //设定一个id，防止重复弹出
            type: 2,
            title: _title,
            area: ['400px', '450px'],
            shade: 0,
            maxmin: false,
            skin: 'btnAddLayui',
            content: _content + id,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                if (_id == 'editStock') {
                    var tcodeName = layero.find('iframe').contents().find('#tcodeAdd');
                    var stockName = layero.find('iframe').contents().find('#nameAdd');
                    var beginTime = layero.find('iframe').contents().find('#stimeAdd');
                    var cityName = layero.find('iframe').contents().find('#cityAdd');
                    var revenueInfo = layero.find('iframe').contents().find('#revenueAdd');
                    var dividendsInfo = layero.find('iframe').contents().find('#dividendsAdd');
                    var reasonInfo = layero.find('iframe').contents().find('#reasonAdd');
                    var inmarketInfo = layero.find('iframe').contents().find('#inornotAdd');
                    var categoryInfo = layero.find('iframe').contents().find('#categoryAdd');
                    var analyticsInfo = layero.find('iframe').contents().find('#analyticsAdd');
                    if (String(tcodeName[0].value).length != 6 || stockName[0].value == '' || beginTime[0].value == '' || cityName[0].value == '' || revenueInfo[0].value == '== 请选择 ==' || reasonInfo[0].value == '== 请选择 ==' || analyticsInfo[0].value == '') {
                        DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                    } else {
                        let reasonBox = { "high": 1, "middle": 0.618, "low": 0.382 }
                        let dividendsBox = { 2: 1, 1: 0.618, 0: 0.382 }
                        let revenueBox = { "low": 0.382, "mid": 0.618, "high": 1 }
                        let rateToBase = mean([revenueBox[revenueInfo[0].value], reasonBox[reasonInfo[0].value], dividendsBox[dividendsInfo[0].value]]);
                        rateToBase = rateToBase * Number(inmarketInfo[0].value);
                        $.ajax({
                            url: '/api/updateStockdata',
                            type: 'POST',
                            data: {
                                id: String(tcodeName[0].value),
                                stockname: stockName[0].value,
                                ipoday: beginTime[0].value,
                                city: cityName[0].value,
                                rate: rateToBase,
                                revenue: revenueInfo[0].value,
                                dividends: dividendsInfo[0].value,
                                reason: reasonInfo[0].value,
                                inmarket: inmarketInfo[0].value,
                                category: categoryInfo[0].value,
                                remarks: analyticsInfo[0].value
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data[0].ret) {
                                    DialogMessageTop(0, `${data[0].code}`, 3);
                                    layer.closeAll();
                                    customStock();
                                } else {
                                    DialogMessage(0, `${data[0].code}`, 4);
                                }
                            }
                        });
                    }
                } else if (_id == 'editFund') {
                    var tcodeName = layero.find('iframe').contents().find('#tcodeAdd');
                    var fundsName = layero.find('iframe').contents().find('#nameAdd');
                    var manager = layero.find('iframe').contents().find('#managerAdd');
                    var fundsSize = layero.find('iframe').contents().find('#sizeAdd');
                    var buyReason = layero.find('iframe').contents().find('#buyReasonAdd');
                    var hold = layero.find('iframe').contents().find('#holdAdd');
                    var remarks = layero.find('iframe').contents().find('#remarksAdd');
                    if (String(tcodeName[0].value).length != 6 || fundsName[0].value == '' || manager[0].value == '' || fundsSize[0].value == '' || buyReason[0].value == '== 请选择 ==' || hold[0].value == '2' || remarks[0].value == '') {
                        DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                    } else {
                        $.ajax({
                            url: '/api/updateFundsData',
                            type: 'POST',
                            data: {
                                id: String(tcodeName[0].value),
                                fundsName: fundsName[0].value,
                                manager: manager[0].value,
                                fundsSize: fundsSize[0].value,
                                buyReason: buyReason[0].value,
                                hold: hold[0].value,
                                remarks: remarks[0].value
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data[0].ret) {
                                    DialogMessageTop(0, `${data[0].code}`, 3);
                                    customFund();
                                } else {
                                    DialogMessage(0, `${data[0].code}`, 4);
                                }
                            }
                        });
                    }
                } else if (_id == 'editDiscount') {
                    var showname = layero.find('iframe').contents().find('#showname');
                    var discounttype = layero.find('iframe').contents().find('#discounttype');
                    var outdate = layero.find('iframe').contents().find('#outdate');
                    var rule = layero.find('iframe').contents().find('#rule');
                    var remarks = layero.find('iframe').contents().find('#remarksAdd');
                    if (showname[0].value == '' || discounttype[0].value == '' || outdate[0].value == '' || rule[0].value == '0' || remarks[0].value == '') {
                        DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                    } else {
                        $.ajax({
                            url: '/api/updateDiscountData',
                            type: 'POST',
                            data: {
                                ids: id,
                                infoname: showname[0].value,
                                distincttype: discounttype[0].value,
                                outdate: outdate[0].value,
                                discription: rule[0].value,
                                remarks: remarks[0].value
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data[0].ret) {
                                    DialogMessageTop(0, `${data[0].code}`, 3);
                                    customDiscount();
                                } else {
                                    DialogMessage(0, `${data[0].code}`, 4);
                                }
                            }
                        });
                    }
                }
            },
            btn2: function () {
                layer.closeAll();
            },
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            }
        });

    } else {
        DialogMessageTop(0, `请选择一条信息进行编辑`, 3);
    }
}

//批量删除股票
var deleteStock = document.getElementById("btnDelete");
deleteStock.addEventListener("click", function () {
    customDeletePage("#gridTable", '/api/deleteStockTable');
});

//批量删除基金
var deleteFund = document.getElementById("btnDeleteTwo");
deleteFund.addEventListener("click", function () {
    customDeletePage("#gridTableTwo", '/api/deleteFundTable');
});

//批量删除优惠活动
var deleteDiscount = document.getElementById("btnDeleteThree");
deleteDiscount.addEventListener("click", function () {
    customDeletePage("#gridTableThree", '/api/deleteDiscountTable');
});

//删除股票、基金、优惠信息通用方法
function customDeletePage(_gridTable, _url,) {
    var s = jQuery(_gridTable).jqGrid('getGridParam', 'selarrrow');
    if (s.length == 0) {
        layer.msg('请选择要删除的股票');
    } else {
        layer.msg('确认要删除吗？', {
            time: 0, // 不自动关闭
            btn: [
                '确定', '再想想'
            ],
            yes: function (index) {
                $.ajax({
                    url: _url,
                    type: 'POST',
                    data: {
                        ids: String(s)
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            DialogMessage(0, `${
                                data[0].code
                            }`, 1);
                            if (_gridTable == '#gridTable') {
                                customStock();
                            } else if (_gridTable == '#gridTableTwo') {
                                customFund();
                            } else if (_gridTable == '#gridTableThree') {
                                customDiscount();
                            }
                        } else {
                            DialogMessage(0, `${
                                data[0].code
                            }`, 1);
                        }
                    }
                });
            }
        });
    }
}

//总纲弹出页面
var popUpPageAll = document.getElementById("btnAll");
popUpPageAll.addEventListener("click", function () {
    layer.open({
        type: 1,
        title: false,
        closeBtn: false,
        area: '300px;',
        shade: 0.8,
        id: 'allInOne',
        resize: false,
        btn: ['关闭'],
        btnAlign: 'c',
        moveType: 1,
        content: `
        <div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">
            <h1>股票投资总纲</h1>
            <div style="margin-top:20px;">
                <ul>
                    <li>1. 股票投资是一项长期投资活动，耐心持有，中国大陆 A 股市场尤其如此</li>
                    <li>2. A 股市场盈利方式有低买高卖，可转债，股票分红</li>
                    <li>3. 择股首选未来发展潜力高，次选分红高，不选亏损过大和夕阳产业股票</li>
                    <li>4. 高抛低吸，不断做低成本，不到万不得已不轻易清仓股票</li>
                </ul>
            </div>
        </div>
        `,
        success: function (layero) {
            var btn = layero.find('.layui-layer-btn');
        }
    });
});

//公告弹出页面
var popUpReport = document.getElementById("btnReport");
popUpReport.addEventListener("click", function () {
    var index = layer.open({
        title: '巨潮资讯网',
        type: 2,
        content: 'http://www.cninfo.com.cn/',
        area: ['1920px', '1080px'],
        maxmin: true
    });
    layer.full(index);
});

//通用获取列表
function newJQgrid(_first, _second, _three) {
    var searchArr = [];
    $.ajax({
        url: _first,
        type: 'GET',
        data: _second,
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                let parse = JSON.parse(data[0].code);
                if (_first == '/api/searchStockTable') {
                    stockGetInner(searchArr, parse);
                } else if (_first == '/api/searchFundsTable') {
                    fundGetInner(searchArr, parse);
                } else if (_first == '/api/searchDiscountTable') {
                    discountGetInner(searchArr, parse);
                }
            }
        },
        complete: function () {
            let p = jQuery(_three).jqGrid('getGridParam', 'page');
            layer.closeAll();
            jQuery(_three).clearGridData(true);
            jQuery(_three).jqGrid('setGridParam', {
                datatype: 'local',
                data: searchArr,
                page: p
            }).trigger("reloadGrid");
        }
    });
}

//获取基金列表
function getFundsData() {
    const fundsArr = [];
    $.ajax({
        url: '/api/getFundTable',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    fundsArr.push({ id: parse[i].id, fundname: parse[i].fundname, manager: parse[i].manager, size: parse[i].size, reason: parse[i].reason, hold: parse[i].hold, remarks: parse[i].remarks });
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
        complete: function (res) {
            $("#gridTableTwo").jqGrid({
                autowidth: true,
                height: $(window).height() - 284,
                colModel: [
                    { name: "id", label: "基金代码", width: 40 },
                    { name: "fundname", label: "基金名称", width: 80 },
                    { name: "manager", label: "管理人", width: 50 },
                    { name: "size", label: "基金规模", width: 50 },
                    { name: "reason", label: "购买动机", formatter: buyReasonFunc, width: 30 },
                    { name: "hold", label: "是否持有", formatter: holdOrNot, width: 30 },
                    { name: "remarks", label: "合理分析" },
                ],
                data: fundsArr,
                guiStyle: "bootstrap",
                multiselect: true,
                iconSet: "fontAwesome",
                sortname: "id",
                sortorder: "asc",
                rowList: [10, 20, 30, 50, 100],
                pager: true,
                viewrecords: true,
                rowNum: 100,
                shrinkToFit: true,
                beforeRequest: function () {
                    layer.load();
                }, gridComplete: function () {
                    layer.closeAll('loading');
                }
            }).jqGrid('setFrozenColumns');
        }
    });
}
//设置购买动机
function buyReasonFunc(cellvalue, options, rowObject) {
    if (cellvalue == 'history') {
        return '历史曲线';
    } else if (cellvalue == 'future') {
        return '未来发展';
    } else {
        return '基金经理';
    }
}
//设置是否持有
function holdOrNot(cellvalue, options, rowObject) {
    if (cellvalue == 1) {
        return '是';
    } else {
        return '否';
    }
}
//获取优惠信息列表
function getDiscountData() {
    const savingArr = [];
    $.ajax({
        url: '/api/getDiscountTable',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    savingArr.push({ 'id': parse[i].id, 'infoname': parse[i].infoname, 'distincttype': parse[i].distincttype, 'outdate': parse[i].outdate.split('T')[0], 'discription': parse[i].discription, remarks: parse[i].remarks });
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
        complete: function (res) {
            $("#gridTableThree").jqGrid({
                autowidth: true,
                height: $(window).height() - 284,
                colModel: [
                    { name: "id", label: "编号", width: 40, hidden: true },
                    { name: "infoname", label: "活动名称", width: 80 },
                    { name: "distincttype", label: "钜惠类别", formatter: buyType, width: 50 },
                    { name: "outdate", label: "截止日期", width: 50 },
                    { name: "discription", label: "活动规则", width: 120 },
                    { name: "remarks", label: "注意事项" },
                ],
                data: savingArr,
                guiStyle: "bootstrap",
                multiselect: true,
                iconSet: "fontAwesome",
                sortname: "infoname",
                sortorder: "asc",
                rowList: [10, 20, 30, 50, 100],
                pager: true,
                viewrecords: true,
                rowNum: 100,
                shrinkToFit: true,
                beforeRequest: function () {
                    layer.load();
                }, gridComplete: function () {
                    layer.closeAll('loading');
                }
            }).jqGrid('setFrozenColumns');
        }
    });
}

function buyType(cellvalue, options, rowdata) {
    if (cellvalue == '1') {
        return '话费';
    } else if (cellvalue == '2') {
        return '美食';
    } else if (cellvalue == '3') {
        return '服装';
    } else if (cellvalue == '4') {
        return '超市';
    } else if (cellvalue == '5') {
        return '3C';
    } else if (cellvalue == '6') {
        return '虚拟';
    } else if (cellvalue == '7') {
        return '出行';
    } else if (cellvalue == '8') {
        return '房子';
    } else if (cellvalue == '9') {
        return '综合';
    } else if (cellvalue == '10') {
        return '电影';
    }
}

//点击导出股票
var exportExcel = document.getElementById("exportExcel");
exportExcel.addEventListener("click", function () {
    const headers = Object.keys(stockArr[0]);
    let csv = headers.join(",") + "\n";
    stockArr.forEach(row => {
        let values = headers.map(header => row[header] == 'high' ? '高预期' : row[header] == 'mid' ? '中预期' : row[header] == 'low' ? '低预期' : row[header] == 'future' ? '未来' : row[header] == 'share' ? '分红' : row[header] == 'money' ? '盈利' : row[header]);
        csv += values.join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "中国大陆A股策略.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

//表格随着浏览器尺寸变化调整
$(window).bind('resize', function () {
    $("#gridTable").setGridWidth($(window).width() - 2);
    $("#gridTable").setGridHeight($(window).innerHeight() - 284.5);
    $("#gridTableTwo").setGridWidth($(window).width() - 2);
    $("#gridTableTwo").setGridHeight($(window).innerHeight() - 284.5);
    $("#gridTableThree").setGridWidth($(window).width() - 2);
    $("#gridTableThree").setGridHeight($(window).innerHeight() - 284.5);
}).trigger('resize');

//定义一个函数，计算数组的平均值
function mean(array) {
    //如果数组为空，返回0
    if (array.length === 0) {
        return 0;
    }
    //用reduce方法，求和数组中的所有元素
    let sum = array.reduce((a, b) => a + b);
    //用数组长度，求平均值
    return (sum / array.length).toFixed(2);
}