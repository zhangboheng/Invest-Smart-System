var rulesArr = [];
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
        url: '/api/getRulesTable',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    rulesArr.push({ id: parse[i].id, webname:parse[i].webname, name: parse[i].rulesname, useday: parse[i].useday.split('T')[0], content: parse[i].content, baltype: parse[i].baltype, catalogue: parse[i].catalogue, action: parse[i].action, valid: parse[i].valid, classmodel: parse[i].classmodel, totals: parse[i].totals });
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
                    { name: "id", label: "编号", hidden: true },
                    { name: "webname", label: "网站名称" },
                    { name: "name", label: "网站地址" },
                    { name: "useday", label: "初建时间" },
                    { name: "content", label: "内容条件" },
                    { name: "baltype", label: "条件类别", formatter: balanceType },
                    { name: "catalogue", label: "所属分类", formatter: inCatalogue },
                    { name: "action", label: "是否执行", formatter: checkAction },
                    { name: "valid", label: "是否有效", formatter: checkValid },
                    { name: "classmodel", label: "规则模式", formatter: checkModel },
                    { name: "totals", label: "接收条目" }
                ],
                data: rulesArr,
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
    //设置采集类别
    function balanceType(cellvalue, options, rowObject) {
        if (cellvalue == '0') {
            return 'API';
        } else if(cellvalue == '1') {
            return '网站';
        } else if(cellvalue == '2') {
            return 'RSS';
        }
    }
    //设置是否执行
    function checkAction(cellvalue, options, rowObject) {
        if (cellvalue == '0') {
            return '否';
        } else if(cellvalue == '1') {
            return '是';
        }
    }
    //设置是否有效
    function checkValid(cellvalue, options, rowObject) {
        if (cellvalue == '0') {
            return '是';
        } else if(cellvalue == '1') {
            return '否';
        }
    }
    //设置规则模式
    function checkModel(cellvalue, options, rowObject){
        if (cellvalue == '1') {
            return '模式一';
        } else if(cellvalue == '2') {
            return '模式二';
        } else if(cellvalue == '3') {
            return '模式三';
        } else if(cellvalue == '4') {
            return '模式四';
        } else if(cellvalue == '5') {
            return '模式五';
        } else if(cellvalue == '6') {
            return '模式六';
        }    
    }
    //设置所属分类
    function inCatalogue(cellvalue, options, rowObject){
        if (cellvalue == '0') {
            return '综合';
        } else if(cellvalue == '1') {
            return '财经';
        } else if(cellvalue == '2') {
            return 'IT';
        } else if(cellvalue == '3') {
            return '观点';
        } else if(cellvalue == '4') {
            return '娱乐';
        } else if(cellvalue == '5') {
            return '影音';
        } else if(cellvalue == '6') {
            return '福利';
        } else if(cellvalue == '7') {
            return '学习';
        } else if(cellvalue == '8') {
            return '运动';
        } else if(cellvalue == '9') {
            return '游戏';
        }           
    }
}

//添加规则条目
var addRules = document.getElementById("btnRulesAdd");
addRules.addEventListener("click", function () {
    let id = jQuery("#gridTable").jqGrid('getGridParam', 'selrow');
    if(id != null){
        layer.msg('请不要勾选的情况下添加')
    }else{
        customAddPage('addInvest', '添加新闻规则页面', './news-rules-add.html', '/api/postRulesdata');
    }
});

//编辑新闻规则页面
var editRules = document.getElementById("btnRulesEdit");
editRules.addEventListener("click", function () {
    let id = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
    if(id.length == 0){
        layer.msg('请选择至少一条信息进行编辑');
    }else{
        if(id.length > 1){
            layer.msg('请不要多选的情况下编辑');
        }else{
            customAddPage('editRules', '编辑新闻规则页面', './news-rules-edit.html?ids=' + id[0], '/api/updateRulesTable', id[0]);
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
            var getWeb = layero.find('iframe').contents().find('#webName');
            var getName = layero.find('iframe').contents().find('#nameSafe');
            var getPublish = layero.find('iframe').contents().find('#namePublish');
            var getSafeType = layero.find('iframe').contents().find('#safeType');
            var getDate = layero.find('iframe').contents().find('#changeDate');
            var getCheck = layero.find('iframe').contents().find('#checkAction');
            var getModel = layero.find('iframe').contents().find('#checkModel');
            var getCatalogue = layero.find('iframe').contents().find('#inCatalogue');
            if (getWeb[0].value == "" || getName[0].value == '' || getPublish[0].value == '' || getSafeType[0].value == '==请选择=='|| getCheck[0].value == '==请选择==' || getModel[0].value == '==请选择==' || getCatalogue[0].value == '==请选择==' || getDate[0].value == '') {
                DialogMessage(0, `请填写名称,地址,编辑内容,类型,是否执行和日期`, 1);
            } else {
                $.ajax({
                    url: _url,
                    type: 'POST',
                    data: {
                        sentid: _ids,
                        web: getWeb[0].value,
                        name: getName[0].value,
                        content: getPublish[0].value,
                        baltype: getSafeType[0].value,
                        useday: getDate[0].value,
                        action: getCheck[0].value,
                        classmodel: getModel[0].value,
                        catalogue: getCatalogue[0].value
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
var deleteRules = document.getElementById("btnRulesDelete");
deleteRules.addEventListener("click", function () {
    customDeletePage("#gridTable", '/api/deleteRules');
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

var searchRulesBtn = document.getElementById("searchRulesBtn");
searchRulesBtn.addEventListener("click", function () {
    customBalance();
});

//搜索通用方法
function customBalance() {
    let balanceArrPara = {
        web: $('#webName').val(),
        baltype: $('#baltype').val(),
        action: $('#checkAction').val(),
    };
    newJQgrid('/api/searchRulesTable', balanceArrPara, "#gridTable");
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
                    searchArr.push({ id: parse[i].id, webname: parse[i].webname, name: parse[i].rulesname, useday: parse[i].useday.split('T')[0], content: parse[i].content, baltype: parse[i].baltype, catalogue: parse[i].catalogue, action: parse[i].action, valid: parse[i].valid, classmodel: parse[i].classmodel, totals: parse[i].totals });
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