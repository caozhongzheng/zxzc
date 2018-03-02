/**
 * Created by peersafe on 2016/5/18.
 */
'use strict';

var fromRegisterDivWidth = $('.fromRegisterDiv').width();
var footDivWidth = $('.foot').width();
if ((footDivWidth - fromRegisterDivWidth) / 2 > 0) {
    $('.fromRegisterDiv').css('margin-left', (footDivWidth - fromRegisterDivWidth) / 2);
}
$('.company').click(function(){
    $('.companyDiv').show();
    $('.personalDiv').hide();
    $('.company').css('color','#f98068');
    $('.company').css('border-bottom','3px solid #f98068');
    $('.personal').css('color','#2aabd2');
    $('.personal').css('border-bottom','0px');
});
$('.personal').click(function(){
    $('.personalDiv').show();
    $('.companyDiv').hide();
    $('.personal').css('color','#f98068');
    $('.personal').css('border-bottom','3px solid #f98068');
    $('.company').css('color','#2aabd2');
    $('.company').css('border-bottom','0px');
});
$('.registerTitle img').click(function(){
    $('.foot').empty();
    $('.foot').load('login/loginFrist.html');
});
$('.registerTitle img').mouseout(function(){
    this.src='../img/fanhui_53.png';
});
$('.registerTitle img').mouseover(function(){
    this.src='../img/fanhui-xz.png';
});
$('.companyDiv button').click(function(){
    $('.foot').load('register/registerSecond.html');
});
$('.personalDiv button').click(function(){
    $('.foot').load('register/registerSecond.html');
});