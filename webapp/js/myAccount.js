/**
 * Created by Max cheng on 2016/1/21.
 */
$(document).ready(function(){

    account();
    accountDetailes();
});

function  account(){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $.ajax({
        //bill/:loginname/info
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
    $.ajax({
        //GET /bill/:loginname/detail
    url: ngUrl + "/bill/" + $.cookie("tname") + "/detail",
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        headers: headerToken,
        success: function (json) {
            var len=json.data.length;
            console.log(len);
            for(var i=0;i<len;i++){
                var opTime=json.data[i].opTime;//时间
                var planId=json.data[i].planId;//流水号
                var orderId=json.data[i].orderId;//账单号
                var tradeAmount=json.data[i].tradeAmount;//交易总额
                var channel=json.data[i].channel;//类型
                var tradeUser=json.data[i].tradeUser;//出入账方
                var availableAmount=json.data[i].availableAmount;//可用额度
                var actualAmount=json.data[i].actualAmount;//总额度

                $table_main=$(".table_main");
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
    });
}
