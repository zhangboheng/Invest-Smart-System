var countStep = 1;
$(function () {
    getDataAnalytics();
    getFundsData();
    setInterval(() => {
        getDataAnalytics($('#nameCurrency').val());
        getIndexData($('#nameStock').val());
        getFuturesData($('#nameFutures').val());
        getMetalData($('#nameMetal').val());
    }, 1000 * 60 * 5);
});

//点击汇率刷新
var currencyRefresh = document.getElementById('currencyRefresh');
currencyRefresh.addEventListener('click', function () {
    window.location.href = '/analytics';
});
//点击指数刷新
var stockRefresh = document.getElementById('stockRefresh');
stockRefresh.addEventListener('click', function () {
    window.location.href = '/analytics';
});
//点击期货刷新
var stockRefresh = document.getElementById('futuresRefresh');
stockRefresh.addEventListener('click', function () {
    window.location.href = '/analytics';
});
//点击贵金属刷新
var metalRefresh = document.getElementById('metalRefresh');
metalRefresh.addEventListener('click', function () {
    window.location.href = '/analytics';
});
//点击中国基金刷新
var metalRefresh = document.getElementById('fundsRefresh');
metalRefresh.addEventListener('click', function () {
    window.location.href = '/analytics';
});
//添加基金页面
var addFund = document.getElementById("btnFundsAdd");
addFund.addEventListener("click", function () {
    customAddPage('addFund', '添加投资标的基金', './pages/invest/tab-funds-add.html');
});
//点击获取汇率说明
var currencyInfo = document.getElementById('btnInfo');
currencyInfo.addEventListener('click', function () {
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
            <h1>汇率牌价说明</h1>
            <div style="margin-top:20px;">
                <ul>
                    <li>本汇率表单位为1外币换算人民币，仅供参考，客户办理结/购汇业务时，应以中国银行网上银行、手机银行、智能柜台或网点柜台实际交易汇率为准</li>
                    <li>数据来源于中国银行</li>
                </ul>
            </div>
        </div>
        `
    });
});
//点击汇率搜索
$('#searchCurrencyBtn').on('click', function () {
    let keyword = $('#nameCurrency').val();
    getDataAnalytics(keyword);
});
//点击指数搜索
$('#searchStockBtn').on('click', function () {
    let keyword = $('#nameStock').val();
    getIndexData(keyword);
});
//点击期货搜索
$('#searchFuturesBtn').on('click', function () {
    let keyword = $('#nameFutures').val();
    getFuturesData(keyword);
});
//点击贵金属搜索
$('#searchMetalBtn').on('click', function () {
    let keyword = $('#nameMetal').val();
    getMetalData(keyword);
});
//点击基金搜索
$('#searchFundsBtn').on('click', function () {
    let keyword = $('#nameFunds').val();
    $("#fundsAnaly ul li").filter(function() {
        $(this).toggle($(this).attr('title').toLowerCase().indexOf(keyword) > -1)
    });
});
//获取汇率数据
function getDataAnalytics(_keyword = '') {
    layer.load();
    $.ajax({
        url: '/api/getCurrencyData',
        type: 'GET',
        data: {
            keyword: _keyword
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            $('#currencyAnaly ul').empty();
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#currencyAnaly ul').append(`
                                <li><span>没有相关内容</span></li>
                `           );
                } else {
                    for (let i = 0; i < param.length; i++) {
                        $('#currencyAnaly ul:eq(' + i % 4 + ')').append('<li><span>人民币</span><span>' + param[i].value + '</span><span>:</span><span>1.00</span><span>' + param[i].key + '</span></li>');
                    }
                }
                $('#updateTime').text(param[0].time);
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，请联系管理员');
            layer.closeAll('loading');
        },
        complete: function (res) {

        }
    })
}
//获取股指数据
function getIndexData(_keyword = '') {
    layer.load();
    $.ajax({
        url: '/api/getStockChangeData',
        type: 'GET',
        data: {
            keyword: _keyword
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            $('#stockAnaly ul').empty();
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#stockAnaly ul').append(`
                                <li><span>没有相关内容</span></li>
                `           );
                } else {
                    for (let i = 0; i < param.length; i++) {
                        if (i % 4 == 0) {
                            if (param[i].upAndDown > 0) {
                                $('#stockAnaly ul:eq(0)').append(`
                                    <li><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                            `   );
                            } else if (param[i].upAndDown == 0) {
                                $('#stockAnaly ul:eq(0)').append(`
                                    <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `               );
                            } else {
                                $('#stockAnaly ul:eq(0)').append(`
                                    <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
            `                   );
                            }
                        }
                        if (i % 4 == 1) {
                            if (param[i].upAndDown > 0) {
                                $('#stockAnaly ul:eq(1)').append(`
                                    <li><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                            `   );
                            } else if (param[i].upAndDown == 0) {
                                $('#stockAnaly ul:eq(1)').append(`
                                    <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `               );
                            } else {
                                $('#stockAnaly ul:eq(1)').append(`
                                    <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
            `                   );
                            }
                        } if (i % 4 == 2) {
                            if (param[i].upAndDown > 0) {
                                $('#stockAnaly ul:eq(2)').append(`
                                    <li><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                            `   );
                            } else if (param[i].upAndDown == 0) {
                                $('#stockAnaly ul:eq(2)').append(`
                                    <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `               );
                            } else {
                                $('#stockAnaly ul:eq(2)').append(`
                                    <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
            `                   );
                            }
                        } if (i % 4 == 3) {
                            if (param[i].upAndDown > 0) {
                                $('#stockAnaly ul:eq(3)').append(`
                                    <li><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                            `   );
                            } else if (param[i].upAndDown == 0) {
                                $('#stockAnaly ul:eq(3)').append(`
                                    <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `               );
                            } else {
                                $('#stockAnaly ul:eq(3)').append(`
                                    <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].stockIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
            `                   );
                            }
                        }
                    }
                }
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，请联系管理员');
            layer.closeAll('loading');
        },
        complete: function (res) {

        }
    })
}
//获取期货分析
function getFuturesData(_keyword = '') {
    layer.load();
    var urls = ['/api/getFuturesChangeData', '/api/getFuturesGlobalChangeData'];
    $('#futuresAnaly ul').empty();
    $.each(urls, function (i, u) {
        $.ajax({
            url: u,
            type: 'GET',
            data: {
                keyword: _keyword
            },
            datatype: 'json',
            success: function (data) {
                layer.closeAll('loading');
                if (data[0].ret) {
                    let param = JSON.parse(data[0].code);
                    if (param.length == 0) {
                        $('#futuresAnaly ul').append(`
                                    <li><span>没有相关内容</span></li>
                    `           );
                    } else {
                        for (let i = 0; i < param.length; i++) {
                            if (i % 4 == 0) {
                                if (param[i].upAndDown > 0) {
                                    $('#futuresAnaly ul:eq(0)').append(`
                                        <li><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                                `   );
                                } else if (param[i].upAndDown == 0) {
                                    $('#futuresAnaly ul:eq(0)').append(`
                                        <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                    `               );
                                } else {
                                    $('#futuresAnaly ul:eq(0)').append(`
                                        <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `                   );
                                }
                            }
                            if (i % 4 == 1) {
                                if (param[i].upAndDown > 0) {
                                    $('#futuresAnaly ul:eq(1)').append(`
                                        <li><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                                `   );
                                } else if (param[i].upAndDown == 0) {
                                    $('#futuresAnaly ul:eq(1)').append(`
                                        <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                    `               );
                                } else {
                                    $('#futuresAnaly ul:eq(1)').append(`
                                        <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `                   );
                                }
                            } if (i % 4 == 2) {
                                if (param[i].upAndDown > 0) {
                                    $('#futuresAnaly ul:eq(2)').append(`
                                        <li><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                                `   );
                                } else if (param[i].upAndDown == 0) {
                                    $('#futuresAnaly ul:eq(2)').append(`
                                        <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                    `               );
                                } else {
                                    $('#futuresAnaly ul:eq(2)').append(`
                                        <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `                   );
                                }
                            } if (i % 4 == 3) {
                                if (param[i].upAndDown > 0) {
                                    $('#futuresAnaly ul:eq(3)').append(`
                                        <li><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>+${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                                `   );
                                } else if (param[i].upAndDown == 0) {
                                    $('#futuresAnaly ul:eq(3)').append(`
                                        <li style="background-color:#666;"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                    `               );
                                } else {
                                    $('#futuresAnaly ul:eq(3)').append(`
                                        <li style="background-color:cadetblue"><span>${param[i].name}</span><span>${param[i].futuresIndex}</span><span>${param[i].upAndDown}</span><span>${param[i].upAndDownPercent}</span></li>
                `                   );
                                }
                            }
                        }
                    }
                }
            },
            error: function (err) {
                layer.msg('服务出现故障，请联系管理员');
                layer.closeAll('loading');
            }
        })
    });
}
//获取贵金属分析
function getMetalData(_keyword = '') {
    layer.load();
    const uls = $('#metalAnaly ul');
    $.ajax({
        url: '/api/getMetalChangeData',
        type: 'GET',
        data: {
            keyword: _keyword
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            $('#metalAnaly ul').empty();
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#metalAnaly ul').append(`
                                <li><span>没有相关内容</span></li>
                `           );
                } else {
                    for (let i = 0; i < param.length; i++) {
                        const item = param[i];
                        const index = i % 4;
                        let backgroundColor = '';
                        if (item.upAndDown > 0) {
                            item.upAndDown = `+${item.upAndDown}`;
                        } else if (item.upAndDown < 0) {
                            backgroundColor = ' style="background-color:cadetblue"';
                        } else {
                            backgroundColor = ' style="background-color:#666;"';
                        }
                        uls.eq(index).append(`<li${backgroundColor}><span>${item.name}</span><span>${item.metalIndex}</span><span>${item.upAndDown}</span><span>${item.upAndDownPercent}</span></li>`);
                    }
                }
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，请联系管理员');
            layer.closeAll('loading');
        },
        complete: function (res) {

        }
    })
}
//获取中国基金分析
function getFundsData(_keyword = '', _page = 1) {
    layer.load();
    $.ajax({
        url: '/api/getFundsChangeData',
        type: 'GET',
        data: {
            keyword: _keyword,
            page: _page
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#fundsAnaly ul').append(`
                                <li><span>没有相关内容</span></li>
                `           );
                } else {
                    for (let i = 0; i < param.length; i++) {
                        if (i % 3 == 0) {
                            if (param[i].percent.slice(0, -1) > 0) {
                                $('#fundsAnaly ul:eq(0)').append(`
                                    <li title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
                            `   );
                            } else if (param[i].percent.slice(0, -1) == 0) {
                                $('#fundsAnaly ul:eq(0)').append(`
                                    <li style="background-color:#666;" title="https:${param[i].name}"  onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
                `               );
                            } else {
                                $('#fundsAnaly ul:eq(0)').append(`
                                    <li style="background-color:cadetblue" title="https:${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
            `                   );
                            }
                        }
                        if (i % 3 == 1) {
                            if (param[i].percent.slice(0, -1) > 0) {
                                $('#fundsAnaly ul:eq(1)').append(`
                                    <li title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
                            `   );
                            } else if (param[i].percent.slice(0, -1) == 0) {
                                $('#fundsAnaly ul:eq(1)').append(`
                                    <li style="background-color:#666;" title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
                `               );
                            } else {
                                $('#fundsAnaly ul:eq(1)').append(`
                                    <li style="background-color:cadetblue" title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
            `                   );
                            }
                        } if (i % 3 == 2) {
                            if (param[i].percent.slice(0, -1) > 0) {
                                $('#fundsAnaly ul:eq(2)').append(`
                                    <li title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
                            `   );
                            } else if (param[i].percent.slice(0, -1) == 0) {
                                $('#fundsAnaly ul:eq(2)').append(`
                                    <li style="background-color:#666;" title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
                `               );
                            } else {
                                $('#fundsAnaly ul:eq(2)').append(`
                                    <li style="background-color:cadetblue" title="${param[i].name}" onclick="openHref('https:${param[i].link}')"><span>${param[i].tcode}</span><span>${param[i].name.length > 12 ? param[i].name.slice(0, 11) + '...' : param[i].name}</span><span>${param[i].values}</span><span>${param[i].percent}</span></li>
            `                   );
                            }
                        }
                    }
                }
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，请联系管理员');
            layer.closeAll('loading');
        }
    })
}

$('#fundsAnaly').on('scroll', function () {
    let keyword = $('#nameFunds').val();
    let scrollHeight = $(this).scrollTop();
    let divHeight = $(this)[0].scrollHeight;
    let thisHeight = $(this).innerHeight();
    let position = divHeight - scrollHeight - thisHeight;
    if(position == 0 && countStep <= 528 && keyword == '') {
        countStep++;
        getFundsData('', countStep);
    }
});

function openHref(_url) {
    var index = layer.open({
        title: '详情',
        type: 2,
        content: _url,
        area: ['1920px', '1080px'],
        maxmin: true
    });
    layer.full(index);
}

//添加股票、基金、优惠信息通用方法
function customAddPage(_id, _title, _content) {
    layer.open({
        id: _id, //设定一个id，防止重复弹出
        type: 2,
        title: _title,
        area: ['400px', '330px'],
        shade: 0,
        maxmin: false,
        skin: 'btnAddLayui',
        content: _content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            if (_id == 'addFund') {
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
