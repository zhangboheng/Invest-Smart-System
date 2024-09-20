$(function () {
    layer.load();
    getMenuList();
});
// 刷新系统设置页面
$('#currencyRefresh').on('click', function () {
    window.location.href = '/settings';
});
// 点击搜索获取菜单
$('#searchMenuItem').on('click', function () {
    let key = $('#nameMenuName').val()
    getMenuList('/api/searchMenuList', key);
});
// 点击添加菜单
$('#btnAdd').on('click', function () {
    layer.open({
        id: 'addMenu', // 设定一个id，防止重复弹出
        type: 2,
        title: '添加菜单信息',
        area: ['400px', '330px'],
        shade: 0,
        maxmin: false,
        skin: 'btnAddLayui',
        content: './pages/settings/settings-menu-insert.html',
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            const menuName = layero.find('iframe').contents().find('#nameAdd');
            const engName = layero.find('iframe').contents().find('#englishAdd');
            const linkTarget = layero.find('iframe').contents().find('#linkAdd');
            const imageName = layero.find('iframe').contents().find('#imageAdd');
            const orderId = layero.find('iframe').contents().find('#orderAdd');
            if (menuName[0].value.length == 0) {
                DialogMessage(0, `请填写信息`, 1);
            } else {
                $.ajax({
                    url: '/api/addMenuList',
                    type: 'POST',
                    data: {
                        menuname: menuName[0].value,
                        pathway: engName[0].value,
                        link: linkTarget[0].value,
                        imgurl: imageName[0].value,
                        positionids: orderId[0].value,
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data[0].ret) {
                            DialogMessageTop(0, `${data[0].code}`, 3);
                            layer.closeAll();
                            getMenuList('/api/getMenuList', '');
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
// 获取菜单
function getMenuList(_url = "/api/getMenuList", _name = "") {
    $.ajax({
        url: _url,
        type: 'GET',
        data: {
            menuname: _name
        },
        dataType: 'json',
        success: function (data) {
            layer.closeAll('loading');
            const flowTable = $('#menuList ul');
            flowTable.empty();
            if (data[0].ret) {
                const parse = JSON.parse(data[0].code);
                const flowTableContent = parse.map(item => `<li><div  class="parentBar"><div><span>${
                    String(item.positionids).padStart(2, '0')
                }&nbsp;&nbsp;</span><input type="checkbox" id="${
                    item.id
                }" name="${
                    item.pathway
                }" value="${
                    item.menuname
                }"><label for="${
                    item.pathway
                }">${
                    item.menuname
                }</label></div><div><img src="${
                    item.imgurl
                }"></div><div><input id="childMenu" type="button" value="子项控制" title="子项控制" style="background-color:cadetblue;" /><input id="btnEdit" type="button" value="编辑" title="编辑" style="background-color:darkorange;" /><input id="btnDelete" type="button" value="删除" title="删除" style="background-color:crimson;" onclick="deleteMenuInfo('${item.id}')"/></div></div></li>`).join('');
                flowTable.append(flowTableContent);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
//删除该列菜单信息
function deleteMenuInfo(_id){
    $.ajax({
        url: '/api/deleteMenuList',
        type: 'POST',
        data: {
            ids: _id,
        },
        dataType: 'json',
        success: function (data) {
            if (data[0].ret) {
                DialogMessage(0, `${data[0].code}`, 1);
                getMenuList('/api/getMenuList', '');
            } else {
                DialogMessage(0, `${data[0].code}`, 1);
            }
        }
    });    
}