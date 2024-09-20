const proxyArr = ['https://cors.luckydesigner.workers.dev/?'];
var countResq = 0; // 请求失败次数计数器
var countStep = 0; // 政府公告翻页技术命名字段
var selectCrewNewsArr = []; // 新闻采摘
var selectAnnouncementArr = []; // 政府公告
var newsAll = []

$(function () {
    getGlobalNews('');
    getAnnouncementNews('');
});

// 添加新闻采集源规则
var addRules = document.getElementById("btnRules");
addRules.addEventListener("click", function () {
    var index = layer.open({
        title: '添加新闻采集规则',
        type: 2,
        content: './pages/news/news-rules.html',
        area: ['1920px', '100vh']
    })
    layer.full(index);
});

// 刷新股票页面
$('#btnSearch').on('click', function () {
    window.location.href = '/globalnews';
});

// 搜索政府公告关键词
var searchKeys = document.getElementById("searchAnnouncementBtn");
searchKeys.addEventListener('click', function () {
    $('#newsAnnouncement ul').empty();
    let keywords = $('#nameAnnouncement').val();
    getAnnouncementNews(keywords);
});
// 搜索收藏信息关键词
var searchFavorKeys = document.getElementById("searchBtnTwo");
searchFavorKeys.addEventListener('click', function () {
    let keywords = $('#searchName').val();
    getFavorGlobalNews('/api/searchFavorNewsTable', keywords);
});

// 获取新闻列表
function getGlobalNews(_keys = '', _catalogue = 0) {
    var text = '';
    newsAll = [];
    $("#areaId").html(_catalogue)
    layer.load();
    $.ajax({
        url: '/api/globalNewsData',
        type: 'GET',
        data: {
            yesfilter: _keys,
            catalogue: _catalogue
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            $('#newsContent ul').empty();
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#newsTotal').html('新闻总数：0');
                    $('#newsContent ul').append(`
                        <li><span>没有相关内容</span></li>
        `);
                    getGlobalNews('', _catalogue);
                } else {
                    $('#newsTotal').html('新闻总数：' + param.length);
                    for (let i = 0; i < param.length; i++) {
                        newsAll.push({"标题": param[i].title.trim(), "链接": param[i].url})
                        $('#newsContent ul').append(`
                    <li><input type="checkbox" id="${i}" data-url="${
                            param[i].url
                        }" data-title="${
                            param[i].title.replace(/\"/g, '')
                        }"/><span onclick="DialogFullScreen('${
                            param[i].url
                        }')">${
                            param[i].title
                        }</span></li>
                `);
                    }
                }
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，正在重新加载');
            layer.closeAll('loading');
            if (countResq < 5) {
                getGlobalNews('', _catalogue);
                countResq++
            } else {
                $('#newsContent ul').append(`
                    <li><span>请检查规则配置</span></li>
        `);
            }
        },
        complete: function (res) {
            $('#newsContent input[type=checkbox]').on('click', function () {
                let _url = $(this).attr('data-url');
                let _title = $(this).attr('data-title');
                if ($(this)[0].checked) {
                    selectCrewNewsArr.push({title: _title, url: _url});
                } else {
                    selectCrewNewsArr = selectCrewNewsArr.filter(x => x.title != _title);
                }
                $('#hideNewsId').text(JSON.stringify(selectCrewNewsArr));
            });
        }
    })
}
// 搜索信息采集关键词
var searchKeys = document.getElementById("searchBtn");
searchKeys.addEventListener('click', function () {
    let keywords = $('#nameItem').val();
    const endwords = keywords.toUpperCase();
    const parentUl = document.getElementById("newsContent");
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

// 添加新闻采集条目到数据库
$('#btnAdd').on('click', function () {
    if ($('#hideNewsId').html().length == 0) {
        layer.msg('请至少选择一项');
    } else {
        sendFavorArticles(JSON.parse($('#hideNewsId').html()), getNowTime());
        $('#newsContent input[type=checkbox]').prop('checked', false);
        $('#hideNewsId').empty();
        getGlobalNews('', $('#areaId').html());
    }
});

// 获取政府公告列表
function getAnnouncementNews(_keys = '', _step = 1) {
    var text = '';
    layer.load();
    $.ajax({
        url: '/api/globalAnnouncementData',
        type: 'GET',
        data: {
            keyword: _keys,
            page: _step
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#announcementTotal').html('新闻总数：0');
                    $('#newsAnnouncement ul').append(`
                        <li><span>没有相关内容</span></li>
                `);
                } else {
                    $('#announcementTotal').html('新闻总数：' + param.length);
                    for (let i = 0; i < param.length; i++) {
                        $('#newsAnnouncement ul').append(`
                            <li><input type="checkbox" id="${i}" data-url="${
                            param[i].url
                        }" data-title="${
                            param[i].title.replace(/\"/g, '')
                        }"/><span onclick="DialogFullScreen('${
                            param[i].url
                        }')">${
                            param[i].title
                        }</span></li>
                        `);
                    }
                }
            }
        },
        error: function (err) {
            layer.msg('服务出现故障，正在重新加载');
            layer.closeAll('loading');
            getAnnouncementNews('');
        },
        complete: function (res) {
            $('#newsAnnouncement input[type=checkbox]').on('click', function () {
                let _url = $(this).attr('data-url');
                let _title = $(this).attr('data-title');
                if ($(this)[0].checked) {
                    selectAnnouncementArr.push({title: _title, url: _url});
                    text += _title + ',';
                } else {
                    selectAnnouncementArr = selectAnnouncementArr.filter(x => x.title != _title);
                    text = text.replace(_title + ',', '');
                }
                $('#hideAnnouncementId').text(text);
            });
            $('#btnAnnouncementAdd').on('click', function () {
                if ($('#hideAnnouncementId').text().length == 0) {
                    layer.msg('请至少选择一项');
                } else {
                    sendFavorArticles(selectAnnouncementArr, getNowTime());
                    $('#newsAnnouncement input[type=checkbox]').prop('checked', false);
                    selectAnnouncementArr = [];
                    $('#hideAnnouncementId').text('');
                }
            });
        }
    })
}

// 获取收藏新闻列表
function getFavorGlobalNews(_url = '/api/getNewsFavor', _keys = '') {
    var text = '';
    layer.load();
    $.ajax({
        url: _url,
        type: 'GET',
        data: {
            keys: _keys
        },
        datatype: 'json',
        success: function (data) {
            layer.closeAll('loading');
            $('#newsFavor ul').empty();
            if (data[0].ret) {
                let param = JSON.parse(data[0].code);
                if (param.length == 0) {
                    $('#newsFavorTotal').html('新闻总数：0');
                    $('#newsFavor ul').append(`
                        <li><span>没有相关内容</span></li>
                `);
                } else {
                    $('#newsFavorTotal').html('新闻总数：' + param.length);
                    for (let i = 0; i < param.length; i++) {
                        $('#newsFavor ul').append(`
                            <li><input type="checkbox" id="${
                            param[i].id
                        }" /><span onclick="DialogFullScreen('${
                            param[i].url
                        }')">${
                            param[i].title
                        }</span></li>
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
            $('#newsFavor input[type=checkbox]').on('click', function () {
                if ($(this)[0].checked) {
                    text += $(this)[0].id + ',';
                } else {
                    text = text.replace($(this)[0].id + ',',
                    '');
                }
                $('#newsFavorId').text(text);
            });
        }
    });
}

// 删除收藏消息条目
$('#btnDelete').on('click', function () {
    let _id = $('#newsFavorId').text();
    if (_id.length == 0) {
        layer.msg('请至少选择一项');
    } else {
        delFavorArticles(_id.slice(0, -1));
        $('#newsFavor input[type=checkbox]').prop('checked', false);
        $('#newsFavorId').empty();
    }
});

// 选择弹出全面屏弹窗
function DialogFullScreen(_url) {
    window.open(_url, '_blank');
}

$('#newsAnnouncement ul').on('scroll', function () {
    let keyword = $('#nameAnnouncement').val();
    let scrollHeight = $(this).scrollTop();
    let divHeight = $(this)[0].scrollHeight;
    let thisHeight = $(this).innerHeight();
    let position = divHeight - scrollHeight - thisHeight;
    if (position == 0 && countStep <= 70 && keyword == '') {
        countStep++;
        getAnnouncementNews('', countStep);
    }
});

// 添加收藏到数据库
function sendFavorArticles(_arr, _time) {
    let _titles = _arr.map(x => x.title).join('_|_');
    let _urls = _arr.map(x => x.url).join('_|_');
    $.ajax({
        url: '/api/globalNewsFavors',
        type: 'POST',
        data: {
            titles: _titles,
            urls: _urls,
            time: _time
        },
        datatype: 'json',
        success: function (data) {
            if (data[0].ret) {
                DialogMessageTop(0, `${
                    data[0].code
                }`, 3);
                selectCrewNewsArr = [];
                selectAnnouncementArr = [];
                layer.closeAll();
            } else {
                DialogMessage(0, `${
                    data[0].code
                }`, 4);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 从收藏文章中删除
function delFavorArticles(_arr) {
    $.ajax({
        url: '/api/deleteNewsFavor',
        type: 'POST',
        data: {
            ids: _arr
        },
        datatype: 'json',
        success: function (data) {
            if (data[0].ret) {
                DialogMessageTop(0, `${
                    data[0].code
                }`, 3);
                layer.closeAll();
                getFavorGlobalNews();
            } else {
                DialogMessage(0, `${
                    data[0].code
                }`, 4);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

// 添加关键词黑名单
var addKeywords = document.getElementById("btnBlack");
addKeywords.addEventListener("click", function () {
    customAddPage('addKeywords', '添加关键词黑名单', './pages/news/news-word-filter.html', '/api/postBlackListWords');
});

// 添加关键词黑名单
function customAddPage(_id, _title, _content, _url) {
    layer.open({
        id: _id, // 设定一个id，防止重复弹出
        type: 2,
        title: _title,
        area: [
            '400px', '330px'
        ],
        shade: 0,
        maxmin: false,
        skin: 'btnAddLayui',
        content: _content,
        btn: [
            '确定', '取消'
        ],
        yes: function (index, layero) {
            var getName = layero.find('iframe').contents().find('#blackList');
            $.ajax({
                url: _url,
                type: 'POST',
                data: {
                    title: getName[0].value
                },
                dataType: 'json',
                success: function (data) {
                    if (data[0].ret) {
                        DialogMessageTop(0, `${
                            data[0].code
                        }`, 3);
                        getGlobalNews('', $("#areaId").html());
                        layer.closeAll();
                    } else {
                        DialogMessage(0, `${
                            data[0].code
                        }`, 4);
                    }
                }
            });
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

// 滚动后变灰条目效果
$('#newsContent ul').on('scroll', function() {
  let nearestLi;
  let nearestDistance = Infinity;
  $('li').each(function() {
    let distance = Math.abs($(this).offset().top - $(window).scrollTop() - 100);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestLi = $(this);
    }
  });
  if (nearestLi) {
    nearestLi.css('color', '#666');
  }
});

// 点击导出新闻
var exportExcel = document.getElementById("exportExcel");
exportExcel.addEventListener("click", function () {
    const headers = Object.keys(newsAll[0]);
    let csv = headers.join(",") + "\n";
    newsAll.forEach(row => {
        let values = headers.map(header => row[header]);
        csv += values.join(",") + "\n";
    });
    const blob = new Blob([csv], {type: "text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "新闻备份.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// 弹出词云
var wordCloud = document.getElementById("wordCloud");
wordCloud.addEventListener('click', function () {
    var index = layer.open({
        title: '词云显示',
        type: 2,
        content: './pages/news/global-news-cloud.html',
        area: ['1920px', '100vh']
    })
    layer.full(index);
});
