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
    url: ngUrl + "/bill/" + $.cookie("tname") + "/detail",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        headers: headerToken,
        success: function (json) {
            total=json.data.total;
            if(total==0){
                $("#emptyData").show();
            }
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
                        var id=json.data.result[i].detail[j].id;//流水号
                        //var planId=json.data.result[i].detail[j].planId;//流水号
                        var orderId=json.data.result[i].detail[j].orderId;//账单号
                        var tradeAmount=json.data.result[i].detail[j].tradeAmount;//交易总额
                        //var channel=json.data.result[i].detail[j].channel;//渠道
                        var opType=json.data.result[i].detail[j].opType;//类型
                        var tradeUser=json.data.result[i].detail[j].tradeUser;//出入账方
                        var availableAmount=json.data.result[i].detail[j].availableAmount;//可用额度
                        var actualAmount=json.data.result[i].detail[j].actualAmount;//总额度
                        var count_num="";
                        switch(opType){
                            case 1:
                                opType = "充值";
                                tradeAmount=(+tradeAmount);
                                count_num="count_num1";
                                break;
                            case 2:
                                opType = "提现";
                                tradeAmount=(-tradeAmount);
                                count_num="count_num2";
                                break;
                            case 3:
                                opType = "扣年费";
                                tradeAmount=(-tradeAmount);
                                count_num="count_num2";
                                break;
                            case 4:
                                opType = "购买待生效";
                                tradeAmount=(-tradeAmount);
                                count_num="count_num2";
                                break;
                            case 5:
                                opType = "购买生效";
                                tradeAmount=(-tradeAmount);
                                count_num="count_num2";
                                break;
                            case 6:
                                opType = "购买失效";
                                tradeAmount=(-tradeAmount);
                                count_num="count_num2";
                                break;
                            case 7:
                                opType = "购买后退款";
                                tradeAmount=(+tradeAmount);
                                count_num="count_num1";
                                break;
                            case 8:
                                opType = "售出交易成功";
                                tradeAmount=(+tradeAmount);
                                count_num="count_num1";
                                break;
                            case 9:
                                opType = "售出交易生效";
                                tradeAmount=(+tradeAmount);
                                count_num="count_num1";
                                break;
                            case 10 :
                                opType = "售出退款";
                                tradeAmount=(-tradeAmount);
                                count_num="count_num2";
                                break;
                        }
                        var str=opTime;
                        opTime=str.substr(str.length-9);

                        $table_main.append("" +
                            "<tr class='table_content'>" +
                            "<td>" + opTime + "</td>" +
                            "<td>" + id + "</td>" +
                            "<td>" + orderId + "</td>" +
                            "<td class="+count_num+">" + tradeAmount + "</td>" +
                            "<td>" + opType + "</td>" +
                            "<td>" + tradeUser + "</td>" +
                            "<td>" + availableAmount + "</td>" +
                            "<td>" + actualAmount + "</td>" +
                            "</tr>");
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
        url: ngUrl + "/bill/" + $.cookie("tname") + "/detail" + "?page=" + next_pages + "&size=8",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        headers: headerToken,
        success: function (json) {
            total = json.data.total;
            if (total == 0) {
                $("#emptyData").show();
            }
            len = json.data.result.length;
            for (var i = 0; i < len; i++) {
                var date = json.data.result[i].date;

                $table_main = $(".table_main");
                $table_main.append("" +
                    "<tr class='Record_time_title'>" +
                    "<td>" + date + "</td>" +
                    "</tr>");
                var detail_len = json.data.result[i].detail.length;
                for (var j = 0; j < detail_len; j++) {
                    var opTime = json.data.result[i].detail[j].opTime;//时间
                    var id = json.data.result[i].detail[j].id;//流水号
                    //var planId=json.data.result[i].detail[j].planId;//流水号
                    var orderId = json.data.result[i].detail[j].orderId;//账单号
                    var tradeAmount = json.data.result[i].detail[j].tradeAmount;//交易总额
                    //var channel=json.data.result[i].detail[j].channel;//渠道
                    var opType = json.data.result[i].detail[j].opType;//类型
                    var tradeUser = json.data.result[i].detail[j].tradeUser;//出入账方
                    var availableAmount = json.data.result[i].detail[j].availableAmount;//可用额度
                    var actualAmount = json.data.result[i].detail[j].actualAmount;//总额度
                    var count_num="";
                    switch(opType){
                        case 1:
                            opType = "充值";
                            tradeAmount=(+tradeAmount);
                            count_num="count_num1";
                            break;
                        case 2:
                            opType = "提现";
                            tradeAmount=(-tradeAmount);
                            count_num="count_num2";
                            break;
                        case 3:
                            opType = "扣年费";
                            tradeAmount=(-tradeAmount);
                            count_num="count_num2";
                            break;
                        case 4:
                            opType = "购买待生效";
                            tradeAmount=(-tradeAmount);
                            count_num="count_num2";
                            break;
                        case 5:
                            opType = "购买生效";
                            tradeAmount=(-tradeAmount);
                            count_num="count_num2";
                            break;
                        case 6:
                            opType = "购买失效";
                            tradeAmount=(-tradeAmount);
                            count_num="count_num2";
                            break;
                        case 7:
                            opType = "购买后退款";
                            tradeAmount=(+tradeAmount);
                            count_num="count_num1";
                            break;
                        case 8:
                            opType = "售出交易成功";
                            tradeAmount=(+tradeAmount);
                            count_num="count_num1";
                            break;
                        case 9:
                            opType = "售出交易生效";
                            tradeAmount=(+tradeAmount);
                            count_num="count_num1";
                            break;
                        case 10 :
                            opType = "售出退款";
                            tradeAmount=(-tradeAmount);
                            count_num="count_num2";
                            break;
                    }
                    var str=opTime;
                    opTime=str.substr(str.length-9);


                    $table_main.append("" +
                        "<tr class='table_content'>" +
                        "<td>" + opTime + "</td>" +
                        "<td>" + id + "</td>" +
                        "<td>" + orderId + "</td>" +
                        "<td class="+count_num+">" + tradeAmount + "</td>" +
                        "<td>" + opType + "</td>" +
                        "<td>" + tradeUser + "</td>" +
                        "<td>" + availableAmount + "</td>" +
                        "<td>" + actualAmount + "</td>" +
                        "</tr>");
                }
            }
        }
    });

}








