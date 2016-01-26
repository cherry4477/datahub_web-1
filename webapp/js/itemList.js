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
    window.page_index=0;
    pages();
    getnextpage(window.page_index);

    select_item();

    del_item();
});

function pages(){
    $(".pages").pagination(window.len,{
        maxentries:window.len,
        items_per_page:6,
        num_display_entries:3,
        num_edge_entries:3,
        link_to:"javascript:void(0)",
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        callback:getnextpage,
        load_first_page:false

    })
}
function getnextpage(page_index){
    $("#sel_item .table_content").empty();
    window.page_index=page_index+1;

    getitemlist();
}

function getitemlist(){
    $("#list_title").text(repoName);
    $.ajax({
        url: ngUrl + "/repositories/" + repoName+"?items=1&page="+page_index+"&size=6",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        success: function (json) {
            window.len=json.data.items;
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
                            case "public":itemaccesstype="公共"; break;
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
                            "<span class='item_name'>"+item_Arr[i]+"</span>" +
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
    $("input:checkbox").removeAttr("checked");

    $("#sel_item>input").bind("click",function(){
       var check_stats=$("input[name=list_check]:checkbox").prop("checked");
       if(check_stats){
           $("input[name=list_check]:checkbox").removeAttr("checked");
       } else{
           $("input[name=list_check]:checkbox").prop("checked","true");
       }
    });
/*    $("#sel_item .del_bg").bind("click",function(){
        $(".table_content").empty();

    });*/
}
function del_item(){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }


    $("#sel_item .del_bg").on("click",function(){
        var check_stats1=$("input[name=list_check]:checkbox").prop("checked");
        var stats=0;
        if(check_stats1==true||check_stats1=="true"){
            $("input[name=list_check]:checked").each(function(){
                var item=$(this).siblings(".item_name").text();

                $.ajax({
                    url: ngUrl + "/repositories/" + repoName + "/" + item,
                    type: "DELETE",
                    cache: false,
                    async: false,
                    headers:headerToken,
                    dataType: 'json',
                    success: function () {
                        var refer=confirm("您确定要删除所有item？");
                        if(refer){
                            $(".table_content").empty();
                            stats=1;
                        }
                    }
                })
            })
        }else{
            alert("未选中任何item");
        }
        if(stats==1){
            alert("删除成功");
        }
    });
}