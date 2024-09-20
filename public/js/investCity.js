var stockArr = [];
const urlParams = new URLSearchParams(window.location.search);
const cityId = urlParams.get('cityId');
//时间参数开始
var allDate = new Date();
var lastAllDate = new Date();
var thisYear = allDate.getFullYear();
var thisMonth = String(allDate.getMonth() + 1).padStart(2, '0');
var thisDay = String(allDate.getDate()).padStart(2, '0');
var thisDate = thisYear + '-' + thisMonth + '-' + thisDay;

lastAllDate.setMonth(lastAllDate.getMonth() - 1);
var lastYear = lastAllDate.getFullYear();
var lastMonth = String(lastAllDate.getMonth() + 1).padStart(2, '0');
var lastDay = String(lastAllDate.getDate()).padStart(2, '0');
var lastDate = lastYear + '-' + lastMonth + '-' + lastDay;
//时间参数结束
$(function () {
    init();
});

function init() {
    $.ajax({
        url: '/api/getInvestTable',
        type: 'GET',
        data:{
            area:cityId
        },
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    stockArr.push({ id: parse[i].id, name: parse[i].investname, useday: parse[i].useday.split('T')[0], publish: parse[i].publish, revenue: parse[i].revenue, baltype: parse[i].baltype, remarks: parse[i].remarks });
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
        complete: function (res) {
            $("#gridTable").jqGrid({
                autowidth: true,
                height: $(window).height() - 155,
                colModel: [
                    { name: "id", label: "编号", width: 40, hidden: true },
                    { name: "name", label: "投资名称", width: 40 },
                    { name: "useday", label: "何时投资", width: 50 },
                    { name: "publish", label: "承销机构", width: 50 },
                    { name: "revenue", label: "投资金额", width: 50 },
                    { name: "baltype", label: "投资类别", formatter: balanceType, width: 30 },
                    { name: "remarks", label: "攻略备注" },
                ],
                data: stockArr,
                guiStyle: "bootstrap",
                multiselect: true,
                iconSet: "fontAwesome",
                sortname: "date",
                sortorder: "desc",
                rowList: [10, 20, 30, 50, 100],
                pager: true,
                viewrecords: true,
                rowNum: 30,
                shrinkToFit: true,
                beforeRequest: function () {
                    layer.load();
                },
                gridComplete: function () {
                    layer.closeAll('loading');
                }
            }).jqGrid('setFrozenColumns');
        }
    });
    //设置流水类别
    function balanceType(cellvalue, options, rowObject) {
        if (cellvalue == '0') {
            return '基金';
        } else if(cellvalue == '1') {
            return '股票';
        } else if(cellvalue == '2') {
            return '期货';
        } else if(cellvalue == '3') {
            return '房产';
        } else if(cellvalue == '4') {
            return '外汇';
        } else if(cellvalue == '5') {
            return '古董';
        } else if(cellvalue == '6') {
            return '债券';
        } else if(cellvalue == '7') {
            return '存款';
        } else if(cellvalue == '8') {
            return '贵金属';
        } else if(cellvalue == '9') {
            return '艺术品';
        }
    }
}

//添加投资记录页面
var addInsurance = document.getElementById("btnInvestAdd");
addInsurance.addEventListener("click", function () {
    let id = jQuery("#gridTable").jqGrid('getGridParam', 'selrow');
    if(id != null){
        layer.msg('请不要勾选的情况下添加')
    }else{
        customAddPage('addInvest', '添加投资记录', './invest-control-add.html', '/api/postInvestdata');
    }
});

//编辑投资记录页面
var editInsurance = document.getElementById("btnInvestEdit");
editInsurance.addEventListener("click", function () {
    let id = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
    if(id.length == 0){
        layer.msg('请选择至少一条信息进行编辑');
    }else{
        if(id.length > 1){
            layer.msg('请不要多选的情况下编辑');
        }else{
            customAddPage('editInvest', '编辑投资记录', './invest-control-edit.html?ids=' + id[0], '/api/updateInvestTable', id[0]);
        }   
    }
});

//添加与编辑投资记录通用方法
function customAddPage(_id, _title, _content, _url, _ids) {
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
            var getName = layero.find('iframe').contents().find('#nameSafe');
            var getDate = layero.find('iframe').contents().find('#changeDate');
            var getPublish = layero.find('iframe').contents().find('#namePublish');
            var getMoneyVal = layero.find('iframe').contents().find('#moneyVal');
            var getSafeType = layero.find('iframe').contents().find('#safeType');
            var getRemarks = layero.find('iframe').contents().find('#remarks');
            var getArea = cityId;
            if (getName[0].value == '' || getDate[0].value == '') {
                DialogMessage(0, `请填写名称和日期信息`, 1);
            } else {
                $.ajax({
                    url: _url,
                    type: 'POST',
                    data: {
                        sentid: _ids,
                        name: getName[0].value,
                        useday: getDate[0].value,
                        baltype: getSafeType[0].value,
                        publish: getPublish[0].value,
                        revenue: getMoneyVal[0].value,
                        remarks: getRemarks[0].value,
                        area:getArea
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

//批量删除投资记录
var deleteInvest = document.getElementById("btnInvestDelete");
deleteInvest.addEventListener("click", function () {
    customDeletePage("#gridTable", '/api/deleteInvest');
});

//删除投资记录通用方法
function customDeletePage(_gridTable, _url,) {
    var s = jQuery(_gridTable).jqGrid('getGridParam', 'selarrrow');
    $.ajax({
        url: _url,
        type: 'POST',
        data: {
            ids: s.join(','),
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

var searchInvestBtn = document.getElementById("searchInvestBtn");
searchInvestBtn.addEventListener("click", function () {
    customBalance();
});

//搜索通用方法
function customBalance() {
    let balanceArrPara = {
        name: $('#nameInvest').val(),
        useday: $('#stname').val(),
        baltype: $('#baltype').val(),
        area: cityId
    };
    newJQgrid('/api/searchInvestTable', balanceArrPara, "#gridTable");
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
                for (let i = 0; i < parse.length; i++) {
                    searchArr.push({ id: parse[i].id, name: parse[i].investname, useday: parse[i].useday.split('T')[0], publish: parse[i].publish, revenue: parse[i].revenue, baltype: parse[i].baltype, remarks: parse[i].remarks });
                }
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