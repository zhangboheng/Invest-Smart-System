//通用列表传参开始
const balanceApi = '/api/searchBalanceTable'; //股票
const balanceSlug = '#gridTable';
function balanceGetInner(_arr, _longth) {
    for (let i = 0; i < _longth.length; i++) {
        _arr.push({ id: _longth[i].id, name: _longth[i].infoname, date: _longth[i].useday.split('T')[0], money: _longth[i].money, baltype: _longth[i].baltype, remarks: _longth[i].remarks });
    }
}
//通用列表传参结束

//收支通用方法
function customBalance() {
    let balanceArrPara = {
        infoname: $('#nameItem').val(),
        useday: $('#stname').val(),
        baltype: $('#baltype').val(),
    };
    newJQgrid(balanceApi, balanceArrPara, balanceSlug);
}

//刷新收支记录页面
$('#btnSearch').on('click', function () {
    window.location.href = '/balance';
});

//搜索收支记录页面
$('#searchBtn').on('click', function () {
    customBalance();
});

//搜索个人财富增长曲线区间
$('#searchBtnTwo').on('click', function () {
    let startTime = $('#startTime').val();
    let endTime = $('#endTIme').val();
    if (startTime == '' || endTime == '') {
        layer.msg('请选择时间段范围');
    } else if (startTime >= endTime) {
        layer.msg('开始时间不能晚于结束时间哦');
    } else {
        getSmartCharts(startTime, endTime)
    }
});

//搜索变动统计柱状图区间
$('#searchBtnThree').on('click', function () {
    let startTime = $('#startTimeTwo').val();
    let endTime = $('#endTImeTwo').val();
    if (startTime == '' || endTime == '') {
        layer.msg('请选择时间段范围');
    } else if (startTime >= endTime) {
        layer.msg('开始时间不能晚于结束时间哦');
    } else {
        getChangeCharts(startTime, endTime)
    }
});

//添加收支记录页面
var addBalance = document.getElementById("btnAdd");
addBalance.addEventListener("click", function () {
    customAddPage('addBalance', '添加收支记录', './pages/balance/money-balance-add.html');
});

//添加收支记录
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
            var getName = layero.find('iframe').contents().find('#msName');
            var changeDate = layero.find('iframe').contents().find('#changeDate');
            var moneyVal = layero.find('iframe').contents().find('#moneyVal');
            var moneyBalance = layero.find('iframe').contents().find('#moneyBalance');
            var remarks = layero.find('iframe').contents().find('#remarks');
            if (getName[0].value == '' || changeDate[0].value == '' || moneyVal[0].value == '== 请选择 ==' || moneyBalance[0].value == '') {
                DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
            } else {
                $.ajax({
                    url: '/api/postBalancedata',
                    type: 'POST',
                    data: {
                        infoname: getName[0].value,
                        useday: changeDate[0].value,
                        money: moneyVal[0].value,
                        baltype: moneyBalance[0].value,
                        remarks: remarks[0].value
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            DialogMessageTop(0, `${data[0].code}`, 3);
                            customBalance();
                            layer.closeAll();
                        } else {
                            DialogMessage(0, `${data[0].code}`, 4);
                        }
                    }
                });
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

//编辑收支页面
var editBalance = document.getElementById("btnEdit");
editBalance.addEventListener("click", function () {
    customEditPage('#gridTable', 'editBalance', '修改收支记录', './pages/balance/money-balance-edit.html?ids=');
});

//编辑收支页面方法
function customEditPage(_gridTable, _id, _title, _content) {
    let id = jQuery(_gridTable).jqGrid('getGridParam', 'selrow');
    if (id != null) {
        layer.open({
            id: _id, //设定一个id，防止重复弹出
            type: 2,
            title: _title,
            area: ['400px', '330px'],
            shade: 0,
            maxmin: false,
            skin: 'btnAddLayui',
            content: _content + id,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var getName = layero.find('iframe').contents().find('#msName');
                var changeDate = layero.find('iframe').contents().find('#changeDate');
                var moneyVal = layero.find('iframe').contents().find('#moneyVal');
                var moneyBalance = layero.find('iframe').contents().find('#moneyBalance');
                var remarks = layero.find('iframe').contents().find('#remarks');
                if (getName[0].value == '' || changeDate[0].value == '' || moneyVal[0].value == '== 请选择 ==' || moneyBalance[0].value == '') {
                    DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                } else {
                    $.ajax({
                        url: '/api/updateBalanceTable',
                        type: 'POST',
                        data: {
                            ids: id,
                            infoname: getName[0].value,
                            useday: changeDate[0].value,
                            money: moneyVal[0].value,
                            baltype: moneyBalance[0].value,
                            remarks: remarks[0].value
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data[0].ret) {
                                DialogMessageTop(0, `${data[0].code}`, 3);
                                layer.closeAll();
                                customBalance();
                            } else {
                                DialogMessage(0, `${data[0].code}`, 4);
                            }
                        }
                    });
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

//批量删除收支记录
var deleteBalance = document.getElementById("btnDelete");
deleteBalance.addEventListener("click", function () {
    customDeletePage("#gridTable", '/api/deleteBalanceTable');
});

//删除收支记录通用方法
function customDeletePage(_gridTable, _url,) {
    var s = jQuery(_gridTable).jqGrid('getGridParam', 'selarrrow');
    $.ajax({
        url: _url,
        type: 'POST',
        data: {
            ids: String(s),
        },
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                DialogMessage(0, `${data[0].code}`, 1);
                customBalance();
            } else {
                DialogMessage(0, `${data[0].code}`, 1);
            }
        }
    });
}

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
                balanceGetInner(searchArr, parse);
            }
        },
        complete: function () {
            layer.closeAll();
            jQuery(_three).clearGridData(true);
            jQuery(_three).jqGrid('setGridParam', {
                datatype: 'local',
                data: searchArr,
            }).trigger("reloadGrid");
        }
    });
}
//获取个人财富增长曲线
function getSmartCharts(_stime = lastDate, _etime = thisDate) {
    var timeArr = [];
    var moneyArr = [];
    var totalArr = [0];
    var chartDom = document.getElementById('fundEcharts');
    var myChart = echarts.init(chartDom, 'macarons', {
        width: window.innerWidth - 20,
        height: window.innerHeight - 194
    });
    $.ajax({
        url: '/api/getFundsEcharts',
        type: 'GET',
        data: {
            stime: _stime,
            etime: _etime,
        },
        dataType: 'json',
        success: function (data) {
            layer.load();
            if (data[0].code.length == 2) {
                timeArr = [_stime, _etime];
                moneyArr = [0, 0];
            } else {
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    timeArr.push(parse[i].useday.split('T')[0]);
                    moneyArr.push(parse[i].money);
                    totalArr.push(parse[i].money);
                }
            }
        },
        error: function (err) {
            layer.msg('获取失败，请刷新');
            layer.closeAll('loading');
        },
        complete: function (result) {
            layer.closeAll('loading');
            let fundsTotal = moneyArr.map((x, y) => (Number(x) + totalArr.slice(0, y + 1).reduce((a, b) => Number(a) + Number(b), 0)).toFixed(2));
            let monthActive = moneyArr.filter(x => Number(x) > 0).reduce((x,y) => Number(x) + Number(y), 0);
            let monthOpposite = moneyArr.filter(x => Number(x) < 0).reduce((x,y) => Number(x) + Number(y), 0);
            $('#incomeTotal').html(`收入总额：${monthActive.toFixed(2)}   `);
            $('#payTotal').html(`支出总额：${monthOpposite.toFixed(2)}`);
            var option = {
                title: {
                    text: `个人财富收支动态曲线(${_stime} - ${_etime})`,
                    left: 'center',
                    top: 'top',
                    textStyle: {
                        fontSize: 20
                    },
                    padding: [30, 0, 0, 0],
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                },
                legend: {
                    data: ['财富总值', '财富日结余'],
                    padding: [10, 0, 0, 0],
                },
                xAxis: {
                    name: '时间',
                    type: 'category',
                    boundaryGap: false,
                    data: timeArr,
                    axisLine: {
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000'
                        },
                        interval:0,
                        rotate:40
                    },
                    splitLine: {
                        show: true
                    },
                },
                yAxis: {
                    name: '金额(单位：元)',
                    type: 'value'
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    },
                    {
                        start: 0,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '财富总值',
                        data: fundsTotal,
                        type: 'line',
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        },
                    },
                    {
                        name: '财富日结余',
                        data: moneyArr,
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            opacity: 0.3,
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(64, 255, 165)'
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(1, 191, 236,0.1)'
                                }
                            ])
                        },
                        label: {
                            show: true,
                            position: 'top'
                        },
                    }
                ]
            };
            option && myChart.setOption(option);
        }
    });
}

//获取收支变动统计柱状图
function getChangeCharts(_stime = lastDate, _etime = thisDate) {
    var timeArr = [];
    var moneyArr = [];
    var chartDom = document.getElementById('changesEcharts');
    var myChart = echarts.init(chartDom, 'macarons', {
        width: window.innerWidth - 20,
        height: window.innerHeight - 194
    });
    $.ajax({
        url: '/api/getChangesEcharts',
        type: 'GET',
        data: {
            stime: _stime,
            etime: _etime,
        },
        dataType: 'json',
        success: function (data) {
            layer.load();
            if (data[0].code.length == 2) {
                timeArr = ['暂无数据'];
                moneyArr = [0];
            } else {
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    timeArr.push(parse[i].name);
                    moneyArr.push(Math.round(parse[i].money * 100) / 100);
                }
            }
        },
        error: function (err) {
            layer.msg('获取失败，请刷新');
            layer.closeAll('loading');
        },
        complete: function (result) {
            layer.closeAll('loading');
            var option = {
                title: {
                    text: `个人财富收支条目变动统计(${_stime} - ${_etime})`,
                    left: 'center',
                    top: 'top',
                    textStyle: {
                        fontSize: 20
                    },
                    padding: [30, 0, 0, 0],
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: {
                    name: '时间',
                    type: 'category',
                    boundaryGap: true,
                    data: timeArr,
                    axisLine: {
                        lineStyle: {
                            color: '#000'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#000'
                        },
                        interval:0,
                        rotate:40
                    },
                    splitLine: {
                        show: true
                    },
                },
                yAxis: {
                    name: '金额(单位：元)',
                    type: 'value'
                },
                dataZoom: [
                    {
                        type: 'inside',
                        start: 0,
                        end: 100
                    },
                    {
                        start: 0,
                        end: 100
                    }
                ],
                series: [
                    {
                        name: '金额',
                        showBackground: true,
                        itemStyle: {
                          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                          ])
                        },
                        emphasis: {
                          itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                              { offset: 0, color: '#2378f7' },
                              { offset: 0.7, color: '#2378f7' },
                              { offset: 1, color: '#83bff6' }
                            ])
                          }
                        },
                        data: moneyArr,
                        type: 'bar',
                        smooth: true,
                        label: {
                            show: true,
                            position: 'top'
                        },
                    },
                ]
            };
            option && myChart.setOption(option);
        }
    });
}

//表格随着浏览器尺寸变化调整
$(window).bind('resize', function() {
  $("#gridTable").setGridWidth($(window).width()-2);
  $("#gridTable").setGridHeight($(window).innerHeight()-284.5);
}).trigger('resize');