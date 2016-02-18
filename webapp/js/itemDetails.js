/**
 * Created by Administrator on 2015/12/28.
 */
var login="";
$(function(){
    var tagNum="";
    var create_user="";
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    //item标题
    var url ="repDetails.html?repname="+repoName;
    //var titleName=(repoName+"/"+itemName);
    $("#titleName .reponame").text(repoName);
    $("#titleName .itemname").text(itemName);

    $("#titleName .reponame").parent().attr("href",url);

    $(".slideTxtBox").slide({trigger:"click"});
    yes_no_login();//判断是否登录
    gonextpage(0);//请求tag数据
    request();//请求tag数据

    star();//点赞
    starred2();

    itemName_pull();//itemName_pull量
    numsubs();//itemName_订购量
    about_item();//关于item

    company();//repo提供者

    switchover();//切换
    tablesheet();//表格样式

    closewrap();//关闭弹窗s

    //hot();//the hottest items 
    
});
$(document).ready(function(){
    $("#LT_left_icon .alert_login p a").click(function() {
        $(".modal-open").css("padding-right","15px");
        $('#myModal').modal('toggle');
    });
    $('[data-toggle="tooltip"]').tooltip();

    var item=$("#titleName .itemname").text();
    if(item.length>45){
        var subitem=item.substring(0,42)+"...";
        $("#titleName .itemname").text(subitem);
    }
    var repo=$("#titleName .reponame").text();
    if(repo.length>45){
        var subrepo=repo.substring(0,45);
        $("#titleName .itemname").text(subrepo);
    }
});


//获取reponame,itemname
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}
//判断是否注册
function yes_no_login(){
        if($.cookie("token")!=null&&$.cookie("token")!="null") {
            login="true";
            $(".content .content1_pullNumber span").css("display","inline-block");
        }
        else
        {
            login="false";
            $(".content .content1_pullNumber span").css("display","none");
        }
}

//分页
function request(){
    $(".left_content_page").pagination(tagNum, {
        maxentries:tagNum,
        items_per_page: 30,
        num_display_entries: 5,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:gonextpage,
        load_first_page:false
    });
}
//请求每一页的数据
function gonextpage(nextpages){
    var repoName = getParam("repname");
    var itemName = getParam("itemname");
    var nextpages = nextpages + 1;
    $("#left_content .left_content_con").empty();
    yes_no_login();
    var headerToken={};

        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }

        //tag信息
        $.ajax({
            url: ngUrl + "/repositories/" + repoName + "/" + itemName + "?page=" + nextpages+"&size=30",
            type: "GET",
            cache: false,
            async: false,
            headers:headerToken,
            dataType: 'json',
            success: function (json) {

                if (json.code == 0) {
                    tagNum = json.data.tags;
                    $("#nav1 > sup > span").text(tagNum);
                    var list_length = json.data.taglist.length;
                    var taglist = json.data.taglist;
                    for (var i = 0; i < list_length; i++) {
                        var tag_tag = taglist[i].tag;
                        var tag_comment = taglist[i].comment;
                        var tag_time = taglist[i].optime;
                        var arry=new Array();
                        arry=tag_time.split("|");


                        var $left_content = $("#left_content .left_content_con");
                        var $content = $("<div></div>").addClass("content").appendTo($left_content);
                        var $content1_title = $("<div></div>").addClass("content1_title").appendTo($content);
                        $content1_title.append($("<p></p>").text(tag_tag));
                        $content1_title.append($("<p></p>").text(tag_comment));

                        var $content1_time = $("<div></div>").addClass("content1_time").appendTo($content);
                        $content1_time.append("<span></span>");
                        $content1_time.append($("<span>2分钟以前</span>").text(arry[1]).attr({"data-toggle":"tooltip","datapalecement":"top","title":arry[0]}));

                        var $content1_pullNumber = $("<div></div>").addClass("content1_pullNumber").appendTo($content);

                        var $content1_copy = $("<div></div>").addClass("content1_copy").appendTo($content);
                        var $content1_copy_div = $content1_copy.append("<div></div>");
                        $content1_copy_div.append($("<input type='text'>").attr("value", repoName+"/"+ itemName+":"+ tag_tag).attr("id", "input_copy" + i).attr("readonly","readonly"));
                        var clipbtn = $("<button>复制</button>").attr("data-clipboard-action", "copy").attr("data-clipboard-target", "#input_copy" + i);
                        //复制功能
                        var clipboard = new Clipboard(clipbtn.get(0));
                        clipboard.on('success', function (e) {
                            alert("复制成功!");
                        });
                        clipboard.on('error', function (e) {
                            alert("暂不支持此浏览器,请手动复制或更换浏览器!");
                        });
                        //复制功能结束
                        $content1_copy_div.append(clipbtn);

                        var content1_download = $("<div></div>").addClass("content1_download").appendTo($content);
                        content1_download.append("<span></span>");
                        //获取tag的pull量
                        var numMyPulls=0;
                        $.ajax({
                            url: ngUrl + "/transaction_stat/" + repoName + "/" + itemName + "/" + tag_tag,
                            type: "GET",
                            cache: false,
                            async: false,
                            dataType: 'json',
                            headers:headerToken,
                            success: function (json) {
                                if (json.code == 0) {
                                    //$(".content1_pullNumber span:nth-child(2)").text("pull:" + json.data.nummypulls);
                                    numMyPulls=json.data.nummypulls;
                                    content1_download.append("<p>"+json.data.numpulls+"</p>");
                                }
                            }
                        });
                        if(login=="true"){
                            $content1_pullNumber.append("<span></span>");
                            $content1_pullNumber.append("<span>Pull:"+numMyPulls+"</span>");
                        }

                    }
                    //$("<div></div>").addClass("left_content_page").appendTo($left_content);

                }
            }
        });
}
//点赞功能
function star(){
        var repoName = getParam("repname");
        var itemName = getParam("itemname");
        var numstars = "";
        //对star数据进行更新
        $.ajax({
            url: ngUrl + "/star_stat/" + repoName + "/" + itemName,
            type: "GET",
            cache: false,
            async: false,
            dataType: 'json',
            success: function (json) {
                numstars = json.data.numstars;
                $("#icon_heart_number").text(numstars);

            }
        });
        $("#icon_heart").click(function () {
            if(login=="true") {
                $.ajax({
                    //获取star状态
                    url: ngUrl + "/star/" + repoName + "/" + itemName,
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: 'json',
                    headers: {Authorization: "Token " + $.cookie("token")},
                    success: function (json) {
                        if (json.data.starred) {
                            $("#icon_heart").css({
                                "background-image": "url('/images/icon_heart.png')",
                                "background-repeat": "no-repeat",
                                "background-position": "0px 1px",
                                "display": "inline-block",
                                "width": "25px",
                                "height": "25px"
                            });
                            //返回去star==0状态
                            $.ajax({
                                url: ngUrl + "/star/" + repoName + "/" + itemName + "?star=0",
                                type: "PUT",
                                cache: false,
                                async: false,
                                dataType: 'json',
                                headers: {Authorization: "Token " + $.cookie("token")},
                                success: function (json) {
                                    if (json.code == 0) {
                                        //对star数据进行更新
                                        $.ajax({
                                            url: ngUrl + "/star_stat/" + repoName + "/" + itemName,
                                            type: "GET",
                                            cache: false,
                                            async: false,
                                            dataType: 'json',
                                            //headers: {Authorization: "Token " + $.cookie("token")},
                                            success: function (json) {
                                                numstars = json.data.numstars;
                                                $("#icon_heart_number").text(numstars);
                                            }
                                        });
                                    }

                                }
                            });
                        }
                        else {
                            $("#icon_heart").css({
                                "background-image": "url('/images/icon_heart2.png')",
                                "background-repeat": "no-repeat",
                                "background-position": "0px 1px",
                                "display": "inline-block",
                                "width": "25px",
                                "height": "25px"
                            });
                            //返回去star==1状态
                            $.ajax({
                                url: ngUrl + "/star/" + repoName + "/" + itemName + "?star=1",
                                type: "PUT",
                                cache: false,
                                async: false,
                                dataType: 'json',
                                headers: {Authorization: "Token " + $.cookie("token")},
                                success: function (json) {
                                    if (json.code == 0) {
                                        //对star数据进行更新
                                        $.ajax({
                                            url: ngUrl + "/star_stat/" + repoName + "/" + itemName,
                                            type: "GET",
                                            cache: false,
                                            async: false,
                                            dataType: 'json',
                                            //headers: {Authorization: "Token " + $.cookie("token")},
                                            success: function (json) {
                                                numstars = json.data.numstars;
                                                $("#icon_heart_number").text(numstars);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
            else
            {
                $(" .alert_login").css({"display":"block","left":"420px"}).show();
            }
        })

}
//获取star状态并赋予相应心形状态
function starred2(){
    yes_no_login();
    if(login=="true"){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        //获取star状态
        url: ngUrl+"/star/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.data.starred==false){
                $("#icon_heart").css({"background-image":"url('/images/icon_heart.png')",
                    "background-repeat":"no-repeat",
                    "background-position":"0px 1px",
                    "display":"inline-block",
                    "width":"25px",
                    "height":"25px"});
            }
            else {
                $("#icon_heart").css({"background-image":"url('/images/icon_heart2.png')",
                    "background-repeat":"no-repeat",
                    "background-position":"0px 1px",
                    "display":"inline-block",
                    "width":"25px",
                    "height":"25px"});
            }
        }
    });
    }
    else {

    }

}
//点赞功能结束
//获取itemName的pull量
function itemName_pull(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/transaction_stat/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                $("#icon_download+p").text(json.data.numpulls);
            }
        }
    });
}
//返回该DataItem的订购量
function numsubs(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    $.ajax({
        url: ngUrl+"/subscription_stat/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                //$(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.nummypulls);
                $("#icon_buy+p").text(json.data.numsubs);
            }
        }
    });
}
//关于itemName的内容
function about_item(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    var urlrepo="repDetails.html?repname="+repoName;
    $("#client_down .repo2").append($("<a></a>").text(repoName).attr("href",urlrepo));
    var headerToken={};

    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    
    $.ajax({
        url: ngUrl+"/repositories/"+repoName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:headerToken,
        success:function(json){
            if(json.code == 0){
                $("#about>h3").text("关于"+itemName);
                $("#about>article").text(json.data.comment);
                var optime=json.data.optime;
                var arr=new Array();
                arr=optime.split("|");
                $(".span_time span:nth-child(2)").text(arr[1]).attr("title",arr[0]);
          /*      var label=json.data.label;
                if(label==null||label=="null"){
                }
                else{
                    $(".span_label").append($("<span></span>").text(json.data.label));
                    console.log(json.data.label);
                }*/
            }
        }
    });

}
//获得公司名称
//付费状态
function company(){
    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    var headerToken={};

    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $.ajax({
        url: ngUrl+"/repositories/"+repoName+"/"+itemName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:headerToken,
        success:function(json) {
            //company
            var create_user=json.data.create_user;
            //显示标签
            var label=json.data.label.sys.supply_style;
            if(label_owner==undefined){
            }else{
            var label_owner=json.data.label.owner;
            if(label_owner!=undefined||label_owner!=null||label_owner!="null"){
                //for( var lab in label_owner){
                    $(".span_label").append($("<span></span>").text(label_owner.starwars));
                //}
            }
            }

             if(label==null||label=="null"){
             }
             else{
                 if(label=="batch")
                     $(".span_label").append($("<span></span>").text("批量数据"));
                 if(label=="flow")
                     $(".span_label").append($("<span></span>").text("流式数据"));
                 if(label=="api")
                     $(".span_label").append($("<span></span>").text("API"));
             }


            var Sample=json.data.Sample;//样例数据
            $("#left_exam p:nth-child(2)").text(Sample);
            var Meta=json.data.Meta;//元数据
            $("#left_unit p:nth-child(2)").html(marked(Meta));

            var pricestate=json.data.pricestate;//获取付费状态
            var price = json.data.price;//计费方式
            if(price!=undefined||price!=null) {
                var price_length = price.length;
                for (var i = 0; i < price_length; i++) {
                    var expire = price[i].expire;//有效期
                    var money = price[i].money;//money
                    var units = price[i].units;//次数

                    $("#LT-right .form-control").append($("<option></option>").attr("value",i).text(money + "元" + units + "次,  " + "有效期" + expire + "天"))

                }
            }
            //获取付费状态
            if(pricestate=="免费")
            {
                $("#button_buy>p").text("免费").css({"height":"2.1em","margin-top":"40px","border":"1px solid #f49f12","color":"#f49f12"});
            }
            if(pricestate=="限量免费")
            {
                $("#button_buy>p").text("限量试用").css({"height":"3.2em","margin-top":"30px"});
            }
            if(pricestate=="付费")
            {
                $("#button_buy>p").text("付费").css({"height":"2.1em","margin-top":"40px"});
            }
            //通过创建者获取username
            $.ajax({
                url: ngUrl+"/users/"+create_user,
                type: "GET",
                cache:false,
                async:false,
                dataType:'json',
                //headers:{Authorization:"Token "+$.cookie("token")},
                success:function(j) {
                    //company
                    if(j.code==0){
                    	company_name= j.data.userName;
                        var url="dataOfDetails.html?username="+create_user;
                        $("#client_down .company_name a").text(company_name).attr("href",url);
                        //GET /heartbeat/status/:user 获取user的daemon status。
                        var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
                        if(login=="true"){
                            $.ajax({
                                url: ngUrl + "/heartbeat/status/"+create_user,
                                type: "GET",
                                cache: false,
                                async: false,
                                dataType: 'json',
                                headers: header,
                                success: function (json) {
                                      var status=json.data.status;
                                      if(status=="offline")
                                      {
                                          $("#LT_left_title .line").text("离线");
                                          $("#LT_left_title .line").css({"border":"1px solid #666666", "color":"#666666","position":"absolute","":""});
                                      }
                                    if(status=="online")
                                    {
                                        $("#LT_left_title .line").text("在线");
                                        $("#LT_left_title .line").css({"border":"1px solid #53be64", "color":"#53be64","position":"absolute","":""});
                                    }

                                }
                            });
                        }
                    }
                }
            });
        }
    });

}
var nav_index = 0;
function switchover(){
    var discuss=getParam("discuss");
    if(discuss=="discuss"){
        $("#left_content").hide();
        $("#left_exam").hide();
        $("#left_unit").hide();
        $("#left_comment").show();
        $("#nav4").addClass('borderBt');
        $("#nav4").siblings().removeClass('borderBt');
    }else{
        $("#left_exam").hide();
        $("#left_unit").hide();
        $("#left_comment").hide();
    }

    $("#left_nav>p").on("click",function(){
        var index=$(this).index();
        nav_index = $(this).index();
        $(this).addClass('borderBt');
        $(this).siblings().removeClass('borderBt');
        //下面这行复合样式不生效
        //$("#left_nav>p:eq("+index+")" ).css({" border-bottom":"4px solid #8c97cb"," font-weight":"bold"});
        $("#left_contentALL>div:eq("+index+")").show().siblings().hide();
    });
}
$("#left_nav>p").on("mouseover",function(){
    $(this).addClass('borderBt');
    $(this).siblings().removeClass('borderBt');
})
$("#left_nav>p").on("mouseout",function(){
    $("#left_nav>p").eq(nav_index).addClass('borderBt').siblings().removeClass('borderBt');
})
function tablesheet(){
    $("#left_unit table tbody tr:odd").css({"background-color":"#f3f3f3","height":"35px","width":"60px"});
    $("#left_unit table tbody tr:even").css({"background-color":"#f1f6fa","height":"35px","width":"60px"});
}
//点击空白处关闭登录提醒弹窗、点击订购逻辑
function closewrap(){
    yes_no_login();
    $(window).load(function() {
        var repoName=getParam("repname");
        var itemName=getParam("itemname");
        $(document).bind("click", function (e) {
            if ((e.target.className.indexOf("alert_login")<0 && e.target.id != "icon_heart"&&e.target.className.indexOf("btn")<0)) {
                $(".alert_login").css("display","none");
            }
        });
        if(login=="false") {
            $("#hurry_buy").click(function(){
                $(".alert_login").css({"display": "block", "left": "706px"}).show();
            });
        }
        else{
            var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
            $.ajax({
                url: ngUrl + "/repositories/" + repoName + "/" + itemName,
                type: "get",
                cache: false,
                async: false,
                headers: header,
                dataType: 'json',
                success: function (json) {
                   var tags=json.data.tags;
                    var price=json.data.price;
                    if(tags==0||price==null||price=="undefined"|| price==undefined||price=="")
                    {
                        $("#cancel_buy").hide();
                        $("#hurry_buy").hide();
                        $("#apply_buy").hide();
                        $("#price_plan").hide();
                        $("#upcoming_release").show();
                    }
                    else {
                        $.ajax({
                            url: ngUrl+"/repositories/"+repoName+"/"+itemName+"?haspermission=1",
                            type: "get",
                            cache:false,
                            data:{},
                            async:false,
                            headers:header,
                            dataType:'json',
                            success:function(json){
                                var permission=json.data.permission;
                                //alert("permission:"+permission);
                                if(permission==false||permission=="false")
                                {
                                    $.ajax({
                                        url: ngUrl+"/subscription/"+repoName+"/"+itemName+"/apply",
                                        type: "get",
                                        cache:false,
                                        async:false,
                                        headers:header,
                                        dataType:'json',
                                        success:function(json){
                                            if(json.code==0){
                                                //alert("json.data:"+json.data);
                                                if(json.data=="undefined"||json.data==undefined||json.data==null||json.data=="null")
                                                {
                                                    $("#apply_buy").show();
                                                    $("#hurry_buy").hide();
                                                    $("#cancel_buy").hide();
                                                    apply_buy();
                                                }
                                                else {
                                                    $("#cancel_buy").show();
                                                    $("#hurry_buy").hide();
                                                    $("#apply_buy").hide();
                                                    cancel_buy();
                                                }
                                            }
                                        }
                                    });
                                }
                                else {
                                    $("#hurry_buy").show();
                                    $("#cancel_buy").hide();
                                    $("#apply_buy").hide();
                                    hurry_buy();
                                }
                            }
                        });


                    }
                }
            });
        }
    });
}

//立即订购
function hurry_buy(){
    var headerToken={};
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var limitBoo=false;
    $("#hurry_buy").click(function(e){
        var repoName=getParam("repname");
        var itemName=getParam("itemname");
        $(".repnamePm").text(repoName);
        $(".itemnamePm").text(itemName);
        var price_plan=$("#price_plan").text();
        $.ajax({
            url: ngUrl+"/repositories/"+repoName+"/"+itemName,
            type: "get",
            cache:false,
            async:false,
            headers:headerToken,
            dataType:'json',
            success:function(json){
                if(json.code == 0){
                   var  prices= json.data.price;
                    if(prices!=null||prices!=""){
                        var sel_options=$("#LT-right .form-control").find("option:selected").val();
                        var limitNum=prices[sel_options].limit;//限制订购的次数
                        var planId=prices[sel_options].plan_id;
                            if(limitNum==null||limitNum==""||limitNum==undefined){
                                limitNum=0;
                            }
                            if(limitNum!=null||limitNum!=""||limitNum!=undefined){
                            $.ajax({
                                url: ngUrl+"/subscription_stat/"+repoName+"/"+itemName+"/"+planId,
                                type: "get",
                                cache:false,
                                async:false,
                                headers:{Authorization:"Token "+$.cookie("token")},
                                dataType:'json',
                                success:function(json){
                                    if(json.code==0){
                                        var numsigns=json.data.numsigns;//订购次数
                                        if(numsigns>=limitNum&&price_plan=="限量试用"){
                                            alert("您的有限免费额度已经用完，请选择其他计费包。");
                                            limitBoo=false
                                        }
                                        else{
                                            limitBoo=true;
                                        }
                                    }
                                },
                                error:function(){
                                }
                            });
                        }
                    }
                }
            }
        });

if(limitBoo){
        var create_user;
        var subscripted;
        var supplyStyle;
        var prices;
        var subType=true;


        var headerToken={};
        $("#myModalLabel").text("数据订购合约");
            //登陆后
            if($.cookie("token")!=null&&$.cookie("token")!="null"){
                headerToken={Authorization:"Token "+$.cookie("token")};
            }
            var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
            $.ajax({
                url: ngUrl+"/repositories/"+repoName+"/"+itemName,
                type: "get",
                cache:false,
                data:{},
                async:false,
                headers:headerToken,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        subscripted = json.data.itemaccesstype;
                        create_user = json.data.create_user;
                        prices = json.data.price;
                        supplyStyle = json.data.label.supply_style;
                    }
                }
            });
            //获取subscriptionid+time
            var myself=true;
            $.ajax({
                url: ngUrl+"/subscription/"+repoName+"/"+itemName,
                type: "post",
                cache:false,
                data:{},
                async:false,
                headers:headerToken,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        subscriptionid=json.data.subscriptionid;
                        subcreateTimes=json.data.signtime.substring(0,10);
                        $(".dvalue").text(subcreateTimes);
                    }
                },
                error:function(json){
                    if ($.parseJSON(json.responseText).code == 5008) {
                        $("#myself_alert").show().fadeOut(3000);
                        myself=false;
                    }
                }
            });

            //------------------------订购合同------------------------
            //设置甲方乙方
            var usera = $.cookie("tname");//获取当前用户，甲方
            var userb = create_user;//获取item用户，乙方
            $.ajax({
                url: ngUrl+"/users/"+usera,
                type: "get",
                cache:false,
                data:{},
                async:false,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        usera = json.data.userName;
                    }
                }
            });
            $.ajax({
                url: ngUrl+"/users/"+userb,
                type: "get",
                cache:false,
                data:{},
                async:false,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        userb = json.data.userName;
                    }
                }
            });
            $("#subscriptDialog .modal-body .sub0 .requirera .itext").val(usera);
            $("#subscriptDialog .modal-body .sub0 .requirerb .itext").val(userb);
            //创建价格列表
            var chargeBody = $("#subscriptDialog .modal-body .sub3 .sbody .charge-body");
            chargeBody.html("");
            var headerToken={};

            //登陆后
            if($.cookie("token")!=null&&$.cookie("token")!="null"){
                headerToken={Authorization:"Token "+$.cookie("token")};
            }
                $.ajax({
                    url: ngUrl+"/repositories/"+repoName+"/"+itemName,
                    type: "GET",
                    cache:false,
                    async:false,
                    dataType:'json',
                    headers:headerToken,
                    success:function(json) {
                        var pricestate = json.data.pricestate;//获取付费状态
                            var price = json.data.price;//计费方式
                        if(price==undefined||price==null){
                            $("#cancel_buy").hide();
                            $("#hurry_buy").hide();
                            $("#apply_buy").hide();
                            $("#price_plan").hide();
                            $("#upcoming_release").show();
                        }else {
                            var price_length = price.length;
                            for (var i = 0; i < price_length; i++) {
                                var expire = price[i].expire;//有效期
                                var money = price[i].money;//money
                                var units = price[i].units;//次数
                                var charegeitem = $("<div></div>").addClass("chargeitem").appendTo(chargeBody);
                                charegeitem.append($("<span class='cbtn'></span>").append($("<input name='subcharge' charge_hurry='charge_hurry' type='radio' value="+i+" checked='checkted'>")));
                                charegeitem.append($("<span class='cvalue'></span>").
                                append($("<span class='moneyu' mark=" + price[i].plan_id + "></span>").text("¥ ")).
                                append($("<span class='moneyv'></span>").text(money+"元")).
                                append($("<span class='moneyl'>&nbsp;/&nbsp;</span>")).
                                append($("<span class='moneyu2'></span>").text(units+"次")).
                                append($("<span class='moneyl'>&nbsp;&nbsp;&nbsp;&nbsp;</span>")).
                                append($("<span class='vexpire'></span>").text("有效期"+expire+"天")));

                        }
                            //charegeitem.append($("<span class='cdtitle'></span>").text(expire));
                            //charegeitem.append($("<span class='cdvalue'></span>").
                            //append($("<span class='vexpire'></span>").text(1)).
                            //append($("<span class='uexpire'></span>").text(" 天")));
                        }
                    }
                });
        //设置radio默认状态
        var sel_options=$("#LT-right .form-control").find("option:selected").val();
        $(".charge-body div:eq("+sel_options+") .cbtn input").attr("checked","checked");

            //TODO 设置订购合同日期，目前写死
            var timer;
            $('#subscriptDialog').on("hidden.bs.modal",function() {//从新初始化
                $("#subscriptDialog .subprocess .midle").text("60S");
                $("#subscriptDialog .modal-dialog").css({width:"758px"});
                $("#subscriptDialog .modal-header").show();
                $("#subscriptDialog .subcontent").show();
                $("#subscriptDialog .subprocess").hide();
                $("#subscriptDialog .subafterprocess .successed").hide();
                $("#subscriptDialog .subafterprocess .failed").hide();
            });
        if(myself==true){
            $("#subscriptDialog").modal('toggle');
        }
}
    });


    $("#subscriptDialog .modal-body .subbtns .cancel").click(function() {
        $('#subscriptDialog').modal('toggle');
    });
    $("#subscriptDialog .modal-body .subbtns .submit").click(function() {
        //TODO 没有提交的数据：甲方、乙方、合同订购日期
//					var usera = $.cookie("tname");
//					var userb = create_user;
//					var date = $("#subscriptDialog .modal-body .subdate .dvalue").text();
        var repoName = getParam("repname");
        var itemName = getParam("itemname");
        var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";

        //process
        $("#subscriptDialog .modal-header").hide();
        $("#subscriptDialog .subcontent").hide();
        $("#subscriptDialog .subprocess").show();
        $("#subscriptDialog .modal-dialog").css({width:"540px"});
        var i = 59;
        timer = setInterval(function() {
            $("#subscriptDialog .subprocess .midle").text(i+"S");
            i--;
            if(i == 0){
                clearInterval(timer);
                $("#subscriptDialog .modal-header").show();
                $("#subscriptDialog .subprocess").hide();
                $("#subscriptDialog .subafterprocess .failed").show();
            }
        },1000);
        //订购合同
        var data = {"price":{}};
        var charge = $("#subscriptDialog .modal-body .sub3 .charge-body .chargeitem input:radio:checked").closest(".chargeitem");
        var planid = charge.find(".moneyu").attr("mark").toString();

        var headerToken={};
//        Array.prototype.max = function(){   //最大值
//            return Math.max.apply({},this)
//        }
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
                var sel_price1= $("input:radio[charge_hurry=charge_hurry]:checked").parent().siblings().find(".moneyv").text();
                sel_price1=sel_price1.substring(0,sel_price1.length-1);
                $.ajax({
                    url: ngUrl + "/bill/" + $.cookie("tname") + "/info",
                    type: "GET",
                    cache: false,
                    async: false,
                    dataType: 'json',
                    headers: headerToken,
                    success: function (json) {
                        //console.log(price_array.max());价格的最大值
                        var actualBalance=json.data.actualBalance;
                        var availableBalance=json.data.availableBalance;
                        if(availableBalance>=(sel_price1)){
                            //订购
                            $.ajax({
                                url: ngUrl+"/subscription/"+repoName+"/"+itemName,
                                type: "PUT",
                                cache:false,
                                //	data:JSON.stringify(data),
                                data:JSON.stringify({"subscriptionid":subscriptionid,"planid":planid}),
                                async:false,
                                dataType:'json',
                                headers:header,
                                success:function(json){
                                    $("#myModalLabel").text("签约结果");
                                    if(json.code == 0){
                                        setTimeout(function() {
                                            clearInterval(timer);
                                            $("#subscriptDialog .modal-header").show();
                                            $("#subscriptDialog .subprocess").hide();
                                            $("#myModalLabel").text("签约结果");
                                            $("#subscriptDialog .subafterprocess .successed").show();
                                            $("#subscriptDialog .subafterprocess .failed").hide();
                                            var stars = parseInt($("#dataitem-head-right .subscript .value").text());
                                            $("#dataitem-head-right .subscript .value").text(stars+1);
                                        }, 1000)
                                    }else if(json.code==5024){
                                        $("#subscriptDialog .modal-header").show();
                                        $("#subscriptDialog .subprocess").hide();
                                        $("#subscriptDialog .subafterprocess .successed").hide();
                                        $("#subscriptDialog .subafterprocess .failed").show();
                                        $("#myModalLabel").text("签约结果");
                                    }else{
                                        clearInterval(timer);
                                        $("#myModalLabel").text("签约结果");
                                        $("#subscriptDialog .modal-header").show();
                                        $("#subscriptDialog .subprocess").hide();
                                        $("#subscriptDialog .subafterprocess .successed").hide();
                                        $("#subscriptDialog .subafterprocess .failed").show();
                                    }
                                }
                            });
                        }
                        else{
                            $("#myModalLabel").text("签约结果");
                            $("#subscriptDialog .modal-header").show();
                            $("#subscriptDialog .subprocess").hide();
                            $("#subscriptDialog .subafterprocess .successed").hide();
                            $("#subscriptDialog .subafterprocess .failed").show();
                        }
                    }
                });
    });
}


//申请订购
function apply_buy(){

    $("#apply_buy").click(function(e){
        var repoName=getParam("repname");
        var itemName=getParam("itemname");
        var create_user;
        var subscripted;
        var supplyStyle;
        var prices;
        var subType=true;



        //替换  服务内容
        $(".sub1 .sbody").replaceWith("<div class='sbody'>甲方向乙方申请订购“<span class='repnamePm'></span>/<span class='itemnamePm'></span>”的数据服务。" +
            "<br>乙方保证所提供数据的内容与“<span class='repnamePm'></span>”描述，“<span class='itemnamePm'></span>”描述、样例数据、元数据申明的一致，并保障数据质量。</div>");
        //替换  双方权利与义务
        $(".sub2 .sbody").replaceWith("");
        var $sbody=$("<div></div>").addClass("sbody").appendTo(".sub2");
        $sbody.append($("<div></div>").text("1、甲方提出申请后，乙方7天内有权选择同意或者拒绝。如甲方的申请7天未得到处理，则该申请失效。"));
        $sbody.append($("<div></div>").text(" 2、若乙方同意为甲方提供数据服务，且冻结本次订购的金额后，订购合同正式生效。订购合同生效后双方权利与义务约束如下：")
            .append($("<div></div>").text("a   若由于乙方原因导致用户订购的数据内容无法完整获取，则乙方全额退回本次订购的全部款项。"))
            .append($("<div></div>").text("b 若乙方提供的数据与申明不符，甲方可向DataHub平台申诉。若经过平台方介入鉴定，并与双方协商认为乙方提供的数据与申明不符，则本次订购无效。若经过平台方介入鉴定，并与双方协商认为乙方提供的数据与申明相符，则本次订购有效。"))
            .append($("<div></div>").html("c  乙方向甲方拥有发布于DataHub平台的<span class='repnamePm'></span>/<span class='itemnamePm'></span>的数据版权。"))
            .append($("<div></div>").html("d  甲方拥有<span class='repnamePm'></span>/<span class='itemnamePm'></span>的使用权，不得对获取的数据进行转售。")));
        $sbody.append($("<div></div>").text("3、若乙方同意为甲方提供数据服务，但甲方的可用余额不足，则本次申请无法生效。"));

            $(".repnamePm").text(repoName);
            $(".itemnamePm").text(itemName);
            var headerToken={};
            $("#myModalLabel").text("申请数据订购合同");
            //登陆后
            if($.cookie("token")!=null&&$.cookie("token")!="null"){
                headerToken={Authorization:"Token "+$.cookie("token")};
            }
            var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
            $.ajax({
                url: ngUrl+"/repositories/"+repoName+"/"+itemName,
                type: "get",
                cache:false,
                data:{},
                async:false,
                headers:headerToken,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        subscripted = json.data.itemaccesstype;
                        create_user = json.data.create_user;
                        prices = json.data.price;
                        supplyStyle = json.data.label.supply_style;
                    }
                },
                error:function(){
                    if ($.parseJSON(json.responseText).code == 5008) {
                        $("#myself_alert").show().fadeOut(3000);

                    }
                }
            });
            //获取subscriptionid+time
        var myself=true;
            $.ajax({
                url: ngUrl+"/subscription/"+repoName+"/"+itemName+"/apply",
                type: "post",
                cache:false,
                data:{},
                async:false,
                headers:header,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){

                        subscriptionid=json.data.subscriptionid;
                        subcreateTimes=json.data.applytime.substring(0,10);
                        $(".dvalue").text(subcreateTimes);

                    }
                },
                error:function(json){
                    if ($.parseJSON(json.responseText).code == 5008) {
                        $("#myself_alert").show().fadeOut(3000);
                        myself=false;
                    }
                }
            });

            //------------------------订购合同------------------------
            //设置甲方乙方
            window.usera = $.cookie("tname");//获取当前用户，甲方
            window.userb = create_user;//获取item用户，乙方
            $.ajax({
                url: ngUrl+"/users/"+usera,
                type: "get",
                cache:false,
                data:{},
                async:false,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        usera = json.data.userName;
                    }
                }
            });
            $.ajax({
                url: ngUrl+"/users/"+userb,
                type: "get",
                cache:false,
                data:{},
                async:false,
                dataType:'json',
                success:function(json){
                    if(json.code == 0){
                        userb = json.data.userName;
                    }
                }
            });
            $("#subscriptDialog .modal-body .sub0 .requirera .itext").val(usera);
            $("#subscriptDialog .modal-body .sub0 .requirerb .itext").val(userb);
            //创建价格列表
            var chargeBody = $("#subscriptDialog .modal-body .sub3 .sbody .charge-body");
            chargeBody.html("");
            var headerToken={};

            //登陆后
            if($.cookie("token")!=null&&$.cookie("token")!="null"){
                headerToken={Authorization:"Token "+$.cookie("token")};
            }
            $.ajax({
                url: ngUrl+"/repositories/"+repoName+"/"+itemName,
                type: "GET",
                cache:false,
                async:false,
                dataType:'json',
                headers:headerToken,
                success:function(json) {
                    var pricestate = json.data.pricestate;//获取付费状态
                    var price = json.data.price;//计费方式
                    if(price==undefined||price==null){
                        $("#cancel_buy").hide();
                        $("#hurry_buy").hide();
                        $("#apply_buy").hide();
                        $("#price_plan").hide();
                        $("#upcoming_release").show();
                    }else {
                        var price_length = price.length;
                        for (var i = 0; i < price_length; i++) {
                            var expire = price[i].expire;//有效期
                            var money = price[i].money;//money
                            var units = price[i].units;//次数
                            var charegeitem = $("<div></div>").addClass("chargeitem").appendTo(chargeBody);
                            charegeitem.append($("<span class='cbtn'></span>").append($("<input name='subcharge' charge='charge' type='radio' value="+i+" checked='checkted'>")));
                            charegeitem.append($("<span class='cvalue'></span>").
                            append($("<span class='moneyu' mark=" + price[i].plan_id + "></span>").text("¥ ")).
                            append($("<span class='moneyv'></span>").text(money+"元")).
                            append($("<span class='moneyl'>&nbsp;/&nbsp;</span>")).
                            append($("<span class='moneyu2'></span>").text(units+"次")).
                            append($("<span class='moneyl'>&nbsp;&nbsp;&nbsp;&nbsp;</span>")).
                            append($("<span class='vexpire'></span>").text("有效期"+expire+"天")));
                    }
                    }
                }
            });

            //设置radio默认状态
            var sel_options=$("#LT-right .form-control").find("option:selected").val();
            $(".charge-body div:eq("+sel_options+") .cbtn input").attr("checked","checked");

            //TODO 设置订购合同日期，目前写死
            var timer;
            $('#subscriptDialog').on("hidden.bs.modal",function() {//从新初始化
                $("#subscriptDialog .subprocess .midle").text("60S");
                $("#subscriptDialog .modal-dialog").css({width:"758px"});
                $("#subscriptDialog .modal-header").show();
                $("#subscriptDialog .subcontent").show();
                $("#subscriptDialog .subprocess").hide();
                $("#subscriptDialog .subafterprocess .successed").hide();
                $("#subscriptDialog .subafterprocess .failed").hide();
            });
        if(myself==true){
            $("#subscriptDialog").modal('toggle');
        }

    });


    $("#subscriptDialog .modal-body .subbtns .cancel").click(function() {
        $('#subscriptDialog').modal('toggle');
    });
    $("#subscriptDialog .modal-body .subbtns .submit").click(function() {
        //TODO 没有提交的数据：甲方、乙方、合同订购日期
        var repoName = getParam("repname");
        var itemName = getParam("itemname");
        var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
        var sel_price1= $("input:radio[charge=charge]:checked").parent().siblings().find(".moneyv").text();
        sel_price1=sel_price1.substring(0,sel_price1.length-1);
        //process
        $("#subscriptDialog .modal-header").hide();
        $("#subscriptDialog .subcontent").hide();
        $("#subscriptDialog .subprocess").show();
        $("#subscriptDialog .modal-dialog").css({width:"540px"});
        var i = 59;
        timer = setInterval(function() {
            $("#subscriptDialog .subprocess .midle").text(i+"S");
            i--;
            if(i == 0){
                clearInterval(timer);
                $("#subscriptDialog .modal-header").show();
                $("#subscriptDialog .subprocess").hide();
                $("#subscriptDialog .subafterprocess .failed").show();
            }
        },1000);
        //订购合同
        var data = {"price":{}};
        var charge = $("#subscriptDialog .modal-body .sub3 .charge-body .chargeitem input:radio:checked").closest(".chargeitem");
        var planid = charge.find(".moneyu:first").attr("mark").toString();
        //申请订购
        var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
        var price_array;
                    $.ajax({
                        url: ngUrl+"/subscription/"+repoName+"/"+itemName+"/apply",
                        type: "PUT",
                        cache:false,
                        //	data:JSON.stringify(data),
                        data:JSON.stringify({"subscriptionid":subscriptionid,"planid":planid,"action":"apply"}),
                        async:false,
                        dataType:'json',
                        headers:header,
                        success:function(json){
                            $("#myModalLabel").text("申请签约结果");
                            if(json.code == 0){
                                setTimeout(function() {
                                    clearInterval(timer);
                                    $("#myModalLabel").text("申请签约结果");
                                    $("#subscriptDialog .modal-header").show();
                                    $("#subscriptDialog .subprocess").hide();
                                    $("#subscriptDialog .subafterprocess .successed_apply").show();
                                    $("#subscriptDialog .subafterprocess .failed").hide();
                                    var stars = parseInt($("#dataitem-head-right .subscript .value").text());
                                    $("#dataitem-head-right .subscript .value").text(stars+1);
                                    $("#apply_buy").hide();
                                    $("#hurry_buy").hide();
                                    $("#cancel_buy").show();
                                    $('#subscriptDialog').on('hide.bs.modal', function () {
                                        location.reload();
                                    });
                                }, 1000)
                            }else {
                                clearInterval(timer);
                                $("#myModalLabel").text("申请签约结果");
                                $("#subscriptDialog .modal-header").show();
                                $("#subscriptDialog .subprocess").hide();
                                $("#subscriptDialog .subafterprocess .successed").hide();
                                $("#subscriptDialog .subafterprocess .failed2").show();
                                location.reload();
                            }
                        },
                        error:function(){
                            clearInterval(timer);
                            //if ($.parseJSON(json.responseText).code == 5026) {
                                $("#myModalLabel").text("申请签约结果");
                                $("#subscriptDialog .modal-header").show();
                                $("#subscriptDialog .subprocess").hide();
                                $("#subscriptDialog .subafterprocess .successed").hide();
                                $("#subscriptDialog .subafterprocess .failed2").show();
                                $('#subscriptDialog').on('hide.bs.modal', function () {
                                    location.reload();
                                });
                            //}
                        }
                    });
            });
}

function cancel_buy(){
    var header = login=="true" ? {Authorization:"Token "+$.cookie("token")}:"";
    $("#cancel_buy").on("click",function(){
        var repoName=getParam("repname");
        var itemName=getParam("itemname");
        $.ajax({
            url: ngUrl + "/subscription/" + repoName + "/" + itemName + "/apply",
            type: "get",
            cache: false,
            async: false,
            dataType: 'json',
            headers: header,
            success: function (json) {
                var subscriptionid=json.data.subscriptionid;
                $.ajax({
                    url: ngUrl + "/subscription/" + repoName + "/" + itemName + "/apply",
                    type: "PUT",
                    cache: false,
                    //	data:JSON.stringify(data),
                    data: JSON.stringify({"subscriptionid": subscriptionid,"action": "withdraw"}),
                    async: false,
                    dataType: 'json',
                    headers: header,
                    success: function (json) {
                        if (json.code == 0) {
                            $("#cance_alert").text("您已取消成功!");
                            $("#apply_buy").show();
                            $("#hurry_buy").hide();
                            $("#cancel_buy").hide();
                            $("#cance_alert").show();
                            location.reload();
                        }
                    },
                    error:function(){
                        if ($.parseJSON(json.responseText).code == 5008) {
                            $("#myself_alert").show().fadeOut(3000);
                            location.reload();
                        }
                    }
                });
            }
        });
    });
}

