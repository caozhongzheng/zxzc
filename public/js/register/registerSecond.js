/**
 * Created by peersafe on 2016/5/18.
 */
'use strict';

var registerSuccessDivWidth = $('.registerSuccess').width();
var footDivWidth = $('.foot').width();
if ((footDivWidth - registerSuccessDivWidth) / 2 > 0) {
    $('.registerSuccess').css('margin-left', (footDivWidth - registerSuccessDivWidth) / 2);
}
$('.address').mouseover(function(){
    this.src='../img/yanjing-bh.png';
    $('.addressInput').attr('type','text');
});
$('.address').mouseout(function(){
    this.src='../img/yanjing-zc.png';
    $('.addressInput').attr('type','password');
});
$('.secretKey').mouseover(function(){
    this.src='../img/yanjing-bh.png';
    $('.secretKeyInput').attr('type','text');
});
$('.secretKey').mouseout(function(){
    this.src='../img/yanjing-zc.png';
    $('.secretKeyInput').attr('type','password');
});
$('.registerSuccess button').click(function(){
   $('.foot').load('login/loginThird.html');
});
