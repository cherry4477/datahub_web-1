/**
 * Created by Max cheng on 2016/1/23.
 */
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}
$(document).ready(function(){
    window.repoName = getParam("repname");
    getitemlist();
    getnextpage(0);

    select_item();

    del_item();
});





function getitemlist(){
    var url="myPublish.html";
    $("#list_title a").text(repoName).attr("href",url);
    var len=0;
    $.ajax({
        url: ngUrl + "/repositories/" + repoName+"?items=1&size=6",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (json) {
            len=json.data.items;
            var item_Arr=json.data.dataitems;
            var $table_content=$(".table_content");
            for(var i=0;i<len;i++){
                $.ajax({
                    url: ngUrl + "/repositories/" + repoName + "/" + item_Arr[i],
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        var cooperatestate=json.data.cooperatestate;//协作状态
                        var pricestate=json.data.pricestate;//价格状态
                        var optime=json.data.optime;//时间
                        var itemaccesstype=json.data.itemaccesstype;//访问权限
                        var tags=json.data.tags;//tags量

                        var cooperat_style="";
                        var cooperat_sheet="";
                        var price_sheet="";
                        var price_style="";

                        var time_arr=new Array();
                        time_arr=optime.split("|");

                        switch(itemaccesstype){
                            case "private":itemaccesstype="私有"; break;
                            case "public":itemaccesstype="开放"; break;
                        }

                        if(cooperatestate=="协作")
                        {
                            cooperat_style="免费";
                            cooperat_sheet ="mianfei_sheet";
                        }
                        else if(pricestate=="协作中")
                        {
                            price_style="协作中";
                            cooperat_sheet ="mianfei_sheet";
                        }else{
                            cooperat_sheet="wu_sheet";
                        }


                        if(pricestate=="免费")
                        {
                            price_style="免费";
                            price_sheet ="mianfei_sheet";
                        }
                        else if(pricestate=="限量免费")
                        {
                            price_style="限量免费";
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
                        $table_content.append("" +
                            "<tr class='item_con_line'>"+
                            "<td><input type='checkbox' class='item_check' name='list_check'>" +
                            '<span class="item_name"><a href="myItemDetails.html?repname='+repoName+'&itemname='+item_Arr[i]+'" target="_blank">'+item_Arr[i]+'</a></span>'+
                            "<span class="+cooperat_sheet+">"+cooperat_style+"</span>"+
                            "<span class="+price_sheet+">"+price_style+"</span>"+
                            "</td>"+
                            "<td>"+time_arr[1]+"</td>"+
                            "<td>"+itemaccesstype+"</td>"+
                            "<td>"+tags+"</td>"+
                            "</tr>");
                    }
                });
            }
        }
    });
    $(".pages").pagination(len,{
        maxentries:len,
        items_per_page:6,
        num_display_entries:3,
        num_edge_entries:3,
        link_to:"javascript:void(0)",
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        callback:getnextpage,
        load_first_page:false

    });
}
function getnextpage(nextpages){
    $(".table_content tbody").empty();
    nextpages=nextpages+1;
    $.ajax({
        url: ngUrl + "/repositories/" + repoName+"?items=1&page="+nextpages+"&size=6",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (json) {
            len=json.data.items;
            var item_Arr=json.data.dataitems;
            var $table_content=$(".table_content");
            for(var i=0;i<len;i++){
                $.ajax({
                    url: ngUrl + "/repositories/" + repoName + "/" + item_Arr[i],
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: 'json',
                    success: function (json) {
                        var cooperatestate=json.data.cooperatestate;//协作状态
                        var pricestate=json.data.pricestate;//价格状态
                        var optime=json.data.optime;//时间
                        var itemaccesstype=json.data.itemaccesstype;//访问权限
                        var tags=json.data.tags;//tags量

                        var cooperat_style="";
                        var cooperat_sheet="";
                        var price_sheet="";
                        var price_style="";

                        var time_arr=new Array();
                        time_arr=optime.split("|");

                        switch(itemaccesstype){
                            case "private":itemaccesstype="私有"; break;
                            case "public":itemaccesstype="开放"; break;
                        }

                        if(cooperatestate=="协作")
                        {
                            cooperat_style="免费";
                            cooperat_sheet ="mianfei_sheet";
                        }
                        else if(pricestate=="协作中")
                        {
                            price_style="协作中";
                            cooperat_sheet ="mianfei_sheet";
                        }else{
                            cooperat_sheet="wu_sheet";
                        }


                        if(pricestate=="免费")
                        {
                            price_style="免费";
                            price_sheet ="mianfei_sheet";
                        }
                        else if(pricestate=="限量免费")
                        {
                            price_style="限量免费";
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

                        $table_content.append("" +
                            "<tr class='item_con_line'>"+
                            "<td><input type='checkbox' class='item_check' name='list_check'>" +
                            '<span class="item_name"><a href="myItemDetails.html?repname='+repoName+'&itemname='+item_Arr[i]+'" target="_blank">'+item_Arr[i]+'</a></span>' +
                            "<span class="+cooperat_sheet+">"+cooperat_style+"</span>"+
                            "<span class="+price_sheet+">"+price_style+"</span>"+
                            "</td>"+
                            "<td>"+time_arr[1]+"</td>"+
                            "<td>"+itemaccesstype+"</td>"+
                            "<td>"+tags+"</td>"+
                            "</tr>");
                    }
                });
            }
        }
    });
}

function select_item(){
    $("#all_select").removeAttr("checked");
        $("#sel_item>input").bind("click",function(){
            var check_stats=$(this).prop("checked");
            if(check_stats){
                $("input[name=list_check]:checkbox").each(function(){
                    $(this).prop("checked","true");
                })
            }else{
                $("input[name=list_check]:checkbox").each(function(){
                    $(this).removeAttr("checked");
                })
            }

        });
}
function del_item(){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $("#sel_item .del_bg").on("click",function(){
        var stats=0;
       var check_stats1=false;
        var numsubs=0;
        $("input[name=list_check]:checked").each(function(){
             check_stats1=true;
            if(check_stats1==true){
                var item=$(this).siblings(".item_name").text();
                //GET /subscription_stat/:repname/:itemname?phase={phase}
                $.ajax({
                    url: ngUrl + "/subscription_stat/" + repoName + "/" + item,
                    type: "DELETE",
                    cache: false,
                    async: false,
                    headers:headerToken,
                    dataType: 'json',
                    success: function (json) {
                        numsubs=json.data.numsubs;
                       console.log(json.data.numsubs);
                    }
                });

                if(numsubs>0){
                    var refer=confirm(item+"处于订购中，"+"确定要删除？");
                    if(refer){
                        $.ajax({
                            url: ngUrl + "/repositories/" + repoName + "/" + item,
                            type: "DELETE",
                            cache: false,
                            async: false,
                            headers:headerToken,
                            dataType: 'json',
                            success: function () {
                                $(".table_content").empty();
                                stats=1;
                            }
                        });
                    }
                }else{
                    $.ajax({
                        url: ngUrl + "/repositories/" + repoName + "/" + item,
                        type: "DELETE",
                        cache: false,
                        async: false,
                        headers:headerToken,
                        dataType: 'json',
                        success: function () {
                            $(".table_content").empty();
                            stats=1;
                        }
                    });
                }

            }
        });
        if(check_stats1==false){
            {
                alert("未选中任何item");
            }
        }
        if(stats==1){
            alert("删除成功");
            getitemlist();
        }
    });
}