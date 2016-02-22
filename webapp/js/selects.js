function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}
var headerToken={};
//登陆后
if($.cookie("token")!=null&&$.cookie("token")!="null"){
    headerToken={Authorization:"Token "+$.cookie("token")};
}

$(document).ready(function(){
    nav();
    appendList(0);
    pages();

    get_type();
    var labels_len=0;
    var mouseoverindex=0;
    var mouseoutindex=0;
    $("#navigator_ul li").on("mouseover mouseout",function(event){
        if(event.type=="mouseover"){
            mouseoverindex=$(this).index();
            changebg(mouseoverindex);
        }
        if(event.type=="mouseout"){
             mouseoutindex=window.clickindex;
            changebg(mouseoutindex);
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
});

//导航
function nav(){
    $.ajax({
        url: ngUrl+"/select_labels",
        type: "get",
        cache:false,
        async:false,
        dataType:'json',
        success:function(json){
           var labels_length=json.data.length;
            labels_len=labels_length;
            for(var i=0; i<labels_length;i++){
                var labelname=json.data[i].labelname;
                //判断label的名称
                var $navigator_ul=$("#navigator_ul");
                //if(labelname=="终端专题"){
                $navigator_ul.append('<li class="li1'+i+'">'+labelname+'</li>');
            }
        }
    });

}
function changebg(index){
    for(var i=0;i<labels_len;i++){
        var add_class1="li1"+i;
        var add_class2="li0"+i;

        $('#navigator_ul li').eq(i).addClass(add_class1).removeClass(add_class2);
    }

    $('#navigator_ul li').eq(index).addClass('li0'+index).removeClass('li1'+index);
}
var lablename={};

$("body").on("click","#navigator_ul li",function(){
    window.clickindex = $(this).index();
    $(".repoAll").empty().append("<div class='container-fluid' id='loading'><p style='float:left;margin-bottom:30px;width:100%;' class='text-center'>正在加载请稍后...</p></div>");
    lablename=$(this).text();
    $(".container .title p").text(lablename);
    changebg(clickindex);
    appendList2(0);
    pages2();

});
//接收type
function get_type(){
    var lablename2="";
    var type=getParam("type");
    if(type=="全部精选"){
        changebg(0);
        lablename2=$("#navigator_ul li:eq(0)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="终端专题"){
        changebg(1);
        lablename2=$("#navigator_ul li:eq(1)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="互联网专题"){
        changebg(2);
        lablename2=$("#navigator_ul li:eq(2)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="征信专题"){
        changebg(3);
        lablename2=$("#navigator_ul li:eq(3)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="运营商专题"){
        changebg(4);
        lablename2=$("#navigator_ul li:eq(4)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="位置专题"){
        changebg(5);
        lablename2=$("#navigator_ul li:eq(5)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="北京公共专题"){
        changebg(6);
        lablename2=$("#navigator_ul li:eq(6)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="上海公共专题"){
        changebg(7);
        lablename2=$("#navigator_ul li:eq(7)").text();
        $(".container .title p").text(lablename2);
    }
    if(type=="空气质量专题"){
        changebg(8);
        lablename2=$("#navigator_ul li:eq(8)").text();
        $(".container .title p").text(lablename2);
    }
}
//  加载全部数据
function appendList(pages){
    $(".repoAll").empty();
    pages=pages+1;
    ajaxRe(pages);
    addhtml();
    $('[data-toggle="tooltip"]').tooltip();
}
//按左侧导航分类发送请求加载数据；
function appendList2(pages){
    $(".repoAll").empty();
    pages=pages+1;
    hanvelables(pages);
    addhtml();
    $('[data-toggle="tooltip"]').tooltip();
}
//  点击分类按分类发送请求
function hanvelables(pages){
    repos = [];
    var url = '';
    if(lablename == '全部精选'){
        url = ngUrl+"/selects?select_labels"+"&size=5&page="+pages;
    }else{
        url = ngUrl+"/selects?select_labels="+lablename+"&size=5&page="+pages;
    }

    $.ajax({
        url: url,
        type: "get",
        cache:false,
        async:false,
        dataType:'json',
        headers:headerToken,
        success:function(json){
            if(json.data.select.length!=0){
                console.log(json.data.total);
                window.paegeitems2=json.data.total;
                var pages=json.data.select.length;
                for(var i=0;i<pages;i++){
                    repos.push([json.data.select[i].repname,json.data.select[i].itemname]);
                }
            }else{
                window.paegeitems2=0;
            }
        }
    });


}
function pages2(){
    $("#pages").pagination(window.paegeitems2, {
        maxentries:window.paegeitems2,
        items_per_page:5,
        num_display_entries:5,
        num_edge_entries:5,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:appendList2,
        load_first_page:false
    });
}

//刷新获取数据
var paegeitems;
function ajaxRe(pages){
    $(".container .title p").text("全部精选");
    var urlt="";
    repos = [];
    urlt=ngUrl+"/selects?select_labels"+"&size=5&page="+pages;
    $.ajax({
        url: urlt,
        type: "get",
        cache:false,
        async:false,
        dataType:'json',
        headers:headerToken,
        success:function(json){
            if(json.data.select.length!=0){
                var pages=json.data.select.length;
                window.paegeitems = json.data.total;
                for(var i=0;i<pages;i++){
                    repos.push([json.data.select[i].repname,json.data.select[i].itemname]);
                }
            }else{
                console.log("报错");
            }
        }
    });

}
function pages(){
    $("#pages").pagination(window.paegeitems, {
        maxentries:window.paegeitems,
        items_per_page:5,
        num_display_entries:5,
        num_edge_entries: 5,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:appendList,
        load_first_page:false
    });
}

//将ajax封装成对象
function getAjax(url,fun){
    $.ajax({
        type: "get",
        async: false,
        headers:headerToken,
        url: url,
        success: function(msg){
            fun(msg);
        }
    });
}

//编写dom
function addhtml(){
    //返回该DataItem的订阅量
    var dataitemd = [];
    //返回该DataItem的pull量
    var dataitemdpullNum = [];
    //返回该DataItem的star量
    var dataitemdstarNum = [];

    for(var j=0;j<repos.length;j++)
    {
        getAjax(ngUrl + "/subscription_stat/" +repos[j][0],function (msg) {
            dataitemd.push(msg.data.numsubs);
        });
        getAjax(ngUrl + "/transaction_stat/" +repos[j][0]+'/'+repos[j][1],function (msg) {
            dataitemdpullNum.push(msg.data.numpulls);
        });
        getAjax(ngUrl + "/star_stat/" +repos[j][0]+'/'+repos[j][1],function (msg) {
            dataitemdstarNum.push(msg.data.numstars);
        });
        //填充
        direct_url="itemDetails.html?repname="+repos[j][0]+"&itemname="+repos[j][1];
        var $repo=$("<div></div>").addClass("repo").appendTo($(".repoAll"));
        var $repo_left=$("<div></div>").addClass("left").appendTo($repo);
        var $repo_right=$("<div></div>").addClass("right").appendTo($repo);
        $repo_left.append($("<div></div>").addClass("subtitle").append($("<a></a>").text(repos[j][0]+"/"+repos[j][1]).attr("href",direct_url).attr("target","_blank")));



        $.ajax({
            url: ngUrl + "/repositories/" + repos[j][0] + "/" + repos[j][1] + "?abstract=1",
            type: "get",
            cache: false,
            async: false,
            dataType: 'json',
            headers: headerToken,
            success: function (json) {
                $("#loading").remove();
                //item描述
                $repo_left.append($("<div></div>").addClass("description").append($("<p></p>").text(json.data.comment)));
                //lable
                var $repo_left_subline=$("<div></div>").addClass("subline").appendTo($repo_left);
                var $repo_left_subline_lable=$("<div></div>").addClass("lable").appendTo($repo_left_subline);
                //更新时间
                var times=json.data.optime;
                var jdTime=times.substring(0, times.indexOf("."));
                var xdTime="";
                var showtime=new Array();
                showtime=times.split("|");

        /*        var nums=times.indexOf("|");
                if(nums!="-1"){
                    showTime=times.substring(times.indexOf("|")+1,times.length);
                }else{
                    showTime=times.substring(0, times.indexOf("."));
                }*/

                var $repo_left_subline_icon=$("<div></div>").addClass("icon").appendTo($repo_left_subline);
                $repo_left_subline_icon.append("" +
                "<img style='margin-right:15px;margin-left:60px' src='images/selects/images_17.png' data-toggle='tooltip' datapalecement='top' title='更新时间'>"+
                " <span class='showtime'>"+showtime[1]+"</span>"+
                "<img style='margin-right:15px;margin-left:50px' src='images/selects/images_19.png' data-toggle='tooltip' datapalecement='top' title='Tag量'/>"+
                " <span>"+json.data.tags+"</span>");

                var label_style=json.data.label.sys.supply_style;

                $(".subline .icon .showtime").attr({"data-toggle":"tooltip","datapalecement":"top","data-original-title":showtime[0]});
                var labelV="";
                if(label_style=="api"){
                    vvclass="api";
                    labelV="API";
                }
                if(label_style=="batch"){
                    vvclass="period";
                    labelV="批量数据";
                }
                if(label_style=="flow"){
                    vvclass="flot-data";
                    labelV="流式数据";
                }
                var create_user=json.data.create_user;

                getAjax(ngUrl + "/users/" + create_user,function (msg) {
                    window.company_name=msg.data.userName;
                });
                $repo_left_subline_lable.append($("<span></span>").text(labelV));
                var url="dataOfDetails.html?username="+create_user;
                $repo_left.append("" +
                    "<div class='supplier'>"+
                "<p> 本数据由 <a href='"+url+"'> "+company_name+"</a> 提供</p></div>");


                //$(".supplier p a").attr("href",url);



                //右边部分
                var price_style="";
                var price_sheet = '';
                var pricestate=json.data.pricestate;//获取付费状态
                if(pricestate=="免费")
                {
                    price_style="免费";
                    price_sheet ="mianfei_sheet";
                }
                else if(pricestate=="限量试用")
                {
                    price_style="限量试用";
                    price_sheet ="xianliang_sheet";
                }
                else if(pricestate=="付费")
                {
                    price_style="付费";
                    price_sheet ="fufei_sheet";
                }
                else  {
                    price_style="暂无";
                    price_sheet="wu_sheet";
                }



                $repo_right.append(""+
                "<div class='price' style='width:180px;margin-top:30px;margin-left:90px;margin-bottom: 29px;float: left;'>"+
                "<p class='"+price_sheet+"'>"+price_style+"</p>"+
               "</div>"+
                "<div class='iconGroup'>"+
                    "<div class='like'>"+
                    "<img style='margin-left: 20px;' src='../images/selects/like.png' data-toggle='tooltip' datapalecement='top' title='点赞量'>"+
                    "<span style='margin-left: 20px;'>"+dataitemdstarNum[j]+"</span>"+
                    "</div>"+
                    "<div class='cart'>"+
                    "<img style='margin-left: 20px;'src='../images/selects/buy.png' data-toggle='tooltip' datapalecement='top' title='订购量'>"+
                    "<span style='margin-left: 20px;'>"+dataitemd[j]+"</span>"+
                    "</div>"+
                    "<div class='download'>"+
                    "<img style='margin-left: 20px' src='../images/selects/down.png' data-toggle='tooltip' datapalecement='top' title='下载量'>"+
                    "<span style='margin-left: 20px;'>"+dataitemdpullNum[j]+"</span>"+
                    "</div>"+
                    "</div>");
            }
        });
    }
}