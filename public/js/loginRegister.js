/**
 * Created by peersafe on 2016/5/19.
 */
'use strict';
function welcomeImgMarginLeft() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var topHeight = $('.top').height();
    var welcomeImgWidth = $('.welcomeImg').width();
    var logoImgWidth = $('.logoImg').width();
    if (windowWidth < 1021) {
        $('.welcomeImg').css('margin-left', 0);
    } else {
        $('.welcomeImg').css('margin-left', (windowWidth - welcomeImgWidth) / 2 - logoImgWidth);
    }
    if (windowHeight < 681) {
        $('.foot').height(681);
    } else {
        $('.foot').height(windowHeight - topHeight);
    }
    if($('.foot').text().trim()==''){
        $('.foot').load('login/loginFrist.html');
    }
    if($('.fromLoginDiv').length>0){
        var fromDivWidth = $('.fromLoginDiv').width();
        var footDivWidth = $('.foot').width();
        if ((footDivWidth - fromDivWidth) / 2 > 0) {
            $('.fromLoginDiv').css('margin-left', (footDivWidth - fromDivWidth) / 2);
        }
    }
    if($('.fromRegisterDiv').length>0){
        var fromRegisterDivWidth = $('.fromRegisterDiv').width();
        var footDivWidth = $('.foot').width();
        if ((footDivWidth - fromRegisterDivWidth) / 2 > 0) {
            $('.fromRegisterDiv').css('margin-left', (footDivWidth - fromRegisterDivWidth) / 2);
        }
    }
    if($('.registerSuccess').length>0){
        var registerSuccessDivWidth = $('.registerSuccess').width();
        var footDivWidth = $('.foot').width();
        if ((footDivWidth - registerSuccessDivWidth) / 2 > 0) {
            $('.registerSuccess').css('margin-left', (footDivWidth - registerSuccessDivWidth) / 2);
        }
    }
};
window.onload = function () {
    window.onresize = welcomeImgMarginLeft;
    welcomeImgMarginLeft();
};