$(function () {
    getToDoList();
});

//刷新待办事项区页面
$('#btnSearch').on('click', function () {
    window.location.href = '/todo';
});

//添加todo项目
var addTodo = document.getElementById("btnAdd");
addTodo.addEventListener("click", function () {
    layer.open({
        id: 'toDoAdd', //设定一个id，防止重复弹出
        type: 2,
        title: '添加 Todo 项目',
        area: ['400px', '330px'],
        shade: 0,
        maxmin: false,
        skin: 'btnAddLayui',
        content: './pages/todo/calendar-to-add.html',
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            var toDoName = layero.find('iframe').contents().find('#nameAdd');
            var beginTime = layero.find('iframe').contents().find('#stimeAdd');
            var revenueInfo = layero.find('iframe').contents().find('#revenueAdd');
            var remarksInfo = layero.find('iframe').contents().find('#remarksAdd');
            if (toDoName[0].value == '' || beginTime[0].value == '' || revenueInfo[0].value == '== 请选择 ==' || remarksInfo[0].value == '') {
                DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
            } else {
                $.ajax({
                    url: '/api/postToDodata',
                    type: 'POST',
                    data: {
                        todoname: toDoName[0].value,
                        btime: beginTime[0].value,
                        revenue: revenueInfo[0].value,
                        remarks: remarksInfo[0].value,
                        type: '0',
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            DialogMessageTop(0, `${data[0].code}`, 3);
                            layer.closeAll();
                            getToDoList();
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
});

//编辑todo项目
var editBalance = document.getElementById("btnEdit");
editBalance.addEventListener("click", function () {
    let _id = $('#hideRadioIDs').text();
    if(_id!=''){
        layer.open({
            id: 'toDoEdit', //设定一个id，防止重复弹出
            type: 2,
            title: '编辑 Todo 项目',
            area: ['400px', '330px'],
            shade: 0,
            maxmin: false,
            skin: 'btnAddLayui',
            content: './pages/todo/calendar-to-edit.html?ids=' + _id,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                var toDoName = layero.find('iframe').contents().find('#nameAdd');
                var beginTime = layero.find('iframe').contents().find('#stimeAdd');
                var revenueInfo = layero.find('iframe').contents().find('#revenueAdd');
                var remarksInfo = layero.find('iframe').contents().find('#remarksAdd');
                if (toDoName[0].value == '' || beginTime[0].value == '' || revenueInfo[0].value == '== 请选择 ==' || remarksInfo[0].value == '') {
                    DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
                } else {
                    $.ajax({
                        url: '/api/updateToDodata',
                        type: 'POST',
                        data: {
                            ids:_id,
                            todoname: toDoName[0].value,
                            btime: beginTime[0].value,
                            revenue: revenueInfo[0].value,
                            remarks: remarksInfo[0].value,
                            type: '0',
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data[0].ret) {
                                DialogMessageTop(0, `${data[0].code}`, 3);
                                layer.closeAll();
                                getToDoList();
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
});

//点击完成事件
var editComplete = document.getElementById("completeItem");
editComplete.addEventListener('click', function(){
    let _id = $('#hideRadioIDs').text();
    if(_id!=''){
        $.ajax({
            url: '/api/updateCompleteToDodata',
            type: 'POST',
            data: {
                ids:_id,
                type: '1',
            },
            dataType: 'json',
            success: function (data) {
                if (data[0].ret) {
                    layer.msg(data[0].code);
                    $('#hideRadioIDs').empty();
                    getToDoList();
                } else {
                    layer.msg(data[0].code);
                }
            }
        })
    }else{
        DialogMessageTop(0, `请选择一条信息进行编辑`, 3);
    }
});

//点击删除事件
var delToDo = document.getElementById("btnDelete");
delToDo.addEventListener('click',function(){
    let _id = $('#hideRadioIDs').text();
    if(_id!=''){
        $.ajax({
            url: '/api/deleteToDoTable',
            type: 'POST',
            data: {
                ids:_id,
            },
            dataType: 'json',
            success: function (data) {
                if (data[0].ret) {
                    layer.msg(data[0].code);
                    $('#hideRadioIDs').empty();
                    getToDoList();
                } else {
                    layer.msg(data[0].code);
                }
            }
        })
    }else{
        DialogMessageTop(0, `请选择一条信息进行删除`, 3);
    }
});

//搜索计划按钮
$('#searchBtn').on('click', function () {
    let a = $('#nameItem').val();
    let b = $('#revenueAdd').val();
    getToDoList(a,b,'/api/searchToDoTable');
});

//获取待办事项和完成事项
function getToDoList(_a='',_b='',_url='/api/getTodoTable') {
    $.ajax({
        url: _url,
        type: 'GET',
        data:{
            toname:_a,
            type:_b
        },
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                $('#sortable').empty();
                $('#finishiList').empty();
                let parse = JSON.parse(data[0].code);
                for (let i = 0; i < parse.length; i++) {
                    if (parse[i].ordertype == '0') {
                        $('#sortable').append(`
                        <li class="ui-state-default" data-name="${parse[i].id}" title="${parse[i].remarks}"><p><input type="radio" name="todounlist" id="${parse[i].id}"></p><p>${parse[i].toname.length>=18 ? parse[i].toname.slice(0,18) + '...' : parse[i].toname}</p><p style="padding: 2px;">${parse[i].ordertime}</p></li>
                    `);
                    } else {
                        $('#finishiList').append(`
                        <li class="ui-state-default" id="${parse[i].id}" title="${parse[i].remarks}"><p>${parse[i].toname.length>=18 ? parse[i].toname.slice(0,18) + '...' : parse[i].toname}</p><p style="padding: 2px;">${parse[i].ordertime}</p></li>
                        `)
                    }
                }
            }
        },
        error: function (err) {
            console.log(err);
        },
        complete: function (res) {
            $("#sortable").sortable({
                axis: 'y',
                update: function (event, ui) {
                    var datas = $(this).sortable('toArray', {attribute: 'data-name'});
                    $.ajax({
                        url: '/api/orderToDoTable',
                        type: 'POST',
                        data: {
                            ids: datas.join(','),
                        },
                        success: function (data) {
                            console.info(data);
                        }
                    })
                }
            });
            $("#sortable").disableSelection();
            $('input[type=radio][name=todounlist]').on('change',function() {
                let ids = $(this).attr('id');
                $('#hideRadioIDs').html(ids);
            });
            $('#finishiList .ui-state-default').on('dblclick', function(){
                let ids = $(this).attr('id');
                $.ajax({
                    url: '/api/updateCompleteToDodata',
                    type: 'POST',
                    data: {
                        ids: ids,
                        type: '0',
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            layer.msg(data[0].code);
                            $('#hideRadioIDs').empty();
                            getToDoList();
                        } else {
                            layer.msg(data[0].code);
                        }
                    }
                });
            })
        }
    })
}