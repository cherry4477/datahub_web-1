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
    $("#navigator_ul li").on("mouseover mouseout",function(event){
        var itemname=$(this).text();
        if(itemname=="全部精选"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_05.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_03.png");
            }
        }

        if (itemname=="终端专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_30.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_29.png");
            }
        }
        if (itemname=="互联网专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_54.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_53.png");
            }
        }

        if (itemname=="征信专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_110.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_109.png");
            }
        }

        if (itemname=="运营商专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_122.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_121.png");
            }
        }

        if (itemname=="工商专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_114.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_113.png");
            }
        }

        if (itemname=="银联专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_92.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_91.png");
            }
        }

        if (itemname=="地图专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_96.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_95.png");
            }
        }

        if (itemname=="位置专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_118.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_117.png");
            }
        }

        if (itemname=="北京公共专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_125.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_126.png");
            }
        }

        if (itemname=="上海公共专题"){
            if(event.type == "mouseover"){
                $(this).css("color","#43609f");
                $(this).children().attr("src","images/selects/images_129.png");
            }else if(event.type == "mouseout"){
                $(this).css("color","#29abe2");
                $(this).children().attr("src","images/selects/images_130.png");
            }
        }
    });
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
            for(var i=0; i<labels_length;i++){
                var labelname=json.data[i].labelname;
                //判断label的名称
                var $navigator_ul=$("#navigator_ul");
                if(labelname=="终端专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_29.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="全部精选"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_03.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="互联网专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_53.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="征信专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_109.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="运营商专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_121.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="工商专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_53.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="银联专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_91.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="地图专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_95.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="位置专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_117.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="北京公共专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_126.png'/><span>"+labelname+"</span></li>");
                }
                if(labelname=="上海公共专题"){
                    $navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_130.png'/><span>"+labelname+"</span></li>");
                }

                //$navigator_ul.append("<li id='li"+(i+1)+"'><img style='margin-left:24px;margin-right:20px;margin-top:20px;margin-bottom:20px;' src='images/selects/images_03.png'/><span>"+labelname+"</span></li>");

            }
        },
        error:function(){
        }
    });

}
var lablename={};
$("body").on("click","#navigator_ul li",function(){
    $(".repoAll").empty().append("<div class='container-fluid' id='loading'><p style='float:left;margin-bottom:30px;width:100%;' class='text-center'>正在加载请稍后...</p></div>");
    lablename=$(this).text();
    $(".container .title p").text(lablename);
    appendList2(0);
    pages2();
});
//  加载全部数据
function appendList(pages){
    $(".repoAll").empty();
    pages=pages+1;
    ajaxRe(pages);
    addhtml();
}
//按左侧导航分类发送请求加载数据；
function appendList2(pages){
    $(".repoAll").empty();
    pages=pages+1;
    hanvelables(pages);
    addhtml();
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
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
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
        },
        error:function(json){
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
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
                var showTime="";
                var nums=times.indexOf("|");
                if(nums!="-1"){
                    showTime=times.substring(times.indexOf("|")+1,times.length);
                }else{
                    showTime=times.substring(0, times.indexOf("."));
                }

                var $repo_left_subline_icon=$("<div></div>").addClass("icon").appendTo($repo_left_subline);
                $repo_left_subline_icon.append("" +
                "<img style='margin-right:15px;margin-left:60px' src='images/selects/images_17.png'/>"+
                " <span>"+showTime+"</span>"+
                "<img style='margin-right:15px;margin-left:50px' src='images/selects/images_19.png' data-toggle='tooltip' datapalecement='top' title='Paste'/>"+
                " <span>"+json.data.tags+"</span>");

                var label_style=json.data.label.sys.supply_style;
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

                $repo_left.append("" +
                    "<div class='supplier'>"+
                "<p> 本数据由 <a> "+company_name+"</a> 提供</p></div>");

                var url="dataOfDetails.html?username="+create_user;
                $(".supplier p a").attr("href",url);


                //右边部分
                var price_style="";
                var pricestate=json.data.pricestate;//获取付费状态
                if(pricestate=="免费")
                {
                    price_style="免费";
                }
                else if(pricestate=="限量免费")
                {
                    price_style="限量免费";
                }
                else if(pricestate=="付费")
                {
                    price_style="付费";
                }
                else{
                    price_style="暂无"
                }



                $repo_right.append(""+
                "<div class='price' style='width:180px;margin-top:30px;margin-left:90px;margin-bottom: 29px;float: left;'>"+
                "<p>"+price_style+"</p>"+
               "</div>"+
                "<div class='iconGroup'>"+
                    "<div class='like'>"+
                    "<img style='margin-left: 20px;' src='images/selects/images_39.png'>"+
                    "<span style='margin-left: 20px;'>"+dataitemdstarNum[j]+"</span>"+
                    "</div>"+
                    "<div class='cart'>"+
                    "<img style='margin-left: 20px;'src='images/selects/images_32.png'>"+
                    "<span style='margin-left: 20px;'>"+dataitemd[j]+"</span>"+
                    "</div>"+
                    "<div class='download'>"+
                    "<img style='margin-left: 20px' src='images/selects/images_10.png'>"+
                    "<span style='margin-left: 20px;'>"+dataitemdpullNum[j]+"</span>"+
                    "</div>"+
                    "</div>");
            },
            error: function () {
            }
        });
    }
}