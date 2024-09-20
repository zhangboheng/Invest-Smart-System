window.onload = function () {
    const pieces = document.getElementsByTagName('svg');
    for (var i = 0; i < pieces.length; i++) {
        let _piece = pieces[i];
        _piece.onclick = function (t) {
            let param = t.target.parentElement.getAttribute('data-position') ?? t.target.getAttribute('data-position');
            customTable(param, param, '');
        }
    };
    init();
}

//初始化生命数据
function init() {
    $('#area table').empty();
    $('#area table').append(`
    <caption>基本状况</caption>
    <tr>
      <th>名称</th>
      <th>内容</th>
      <th>操作</th>
    </tr>
    <tr>
      <td>预期生命</td>
      <td>100岁</td>
      <td><button>设置</button></td>
    </tr>
    <tr>
      <td>当前生命</td>
      <td>31岁</td>
      <td><button>设置</button></td>
    </tr>
    <tr>
      <td>起床时间</td>
      <td>06:30:00</td>
      <td><button>设置</button></td>
    </tr>
    <tr>
      <td>就寝时间</td>
      <td>23:30:00</td>
      <td><button>设置</button></td>
    </tr>
    <tr>
      <td>体检日期</td>
      <td>2022-12-31</td>
      <td><button>设置</button></td>
    </tr>
    `);
}

function customTable(_name, _read, _settings) {
    $('#area table').empty();
    $('#area table').append(`
    <caption>健康方案</caption>
    <tr>
      <th>部位</th>
      <th>详情</th>
      <th>操作</th>
    </tr>
    <tr>
      <td>${_name}</td>
      <td><button onclick="openRead('${_read}')">查看</button></td>
      <td><button>设置</button></td>
    </tr>
    `);
}

$('#basicBtn').on('click', function () {
    init();
})