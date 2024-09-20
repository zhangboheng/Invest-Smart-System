const timeNow = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + new Date().getDate();
//jQuery Ready
$(function () {
    //定义输入框尺寸
    $('#inputArticles').css({
        'width': 'calc(100% - 20px)',
        'height': 'calc(100% - 220px)',
        'color': '#fff'
    });
    $('#inputTitle').css({
        'width': '100%',
        'padding': '20px 0',
        'text-align': 'center'
    });
    init();
});

//点击目录切换菜单
function toggleNav() {
    $('#mySidepanel').toggle();
}

//刷新恢复默认
function refreshExp() {
   init();
}

//初始化获取经验列表
function init() {
    //获取经验列表
    $.ajax({
        url: '/api/getExperienceArticles',
        type: 'GET',
        data: {

        },
        dataType: 'json',
        success: function (data) {
            shareFunc(data);
        },
        error: function (err) {
            console.log(err);
        },
        complete: function () {
            shareFuncTwo();
        }
    });
}

//添加新经验
function addExp() {
    if ($('#inputTitle').val() == '' && $('#inputArticles').val() == '') {
        layer.msg('请输入标题或者内容');
        return;
    } else {
        $.ajax({
            url: '/api/newExperienceArticles',
            type: 'POST',
            data: {
                title: $('#inputTitle').val().trim(),
                content: $('#inputArticles').val().trim().replaceAll(/\"/g, `\\"`),
                publish: timeNow
            },
            dataType: 'json',
            success: function (data) {
                if (data[0].ret) {
                    layer.msg(data[0].code);
                    init();
                } else {
                    layer.msg(data[0].code);
                }
            }
        });
    }
}

//删除经验
function deleteExp() {
    if ($('#hideId').text() == '') {
        layer.msg('请选择要删除的经验');
    } else {
        layer.msg('确认要删除吗？', {
            time: 0, //不自动关闭
            btn: ['确定', '再想想'],
            yes: function (index) {
                $.ajax({
                    url: '/api/deleteExperienceArticles',
                    type: 'POST',
                    data: {
                        ids: Number($('#hideId').text())
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            layer.msg(data[0].code);
                            $('#inputTitle').empty();
                            $('#inputArticles').empty();
                            init();
                        } else {
                            layer.msg(data[0].code);
                        }
                    }
                });
            }
        });
    }
}

//更新经验
function updateExp() {
    if ($('#inputTitle').val() == '' && $('#inputArticles').val() == '') {
        layer.msg('请输入标题或者内容');
        return;
    } else {
        layer.msg(`确认要修改${$('#inputTitle').val().trim()}吗？`, {
            time: 0, //不自动关闭
            btn: ['确定', '再想想'],
            yes: function (index) {
                $.ajax({
                    url: '/api/updateExperienceArticles',
                    type: 'POST',
                    data: {
                        ids: Number($('#hideId').text()),
                        title: $('#inputTitle').val().trim(),
                        content: $('#inputArticles').val().trim().replaceAll(/\"/g, `\\"`),
                        publish: timeNow
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                                layer.msg(data[0].code);
                                // 更新新经验后只更新该ID的内容
                                var code = $("#hideId").text();
                                getArticleById(code)
                                init();
                        } else {
                            layer.msg(data[0].code);
                        }
                    }
                });
            }
        });
    }
}

//搜索经验
function searchExp() {
    var searchText = document.getElementById('searchInput').value;
    $.ajax({
        url: '/api/searchExperienceArticles',
        type: 'GET',
        data: {
            title: searchText,
            content: searchText,
        },
        dataType: 'json',
        success: function (data) {
            shareFunc(data);
        },
        error: function (err) {
            console.info(err);
        },
        complete: function () {
            shareFuncTwo();
        }
    });
}

//初始化与搜索共用一个 API One
function shareFunc(_res) {
    $('#verticalBox ul').empty();
    $('#inputTitle').val('');
    $('#inputArticles').val('');
    let parse = JSON.parse(_res[0].code)
    if (parse.length == 0) {
        $('#verticalBox ul').append(`
            <ul>
                <li style="border:none;"><img src="../images/exp-articles-add.svg" width="120"></li>
                <li style="border:none;">这里什么也没有……</li>
            </ul>
        `);
    } else {
        $('#hideId').html(parse[0].id)
        for (var i = 0; i < parse.length; i++) {
            $('#verticalBox ul').append(`<li>
            <button class='accordion' data-code='${parse[i].id}'>💰${parse[i].title}</button></li>
            `);
        }
        getArticleById(parse[0].id)
    }
}

//初始化与搜索共用一个 API Two
function shareFuncTwo() {
    let leftMenu = document.getElementById('verticalBox');
    //切换左侧显示样式
    if (leftMenu.firstChild.nextElementSibling.innerText != '这里什么也没有……') {
        leftMenu.style.display = 'block';
        //点击手风琴切换菜单
        var acc = document.getElementsByClassName("accordion");
        var i;
        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                $('#hideId').text(this.getAttribute('data-code'));
                getArticleById(this.getAttribute('data-code'))
            });
        }
    } else {
        leftMenu.style.display = 'table-cell';
        $('#inputTitle').empty();
        $('#inputArticles').empty();
    }
}

// 通过当前文章ID的内容
function getArticleById(_id) {
    $.ajax({
        url: '/api/getExperienceIdTable',
        type: 'GET',
        data: {
            ids: Number(_id)
        },
        dataType: 'json',
        success: function (data) {
            let parse = JSON.parse(data[0].code)
            $('#inputTitle').val(parse[0].title)
            $('#inputArticles').val(parse[0].content)
        },
        error: function (err) {
            console.log(err);
        }
    });    
}

//备份当页
function exportTxt() {
  var text = document.getElementById("inputArticles").value;
  var filename = document.getElementById("inputTitle").value;
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//预览格式
function markdownToHtml(){
    var index = layer.open({
        title: $('#inputTitle').val(),
        type: 2,
        content: './pages/experience/experience-markdown-read.html?id=' + $('#hideId').text(),
        area: ['1920px', '100vh'],
    })
    layer.full(index);
}