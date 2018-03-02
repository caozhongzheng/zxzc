
    var versionWidth = $('.version span').width();
    $('.version hr').width(versionWidth);
    var fromDivWidth = $('.fromLoginDiv').width();
    var footDivWidth = $('.foot').width();
    if ((footDivWidth - fromDivWidth) / 2 > 0) {
        $('.fromLoginDiv').css('margin-left', (footDivWidth - fromDivWidth) / 2);
    }

$('.accountsLogin a').click(function(){
    $('.foot').empty();
    $('.foot').load('login/loginSecond.html');
});
$('.createAccounts button').click(function(){
    $('.foot').empty();
    $('.foot').load('login/loginThird.html');
});
$('.registerUser').click(function(){
    $('.foot').load('register/registerFrist.html');
});