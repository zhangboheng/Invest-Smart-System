var backHomeBtn = document.getElementById('backHome');
var loginOutBtn = document.getElementById('loginOut');

backHomeBtn.addEventListener('click', function () {
    window.location.href = '/';
});

loginOutBtn.addEventListener('click', function () {
    window.location.href = '/logout';
});

//通用时间
function getNowTime(){
    var year = new Date().getFullYear();
    var month = new Date().getMonth();
    var dates = new Date().getDate();
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    return year + '-' + String(month + 1).padStart(2,'0') + '-' + String(dates).padStart(2,'0') + ' ' + hours + ':' + String(minutes).padStart(2,0)
}


//标签切换开始
try{
    document.getElementById("defaultOpen").click();  
}catch(e){
    
}
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}  
//标签切换结束