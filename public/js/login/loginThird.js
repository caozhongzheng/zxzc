/**
 * Created by peersafe on 2016/5/18.
 */
'use strict';
var fromDivWidth = $('.fromLoginDiv').width();
var footDivWidth = $('.foot').width();
if ((footDivWidth - fromDivWidth) / 2 > 0) {
    $('.fromLoginDiv').css('margin-left', (footDivWidth - fromDivWidth) / 2);
}
$('.pswLoginDiv button').click(function(){
    location.href='index.html';
});