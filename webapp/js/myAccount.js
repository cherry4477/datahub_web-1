/**
 * Created by Max cheng on 2016/1/21.
 */
$(document).ready(function(){
    $("#recharge_btn").click(function(){
        $(".window").css("display","block");
    });
    $(document).bind("click", function (e) {
        if ((e.target.className.indexOf("window")<0 && e.target.id != "recharge_btn")) {
            $(".window").css("display","none");
        }
    });
    $("#reflect_btn").click(function(){
        $(".window1").css("display","block");
    });
    $(document).bind("click", function (e) {
        if ((e.target.className.indexOf("window1")<0 && e.target.id != "reflect_btn")) {
            $(".window1").css("display","none");
        }
    });


    account();
    accountDetailes();
});

function  account(){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $.ajax({
        url: ngUrl + "/bill/" + $.cookie("tname") + "/info",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        headers: headerToken,
        success: function (json) {
           var actualBalance= json.data.actualBalance;//余额
           var availableBalance=json.data.availableBalance;//可用余额
           var creditLimit=json.data.creditLimit;//信用额度
            $("#total_balance_span").text(actualBalance);
            $("#usable_balance_span").text(availableBalance);
            $("#cash_balance_span").text(availableBalance);
        }
    })
}
function  accountDetailes(){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var total=0;
    $.ajax({
        //GET /bill/:loginname/detail
    url: ngUrl + "/bill/" + $.cookie("tname") + "/detail",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        headers: headerToken,
        success: function (json) {
            total=json.data.total;
            len=json.data.result.length;
            for(var i=0;i<len;i++){
                var date=json.data.result[i].date;

                $table_main=$(".table_main");
                $table_main.append("" +
                    "<tr class='Record_time_title'>"+
                    "<td>"+date+"</td>"+
                    "</tr>");
                var detail_len=json.data.result[i].detail.length;
                    for(var j=0;j<detail_len;j++){
                        var opTime=json.data.result[i].detail[j].opTime;//时间
                        var planId=json.data.result[i].detail[j].planId;//流水号
                        var orderId=json.data.result[i].detail[j].orderId;//账单号
                        var tradeAmount=json.data.result[i].detail[j].tradeAmount;//交易总额
                        var channel=json.data.result[i].detail[j].channel;//类型
                        var tradeUser=json.data.result[i].detail[j].tradeUser;//出入账方
                        var availableAmount=json.data.result[i].detail[j].availableAmount;//可用额度
                        var actualAmount=json.data.result[i].detail[j].actualAmount;//总额度
                        $table_main.append("" +
                            "<tr class='table_content'>"+
                            "<td>"+opTime+"</td>"+
                            "<td>"+planId+"</td>"+
                            "<td>"+orderId+"</td>"+
                            "<td class='count_num"+i+"'>"+tradeAmount+"</td>"+
                            "<td>"+channel+"</td>"+
                            "<td>"+tradeUser+"</td>"+
                            "<td>"+availableAmount+"</td>"+
                            "<td>"+actualAmount+"</td>"+
                            "</tr>");

                        if(tradeAmount<0){
                            $('#accountRecord .table_content .count_num'+i+'').css("color","#d68d00");
                        }else{
                            $('#accountRecord .table_content .count_num'+i+'').css("color","#00a162");
                        }
                    }
            }

        }
    });
    $(".accountPages").pagination(total,{
        maxentries:total,
        items_per_page: 8,
        num_display_entries: 3,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:gonextpage,
        load_first_page:false
    });
}
function gonextpage(next_pages){
    $(".table_main tbody").empty();
    next_pages+=1;
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $.ajax({
        url: ngUrl + "/bill/" + $.cookie("tname") + "/detail"+"?page="+next_pages+"&size=8",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        headers: headerToken,
        success: function (json) {
            len=json.data.result.length;
            for(var i=0;i<len;i++){
                var date=json.data.result[i].date;

                $table_main=$(".table_main");
                $table_main.append("" +
                    "<tr class='Record_time_title'>"+
                    "<td>"+date+"</td>"+
                    "</tr>");
                var detail_len=json.data.result[i].detail.length;
                for(var j=0;j<detail_len;j++){
                    var opTime=json.data.result[i].detail[j].opTime;//时间
                    var planId=json.data.result[i].detail[j].planId;//流水号
                    var orderId=json.data.result[i].detail[j].orderId;//账单号
                    var tradeAmount=json.data.result[i].detail[j].tradeAmount;//交易总额
                    var channel=json.data.result[i].detail[j].channel;//类型
                    var tradeUser=json.data.result[i].detail[j].tradeUser;//出入账方
                    var availableAmount=json.data.result[i].detail[j].availableAmount;//可用额度
                    var actualAmount=json.data.result[i].detail[j].actualAmount;//总额度
                    $table_main.append("" +
                        "<tr class='table_content'>"+
                        "<td>"+opTime+"</td>"+
                        "<td>"+planId+"</td>"+
                        "<td>"+orderId+"</td>"+
                        "<td class='count_num"+i+"'>"+tradeAmount+"</td>"+
                        "<td>"+channel+"</td>"+
                        "<td>"+tradeUser+"</td>"+
                        "<td>"+availableAmount+"</td>"+
                        "<td>"+actualAmount+"</td>"+
                        "</tr>");

                    if(tradeAmount<0){
                        $('#accountRecord .table_content .count_num'+i+'').css("color","#d68d00");
                    }else{
                        $('#accountRecord .table_content .count_num'+i+'').css("color","#00a162");
                    }
                }
            }

        }
    });

}








