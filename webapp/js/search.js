/**
 * Created by Administrator on 2015/12/4.
 */
var rtext='';
var itemid = /\?.*rtext=([^&]*).*$/;
if (itemid.test(decodeURIComponent(window.location.href))) {
    rtext = itemid.exec(decodeURIComponent(window.location.href))[1];
}

var data={};
if(rtext!=""){
    data={"text":rtext};
}


$(window).load(function(){
    $(".be-loader").fadeOut("slow");
});

var repos=[];
var totals=0;
$(window).load(function(){
    $(".be-loader").fadeOut("slow");
});
var headerToken={};
//登陆后
if($.cookie("token")!=null&&$.cookie("token")!="null"){
    headerToken={Authorization:"Token "+$.cookie("token")};
}
$(document).ready(function(){

    getrepname(1);
    ajaxRe();
    $(".pages").pagination(totals, {
        items_per_page: 10,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
//	      num_edge_entries:1,
        link_to:"javascript:void(0)",
        callback:fenS,
        load_first_page:false
    });
});

function rel(str){
    var s="";
    if(str.toLowerCase().indexOf(rtext.toLowerCase())!=-1){
        var start=str.toLowerCase().indexOf(rtext.toLowerCase());
        var end=start+rtext.length;
        var strtext=str.substring(start,end);
        s=str.replace(strtext, "<span style=background-color:#fffe8f;>"+strtext+"</span>");
    }else{
        s=str;
    }
    return s;
}

function getrepname(pages) {
    $.ajax({
        url: ngUrl+"/search?size=10&page="+pages,
        type: "get",
        cache:false,
        data:data,
        async:false,
        headers:headerToken,
        dataType:'json',
        success:function(json){
            if(json.data.length!=0){
                var pages=json.data.results.length;
                totals=json.data.total;
                $("#ttnum").text(totals);
                for(var i=0;i<pages;i++){
                    repos.push([json.data.results[i].repname,json.data.results[i].itemname]);
                }
            }else{
                console.log("报错");
            }
        }
    });
}





function fenS(new_page_index, pagination_container){

    $("#terminal-content-body").empty();
    repos=[];
    getrepname(new_page_index+1);
    ajaxRe();

}



function ajaxRe(){


    //返回该DataItem的订阅量
    var dataitemd = [];
    for(var i= 0;i<repos.length;i++) {
        $.ajax({
            url: ngUrl + "/subscription_stat/" +repos[i][0],
            cache: false,
            async: false,
            headers:headerToken,
            success: function (msg) {
                dataitemd.push(msg.data.numsubs);
            }
        });
    }
    //返回该DataItem的pull量
    var dataitemdpullNum = [];
    for(var i= 0;i<repos.length;i++) {
        $.ajax({
            url: ngUrl + "/transaction_stat/" +repos[i][0]+repos[i][1],
            cache: false,
            async: false,
            headers:headerToken,
            success: function (msg) {
                dataitemdpullNum.push(msg.data.numpulls);
            }
        });
    }

    //返回该DataItem的star量
    var dataitemdstarNum = [];
    for(var i= 0;i<repos.length;i++) {
        $.ajax({
            url: ngUrl + "/star_stat/" +repos[i][0]+repos[i][1],
            cache: false,
            headers:headerToken,
            async: false,
            success: function (msg) {
                dataitemdstarNum.push(msg.data.numstars);
            }
        });
    }

    if(repos.length!=0){

        for(var i=0;i<repos.length;i++){
            $.ajax({
                url: ngUrl+"/repositories/"+repos[i][0]+"/"+repos[i][1]+"?abstract=1",
                type: "get",
                cache:false,
                async:false,
                data:data,
                dataType:'json',
                headers:headerToken,
                success:function(json){
                    $("#loading").empty();
                    var vvclass="";
                    var label=json.data.label.sys.supply_style;
                    var labelV="";
                    if(label=="single"||label=="api"){
                        vvclass="api";
                        //labelV="实时单条";
                        labelV="API";
                    }
                    if(label=="batch"){
                        vvclass="period";
                        labelV="批量数据";
                    }
                    if(label=="flow"){
                        vvclass="flot-data";
                        labelV="流式数据";
                    }

                    var times=json.data.optime;
                    var jdTime=times.substring(10, times.indexOf("|"));
                    var xdTime="";
                    var showTime="";
                    var nums=times.indexOf("|");
                    if(nums!="-1"){
                        showTime=times.substring(times.indexOf("|")+1,times.length);
                    }else{
                        showTime=times.substring(0, times.indexOf("."));
                    }

                    var realname="";
                    //该用户昵称
                    $.ajax({
                        url: ngUrl+"/users/"+json.data.create_user,
                        type: "get",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                                realname=json.data.userName;
                            }else {
                                console.log("报错");
                            }
                        }
                    });
                    if(json.data.label != null && json.data.label != ''){
                        var ptags = json.data.label.owner;
                        var labelstr = '';
                        for(var j in ptags) {
                            labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                        }
                    }
                    var thispricestate = '';
                    if(json.data.pricestate != ''){
                        thispricestate = '<p>'+json.data.pricestate+'</p>';
                    }
                    $("#terminal-content-body").append(""+
                        '<div class="repo">'+
                        '<div class="left">'+
                        '<div class="subtitle">'+
                        '<a target="_blank" href="itemDetails.html?repname='+repos[i][0]+'&itemname='+repos[i][1]+'">'+rel(repos[i][0])+'/'+rel(repos[i][1])+'</a>'+
                        '</div>'+
                        '<div class="description"><p>'+rel(json.data.comment)+'</p></div>'+
                        '<div class="subline">'+
                        '<div class="lable"><p class="'+vvclass+'">'+labelV+'</p>'+labelstr+'</div>'+
                        '<div class="icon">'+
                        '<img  datapalecement="top" data-toggle="tooltip" src="images/newpic004.png" class="iconiamg1" data-original-title="更新时间">'+
                        '<span  datapalecement="top" data-toggle="tooltip" data-original-title="'+jdTime+'">'+showTime+'</span>'+
                        '<img  datapalecement="top" data-toggle="tooltip" src="images/newpic005.png" class="iconiamg1" data-original-title="tag量">'+
                        '<span>'+json.data.tags+'</span>'+
                        '</div>'+
                        '</div>'+
                        '<div class="supplier"><p> 本数据由 <a href="dataOfDetails.html?username='+json.data.create_user+'">'+realname+'</a> 提供</p></div>'+
                        '</div>'+
                        '<div class="right">'+
                        '<div class="price">'+thispricestate+'</div>'+
                        '<div class="iconGroup">'+
                        '<div class="like">'+
                        '<img title="" datapalecement="top" data-toggle="tooltip" src="images/newpic001.png" style="" data-original-title="点赞量"><span>'+dataitemdstarNum[i]+'</span>'+
                        '</div>'+
                        '<div class="cart"><img title="" datapalecement="top" data-toggle="tooltip" src="images/newpic002.png" style="" data-original-title="订购量"><span>'+dataitemd[i]+'</span></div>'+
                        '<div class="download"><img title="" datapalecement="top" data-toggle="tooltip" src="images/newpic003.png" style="" data-original-title="下载量"><span>'+dataitemdpullNum[i]+'</span></div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'
                    );
                }
            });
        }
    }else{
        $("#loading").empty();
        $("#terminal-content-body").append("<div class='repo-body'><p class='text-center'>暂无搜索相关数据</p></div>");
    }


}
