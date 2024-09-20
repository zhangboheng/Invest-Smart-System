//普通提示消息
function DialogMessage(_type,_message,_page){
    layer.open({
        type: _type,
        shade: false,
        area: '100px',
        maxmin: false,
        time: 2000,
        content: _message,
        zIndex: layer.zIndex + _page, //重点1
        success: function (layero) {
            layer.setTop(layero); //重点2
        }
    });
}

//顶层提示消息
function DialogMessageTop(_type,_message,_page){
    parent.layer.open({
        type: _type,
        shade: false,
        area: '100px',
        maxmin: false,
        time: 2000,
        content: _message,
        zIndex: layer.zIndex + _page, //重点1
        success: function (layero) {
            layer.setTop(layero); //重点2
        }
    });
}

//选择项弹出层
function DialogSelect(_message){
    layer.msg(_message, {
        time: 0,
        btn: ['确定', '取消'],
        yes: function(){
           return '1';
        }
      });
}