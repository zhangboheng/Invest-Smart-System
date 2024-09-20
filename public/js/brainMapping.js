var _jm = null;
$(function () {
    openBrainMapping();
    getBrainList()
});
// 获取思维导图文档列表
function getBrainList() {
    $('#verticalBox ul').empty();
    $.ajax({
        url: '/api/getBrainMap',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                let parse = JSON.parse(data[0].code)
                if (parse.length == 0) {
                    $('#verticalBox ul').append(`
                        <ul>
                            <li style="border:none;"><img src="../images/exp-articles-add.svg" width="120"></li>
                            <li style="border:none;">这里什么也没有……</li>
                        </ul>
                    `);
                    $('#verticalBox').css({
                        "vertical-align": "middle"
                    })
                } else {
                    for (var i = 0; i < parse.length; i++) {
                        $('#verticalBox ul').append(`<li>
                        <button class='accordion' data-code='${parse[i].id
                            }' onclick="getIdsMap(${parse[i].id
                            })">${parse[i].title
                            }</button></li>`);
                    }
                    $('#verticalBox').css({
                        "vertical-align": "inherit"
                    });
                    getIdsMap(parse[0].id);
                }

            }
        },
        error: function (err) {
            layer.msg(err);
        }
    });
}
// 思维导图文档保存和编辑到列表
function saveMap() {
    let mind_data = _jm.get_data();
    let mind_string = jsMind.util.json.json2string(mind_data);
    if($('#hideIds').text() != ""){
        $.ajax({
            url: '/api/updateBrainMap',
            type: 'POST',
            data: {
                ids: $('#hideIds').text(),
                title: JSON.parse(mind_string).data.topic,
                content: mind_string
            },
            dataType: 'json',
            success: function (data) {
                layer.msg('更新成功');
                getBrainList();
            },
            error: function (err) {
                console.info(err);
                layer.msg('更新失败')
            }
        });       
    }else{
        $.ajax({
            url: '/api/newBrainMap',
            type: 'POST',
            data: {
                title: JSON.parse(mind_string).data.topic,
                content: mind_string
            },
            dataType: 'json',
            success: function (data) {
                layer.msg('保存成功');
                getBrainList();
            },
            error: function (err) {
                layer.msg('保存失败');
            }
        });
    }
}
// 根据 ID 获取思维导图
function getIdsMap(_num){
    $('#hideIds').text(_num)
    $.ajax({
        url: '/api/getBrainMapId',
        type: 'GET',
        data: {
            ids: _num,
        },
        dataType: 'json',
        success: function (data) {
            if(data[0].ret){
                let title = JSON.parse(data[0].code)[0].title
                let parse = JSON.parse(data[0].code)[0].content
                openBrainMapping(title, JSON.parse(parse).data.children)
            }
        },
        error: function (err) {
            console.info(err);
        }
    });    
}
// 加载思维导图
function openBrainMapping(_title = "思维导图", _children = []) {
    $('#brainmapping').empty();
    let mind;
    mind = {
        meta: {
            name: 'Brain Mapping',
            author: 'Zhang Boheng',
            version: '0.0.2'
        },
        format: 'node_tree',
        data: {
            id: 'root',
            topic: _title,
            children: _children
        }
    };
    var options = {
        container: 'brainmapping',
        mode: 'full',
        editable: true,
        support_html: true,
        theme: 'wisteria',
        view: {
            engine: 'svg', // 思维导图各节点之间线条的绘制引擎
            line_width: 2, // 思维导图线条的粗细
            line_color: '#555', // 思维导图线条的颜色
            draggable: false, // 当容器不能完全容纳思维导图时，是否允许拖动画布代替鼠标滚动
            hide_scrollbars_when_draggable: false // 当设置 draggable = true 时，是否隐藏滚动条
        },
        layout: {
            hspace: 20, // 节点之间的水平间距
            vspace: 20, // 节点之间的垂直间距
            pspace: 10 // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
        }
    };
    _jm = jsMind.show(options, mind);
}
// 删除思维导图
function delMap(){
    if ($('#hideIds').text() == '') {
        layer.msg('请选择要删除的思维导图');
    } else {
        layer.msg('确认要删除吗？', {
            time: 0, //不自动关闭
            btn: ['确定', '再想想'],
            yes: function (index) {
                $.ajax({
                    url: '/api/deleteBrainMap',
                    type: 'POST',
                    data: {
                        ids: Number($('#hideIds').text())
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            layer.msg(data[0].code);
                            getBrainList();
                            downToEmpty();
                        } else {
                            layer.msg(data[0].code);
                        }
                    }
                });
            }
        });
    }
}
//搜索思维导图
function searchMap() {
    layer.prompt({
        time: 0,
    }, function (val, index, elem) {
        $('#verticalBox ul').empty();
        $.ajax({
            url: '/api/searchBrainMap',
            type: 'GET',
            data: {
                title: elem[0].value,
                content: elem[0].value,
            },
            dataType: 'json',
            success: function (data) {
                if (data[0].ret) {
                    let parse = JSON.parse(data[0].code)
                    if (parse.length == 0) {
                        $('#verticalBox ul').append(`
                            <ul>
                                <li style="border:none;"><img src="../images/exp-articles-add.svg" width="120"></li>
                                <li style="border:none;">这里什么也没有……</li>
                            </ul>
                        `);
                        $('#verticalBox').css({
                            "vertical-align": "middle"
                        })
                    } else {
                        for (var i = 0; i < parse.length; i++) {
                            $('#verticalBox ul').append(`<li>
                            <button class='accordion' data-code='${parse[i].id
                                }' onclick="getIdsMap(${parse[i].id
                                })">${parse[i].title
                                }</button></li>`);
                        }
                        $('#verticalBox').css({
                            "vertical-align": "inherit"
                        });
                        getIdsMap(parse[0].id);
                    }
                }
            },
        });
        layer.close(index);
    });
}
// 思维导图下载
function screenShot() {
    _jm.screenshot.shootDownload();
}
// 思维导图备份
function fileExport() {
    var mind_data = _jm.get_data();
    var mind_name = mind_data.meta.name;
    var mind_str = jsMind.util.json.json2string(mind_data);
    jsMind.util.file.save(mind_str, 'text/jsmind', mind_name + '.jm');
}
// 思维导图导入
document.getElementById('fileInput').addEventListener('change', function () {
    var files = this.files;
    if (files.length > 0) {
        var file_data = files[0];
        jsMind.util.file.read(file_data, function (jsmind_data, jsmind_name) {
            var mind = jsMind.util.json.string2json(jsmind_data);
            if (!!mind) {
                _jm.show(mind);
            } else {
                layer.msg('该文件无法打开，请更换');
            }
        });
    } else {
        layer.msg('请先选择一个文件');
    }
});
// 按键说明
function shortCuts() {
    let arr = [
        {
            id: 'mouse',
            topic: '鼠标操作',
            direction: 'left',
            children: [
                {
                    id: 'mouse1',
                    topic: '单击:选择节点'
                }, {
                    id: 'mouse2',
                    topic: '双击:进入编辑模式，回车保存'
                }, {
                    id: 'mouse3',
                    topic: '拖动:摆放节点'
                }, {
                    id: 'mouse4',
                    topic: '点小圆圈:展开/缩放子节点'
                },
            ]
        }, {
            id: 'keyboard',
            topic: '键盘操作',
            direction: 'right',
            children: [
                {
                    id: 'keyboard1',
                    topic: 'Enter:添加同级节点'
                },
                {
                    id: 'keyboard2',
                    topic: 'Ctrl+Enter:添加下级节点'
                },
                {
                    id: 'keyboard3',
                    topic: 'F2:进入编辑模式，回车保存'
                },
                {
                    id: 'keyboard4',
                    topic: 'Delete:删除节点'
                }, {
                    id: 'keyboard5',
                    topic: 'Space:展开/收缩子节点'
                }, {
                    id: 'keyboard6',
                    topic: '快捷键能改也能加'
                },
            ]
        }
    ];
    openBrainMapping("按键说明", arr)
    _jm.disable_edit();
    downToEmpty();
}
// 点击目录切换菜单
function toggleNav() {
    $('#mySidepanel').toggle();
}
// 隐藏 ID 归零
function downToEmpty(){
    $('#hideIds').text('')
}