/**
 * Created by hsf on 2016/5/19.
 */
'use strict';

$('#neirong1 ul li').mouseout(function () {
    $(this).css('background-color', '#2e3d5c');
    $(this).css('color', '#fff');
    var imgSrc = $(this).find('img').attr('src');
    $(this).find('img').attr('src', imgSrc.substr(0, imgSrc.lastIndexOf('_')) + '.png');
});
$('#neirong1 ul li').mouseover(function () {
    $(this).css('background-color', '#cce5ec');
    $(this).css('color', 'black');
    var imgSrc = $(this).find('img').attr('src');
    $(this).find('img').attr('src', imgSrc.substr(0, imgSrc.lastIndexOf('.')) + '_xz.png');
});
$('#zhong2 table tr td').mouseout(function () {
    var imgSrc = $(this).find('img').attr('src');
    if(imgSrc){
        if (imgSrc.indexOf('_') != imgSrc.lastIndexOf('_')) {
            $(this).find('img').attr('src', imgSrc.substr(0, imgSrc.lastIndexOf('_')) + '.png');
        }
    }
});
$('#zhong2 table tr td').mouseover(function () {
    var imgSrc = $(this).find('img').attr('src');
    if(imgSrc){
        if (imgSrc.indexOf('_') == imgSrc.lastIndexOf('_')) {
            $(this).find('img').attr('src', imgSrc.substr(0, imgSrc.lastIndexOf('.')) + '_xz.png');
        }
    }
});
function lmmover(leftname){
    // $("#"+leftname).css('background-color','#cce5ec');
    // $("#"+leftname).css('color', 'black');   

}

function lmmout(menuname){
//     $("#"+menuname).css('background-color', '#2e3d5c');
//     $("#"+menuname).css('color', '#fff');
 }

function leftmenuclick(menuname){
    $("#"+menuname).css({'background-color':'#cce5ec','color':'black'}).siblings().css({'background-color':'#2e3d5c','color':'#fff'});
    if (menuname=="leftli_cs_1"){
        getframe("/createAsset/list");
    }
    if (menuname=="leftli_cs_2"){
        getframe("createassetaudit");
    }
    if (menuname=="leftli_cs_3"){
        getframe("createassetfail");
    }
    //我的账号
    if (menuname=="leftli_zh_1"){
        getleftmenu("zccs")
        getframe("/createAsset/list");

    }
    if (menuname=="leftli_zh_2"){
        getleftmenu("zcdj")
        getframe("/registerAsset/list");
    }
    if (menuname=="leftli_zh_3"){
        getleftmenu("zckr");
        getframe("/expansionAsset/list");
    }
    if (menuname=="leftli_zh_4"){
        getleftmenu("zczy");
        getframe("/transferAsset/list");
    }
    if (menuname=="leftli_zh_5"){
        getleftmenu("jysc");
        getframe("/market/list");
    }
    //登记
    if (menuname=="leftli_dj_1"){
        getframe("/registerAsset/list");
    }

    //扩容
    if (menuname=="leftli_kr_1"){
        getframe("/expansionAsset/list");
    }
    if (menuname=="leftli_kr_2"){
        getframe("addassetaudit");
    }
    if (menuname=="leftli_kr_3"){
        getframe("addassetfail");
    }
    //转移
    if (menuname=="leftli_zy_1"){
        getframe("/transferAsset/list");
    }
    //交易
    if (menuname=="leftli_jy_1"){
        getframe("/market/sell");
    }
    if (menuname=="leftli_jy_2"){
        getframe("/market/buy");
    }
    if (menuname=="leftli_jy_3"){
        getframe("/market/proxy");
    }
    if (menuname=="leftli_jy_4"){
        getframe("/market/list");
    }

}



function wh() {
    var windowHeight = $(window).height();
    var touHeight = $('#tou').height();
    var zhongHeight = $('#zhong').height();
    var zhong1Width = $('#zhong1').width();
    $('#neirong1').width(zhong1Width);
    var neirong4Height = $('.neirong4').height();
    if ((neirong4Height > windowHeight - touHeight - zhongHeight)) {
        $('#neirong1').height(neirong4Height);
        $('#neirong2').height(neirong4Height);
        $('#neirong3').height(neirong4Height);
    } else {
        if (windowHeight - touHeight - zhongHeight < 680) {
            $('#neirong1').height(680);
            $('#neirong2').height(680);
            $('#neirong3').height(680);
        } else {
            $('#neirong1').height(windowHeight - touHeight - zhongHeight);
            $('#neirong2').height(windowHeight - touHeight - zhongHeight);
            $('#neirong3').height(windowHeight - touHeight - zhongHeight);
        }
    }
    var neirong4Width = $('.neirong4').width();
    $('.xinxi1').css('margin-left', (neirong4Width - 753) / 2);
    $('.xinxi2').css('margin-left', (neirong4Width - 753) / 2 + 10);
    $('.xinxi3').css('margin-left', (neirong4Width - 753) / 2 + 20);
};
window.onload = function () {
    window.onresize = wh;
    wh();
};

function get(url,id){
    $(function(){
        $.ajax({
            //居中显示center
            url:"/account",
            dataType:"html",
            type:"get",
            success:function(data){
                $("#mainContent").html(data);
                $("#mainContent").css({"height":"818px"});
                //动态加载数据
                /*$.ajax({
                 url:"",
                 type:"post",
                 dataType:"json",
                 success:function(data){
                 //
                 //
                 }
                 });*/
            }
        });
    });
}
function  getframe(url){
    $('#iframepage').attr('src',url);
    $('#iframepage').show();
}
function setleftmeun(menu){
    $('.leftmenu').empty();
    $('.leftmenu').html(menu);
}
$(function(){
    getleftmenu("wdzh");
    getframe('account');
});
function getleftmenu(funname){
    if (funname=="zccs"){
        var leftmenu="<ul>";
        leftmenu+="<li id=\'leftli_cs_1\' onclick=\'leftmenuclick(\"leftli_cs_1\")\'  onmouseover=\'lmmover(\"leftli_cs_1\")\' onmouseout=\'lmmout(\"leftli_cs_1\")\'>资产创设记录</li> ";
        //leftmenu+="<li id=\'leftli_cs_2\' onclick=\'leftmenuclick(\"leftli_cs_2\")\'  onmouseover=\'lmmover(\"leftli_cs_2\")\' onmouseout=\'lmmout(\"leftli_cs_2\")\'>审核成功</li> ";
        leftmenu+="<li id=\'leftli_cs_3\' onclick=\'leftmenuclick(\"leftli_cs_3\")\'  onmouseover=\'lmmover(\"leftli_cs_3\")\' onmouseout=\'lmmout(\"leftli_cs_3\")\'>审核失败</li>";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }
    if (funname=="wdzh"){
        var userInfotype  = $('#userInfotype').text();
        var leftmenu="<ul>";
        if(userInfotype=="enterprise"){
            leftmenu+="<li id=\'leftli_zh_1\' onclick=\'leftmenuclick(\"leftli_zh_1\")\'  onmouseover=\'lmmover(\"leftli_zh_1\")\' onmouseout=\'lmmout(\"leftli_zh_1\")\' ><img src=\"img/csjl.png\">资产创设记录</li> ";
            leftmenu+="<li id=\'leftli_zh_2\' onclick=\'leftmenuclick(\"leftli_zh_2\")\'  onmouseover=\'lmmover(\"leftli_zh_2\")\' onmouseout=\'lmmout(\"leftli_zh_2\")\'><img src=\"img/zcdj.png\">资产登记记录</li> ";
            leftmenu+="<li id=\'leftli_zh_3\' onclick=\'leftmenuclick(\"leftli_zh_3\")\'  onmouseover=\'lmmover(\"leftli_zh_3\")\' onmouseout=\'lmmout(\"leftli_zh_3\")\'><img src=\"img/krjl.png\">资产扩容记录</li>";
        }
        leftmenu+="<li id=\'leftli_zh_4\' onclick=\'leftmenuclick(\"leftli_zh_4\")\'  onmouseover=\'lmmover(\"leftli_zh_4\")\' onmouseout=\'lmmout(\"leftli_zh_4\")\'><img src=\"img/yjl.png\">资产转移记录</li>";
        leftmenu+="<li id=\'leftli_zh_5\' onclick=\'leftmenuclick(\"leftli_zh_5\")\'  onmouseover=\'lmmover(\"leftli_zh_5\")\' onmouseout=\'lmmout(\"leftli_zh_5\")\'><img src=\"img/jyjl.png\">资产交易记录</li>";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }
    if (funname=="zcdj"){
        var leftmenu="<ul>";
        leftmenu+="<li id=\'leftli_dj_1\' onclick=\'leftmenuclick(\"leftli_dj_1\")\'  onmouseover=\'lmmover(\"leftli_dj_1\")\' onmouseout=\'lmmout(\"leftli_dj_1\")\'>资产登记记录</li> ";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }

    if(funname=="zckr"){
        var leftmenu="<ul>";
        leftmenu+="<li id=\'leftli_kr_1\' onclick=\'leftmenuclick(\"leftli_kr_1\")\'  onmouseover=\'lmmover(\"leftli_kr_1\")\' onmouseout=\'lmmout(\"leftli_kr_1\")\'>资产扩容记录</li> ";
        //leftmenu+="<li id=\'leftli_kr_2\' onclick=\'leftmenuclick(\"leftli_kr_2\")\'  onmouseover=\'lmmover(\"leftli_kr_2\")\' onmouseout=\'lmmout(\"leftli_kr_2\")\'>审核成功</li> ";
        leftmenu+="<li id=\'leftli_kr_3\' onclick=\'leftmenuclick(\"leftli_kr_3\")\'  onmouseover=\'lmmover(\"leftli_kr_3\")\' onmouseout=\'lmmout(\"leftli_kr_3\")\'>审核失败</li>";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }
    if (funname=="zczy"){
        var leftmenu="<ul>";
        leftmenu+="<li id=\'leftli_zy_1\' onclick=\'leftmenuclick(\"leftli_zy_1\")\'  onmouseover=\'lmmover(\"leftli_zy_1\")\' onmouseout=\'lmmout(\"leftli_zy_1\")\' >资产转移记录</li> ";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }
    if (funname=="jysc"){
        var leftmenu="<ul>";
        leftmenu+="<li id=\'leftli_jy_1\' onclick=\'leftmenuclick(\"leftli_jy_1\")\'  onmouseover=\'lmmover(\"leftli_jy_1\")\' onmouseout=\'lmmout(\"leftli_jy_1\")\'>卖出资产</li> ";
        leftmenu+="<li id=\'leftli_jy_2\' onclick=\'leftmenuclick(\"leftli_jy_2\")\'  onmouseover=\'lmmover(\"leftli_jy_2\")\' onmouseout=\'lmmout(\"leftli_jy_2\")\'>买入资产</li> ";
        leftmenu+="<li id=\'leftli_jy_3\' onclick=\'leftmenuclick(\"leftli_jy_3\")\'  onmouseover=\'lmmover(\"leftli_jy_3\")\' onmouseout=\'lmmout(\"leftli_jy_3\")\'>我的委托</li>";
        leftmenu+="<li id=\'leftli_jy_4\' onclick=\'leftmenuclick(\"leftli_jy_4\")\'  onmouseover=\'lmmover(\"leftli_jy_4\")\' onmouseout=\'lmmout(\"leftli_jy_4\")\'>成交记录</li>";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }
    if (funname=="gqcx"){
        var leftmenu="<ul>";
        setleftmeun(leftmenu);
    }
    if (funname=="xgxx"){
        var leftmenu="<ul>";
        leftmenu+="<li >修改资料</li> ";
        leftmenu+="</ul>";
        setleftmeun(leftmenu);
    }
}

$('#zccs').click(function(){
    getleftmenu("zccs");
    getframe('/createAsset/index');
});


$('.wdzh').click(function () {
    getleftmenu("wdzh");
    getframe('/account/index');
});

$('#zcdj').click(function () {
    getleftmenu("zcdj");
    getframe('/registerAsset/index');

});
$('#zckr').click(function () {
    getleftmenu("zckr");
    getframe('/expansionAsset/index');
});
$('#zczy').click(function () {
    getleftmenu("zczy");
    getframe('/transferAsset/index');
});
$('#jysc').click(function () {
    getleftmenu("jysc");
    getframe('/market/index');
});

$('#gqcx').click(function () {
    getleftmenu('gqcx')
    getframe('/stockQuery/index');
});
$('#xgxx').click(function () {
    getleftmenu('xgxx')
    getframe('modifyinformation');
});

