

var fromDivWidth = $('.fromLoginDiv').width();
var footDivWidth = $('.foot').width();
if ((footDivWidth - fromDivWidth) / 2 > 0) {
    $('.fromLoginDiv').css('margin-left', (footDivWidth - fromDivWidth) / 2);
}
$('.accountsLogin a').click(function(){
    $('.foot').empty();
    $('.foot').load('login/loginSecond.html');
});
$('.loginBtnDiv a').click(function(){
    $('.foot').empty();
    $('.foot').load('login/loginFrist.html');
});
$('.registerUser').click(function(){
    $('.foot').load('register/registerFrist.html');
});
$('.loginBtnDiv a img').mouseout(function(){
    this.src='../img/fanhui_53.png';

});
$('.loginBtnDiv a img').mouseover(function(){
    this.src='../img/fanhui-xz.png';
});
$('.loginBtnDiv button').click(function(){
    location.href='index.html';
});