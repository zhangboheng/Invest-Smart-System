$(function () {
    getIdeaArticles('');
});

//刷新思维扩展区页面
$('#btnIdeasRefresh').on('click', function () {
    window.location.href = '/idea';
});
//搜索关键词展示思维列表
$('#searchIdeasBtn').on('click',function(){
    let keywords = $('#searchIdeas').val();
    const endwords = keywords.toUpperCase();
    const parentUl = document.getElementById("ideaArticles");
    const childLi = parentUl.getElementsByTagName('li');
    for (let i = 0; i < childLi.length; i++) {
        let txtValue = childLi[i].textContent || childLi[i].innerText;
        if (txtValue.toUpperCase().indexOf(endwords) > -1) {
            childLi[i].style.display = "";
        } else {
            childLi[i].style.display = "none";
        }
    }
});

//获取思维扩展列表
function getIdeaArticles(_keys = '') {
    var text = '';
    layer.load();
    $.ajax({
        url: '/api/getIdeasExtentions',
        type: 'GET',
        data: {
            keyword: _keys
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            $('#ideaArticles ul').empty();
            $('#ideaArticles input[type=checkbox]').prop('checked', false);
            $('#hideKeys').empty();
            if (data[0].ret) {
                let param = data[0].code;
                if (param.length == 0) {
                    $('#ideaArticles ul').append(`
                        <li><span>没有相关内容</span></li>
                `   );
                } else {
                    for (let i = 0; i < param.length; i++) {
                        $('#ideaArticles ul').append(`
                            <li><input type="checkbox" id="${param[i].id}" /><span onclick="DialogFullScreen('${param[i].id}','${param[i].title}')">${param[i].title}</span></li>
                        `);
                    }
                }
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，请联系管理员');
            layer.closeAll('loading');
        },
        complete: function (res) {
            $('#ideaArticles input[type=checkbox]').on('click', function () {
                if ($(this)[0].checked) {
                    text += $(this)[0].id + ',';
                } else {
                    text = text.replace($(this)[0].id + ',', '');
                }
                $('#hideKeys').text(text);
            });
        }
    });
}
//添加思维扩展条目
var addIdeas = document.getElementById("btnIdeasAdd");
addIdeas.addEventListener("click", function () {
    customAddPage('addIdeas', '添加思维扩展', './pages/idea/ideas-extensions-add.html', '/api/postIdeasExtensions');
});
//编辑思维扩展条目
var btnIdeasEdit = document.getElementById("btnIdeasEdit");
btnIdeasEdit.addEventListener("click", function () {
    let _idKeys = $('#hideKeys').text();
    if(_idKeys == ''){
        layer.msg('请至少选择一项');
    }else if(_idKeys.split(',').length > 2){
        layer.msg('只能选择一个条目');
    }else{
        customAddPage('editIdeas', '编辑思维扩展', './pages/idea/ideas-extensions-edit.html?ids=' + _idKeys.slice(0, -1), '/api/updateIdeasContent', _idKeys.slice(0, -1));
    }
});
function customAddPage(_id, _title, _content, _url, _ids='') {
    layer.open({
        id: _id, //设定一个id，防止重复弹出
        type: 2,
        title: _title,
        area: ['600px', '480px'],
        shade: 0,
        maxmin: false,
        skin: 'btnAddLayui',
        content: _content,
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            var getTitle = layero.find('iframe').contents().find('#titleAdd');
            var getContent = layero.find('iframe').contents().find('#contentAdd');
            if (getTitle[0].value == '' || getContent[0].value == '') {
                DialogMessage(0, `请填写所有信息，缺一不可！`, 1);
            } else {
                $.ajax({
                    url: _url,
                    type: 'POST',
                    data: {
                        title: getTitle[0].value,
                        content: getContent[0].value,
                        id: _ids
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            DialogMessageTop(0, `${data[0].code}`, 3);
                            getIdeaArticles();
                            layer.closeAll();
                        } else {
                            DialogMessage(0, `${data[0].code}`, 4);
                        }
                        $('#ideaArticles input[type=checkbox]').prop('checked', false);
                        $('#hideKeys').empty();
                    }
                });
            }
        },
        btn2: function () {
            layer.closeAll();
            $('#ideaArticles input[type=checkbox]').prop('checked', false);
            $('#hideKeys').empty();
        },
        zIndex: layer.zIndex,
        success: function (layero) {
            layer.setTop(layero);
        }
    });
}
//删除点子
$('#btnIdeasDelete').on('click', function () {
    let _idKeys = $('#hideKeys').text();
    if (_idKeys.length == 0) {
        layer.msg('请至少选择一项');
    } else {
        deleteIdeaArticles(_idKeys.slice(0,-1));
        $('#ideaArticles input[type=checkbox]').prop('checked', false);
        $('#hideKeys').empty();
    }
});

function deleteIdeaArticles(_keys = '') {
    layer.load();
    $.ajax({
        url: '/api/deleteIdeasExtensions',
        type: 'POST',
        data: {
            ids: _keys
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            if (data[0].ret) {
                layer.msg(data[0].code);
            } else {
                layer.msg(data[0].code);
            }
            getIdeaArticles('');
        },
        error: function (err) {
            layer.msg('服务出现故障，请联系管理员');
            layer.closeAll('loading');
        }
    });
}

//选择弹出全面屏弹窗
function DialogFullScreen(_id, _title) {
    var index = layer.open({
        title: _title,
        type: 2,
        content: './pages/idea/ideas-extensions-read.html?id=' + _id,
        area: ['1920px', '100vh'],
    })
    layer.full(index);
}