
var repname='';
var apendjson = {};
var fornum;
$(function() {
    function getTimes(times){
        var jsonTime = {};
        jsonTime.nums=times.indexOf("|");
        if(jsonTime.nums!="-1"){
            jsonTime.jdTime=times.substr(0,19);
            jsonTime.xdTime=times.substring(jsonTime.nums+1,times.length);
            jsonTime.showTime=jsonTime.xdTime;
        }else{
            jsonTime.showTime=times;
        }
        return jsonTime;
    };
    function getscreateName(create_user){
        var itemloginName = '';
        $.ajax({
            url: ngUrl +"/users/"+create_user,
            cache: false,
            async: false,
            success: function (datas) {
                itemloginName = datas.data.userName;
            }
        });
        return itemloginName;
    }
    function judgeLabel (labels){
        var labeldata = {
            'label' : labels,
            'vvclass' : '',
            'labelV' : ''
        };
        if (labeldata.label == "single") {
            labeldata.vvclass = "api";
            labeldata.labelV = "API";
        }
        if (labeldata.label == "batch") {
            labeldata.vvclass = "period";
            labeldata.labelV = "批量数据";
        }
        if (labeldata.label == "flow") {
            labeldata.vvclass = "flot-data";
            labeldata.labelV = "流式数据";
        }
        return labeldata
    };
    function getAjax(url,fun){
        $.ajax({
            type: "get",
            async: false,
            url: url,
            success: function(msg){
                fun(msg);
            }
        });
    }

    var itemid = /\?.*repname=([^&]*).*$/;
    if (itemid.test(decodeURIComponent(window.location.href))) {
        repname = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    $('.repname').html(repname);
    $('.aboutrep').html('关于'+repname);
    var datas = [];
    var paegeitems;
    var preloginname = '';
    //得到repname；
    function getrepname(pages) {
        $('.itemList').empty();
        datas = [];
        var headerToken={};
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
        $.ajax({
            url: ngUrl + "/repositories/" + repname + "?items=1&size=6&page="+pages,
            cache: false,
            async: false,
            headers:headerToken,
            success: function (msg) {
                $('.repcomment').html(msg.data.comment);
                preloginname = msg.data.create_user;

                paegeitems = msg.data.items;
                var times = msg.data.optime;
                var jsonTime = getTimes(times);
                $('.repoptime').html(jsonTime.showTime);
                $('.repoptime').attr('title',jsonTime.jdTime);
                $('.repoptime').attr('data-toggle','tooltip');
                $('.repoptime').attr('datapalecement','top');

                ///////////////////////////////////////////
                for (i = 0; i < msg.data.dataitems.length; i++) {
                    datas.push(msg.data.dataitems[i]);
                }
            },error:function (json)
            {
                if(json.status == 400) {
                    if ($.parseJSON(json.responseText).code == 1006) {
                        alert("信息已过期，访问首页!");
                        window.location.href="/";
                    }
                }

            }

        });
    }
    getrepname(1);
    //得到用户姓名
    getAjax(ngUrl +"/users/"+preloginname,function(msg){
        $('.repcreate_user').html(msg.data.userName);
        $('.repcreate_user').attr('href','dataOfDetails.html?username='+preloginname);
    });
    //返回rep的star量
    getAjax(ngUrl +"/star_stat/"+repname,function(msg){
        $('.starnum').html(msg.data.numstars);
    });
    var htmls = '';

    //返回该repositories的订阅量
    getAjax(ngUrl + "/subscription_stat/" +repname,function(msg){
        $(".repdnum").html(msg.data.numsubs);
    });
    //返回该repositories的下载量
    getAjax(ngUrl + "/transaction_stat/" +repname,function(msg){
        $(".numpulls").html(msg.data.numpulls);
    });

    function getitemDeteails(){
        var dataitemd = [];
        var dataitemdpullNum = [];
        var dataitemstarNum= [];
        var dataitemdcommentNum=[];
        for(var i= 0;i<datas.length;i++) {
            //返回该DataItem的订阅量
            getAjax(ngUrl + "/subscription_stat/" +datas[i],function(msg){
                dataitemd.push(msg.data.numsubs);
            });
            //返回该DataItem的pull量
            getAjax(ngUrl + "/transaction_stat/" +repname+datas[i],function(msg){
                dataitemdpullNum.push(msg.data.numpulls);
            });
            // 返回item的star量
            getAjax(ngUrl + "/star_stat/" +repname+"/"+datas[i],function(msg){
                dataitemstarNum.push(msg.data.numstars);
            });
            //返回item的comment量
            getAjax(ngUrl + "/comment_stat/" +repname+"/"+datas[i],function (msg) {
                dataitemdcommentNum.push(msg.data.numcomments);
            });
        }
    }
    getitemDeteails();
    //填充items列

    function funitemList(label){
        fornum = datas.length;
        var headerToken={};
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
        for(var i=0;i<fornum;i++) {
            apendjson = {};
            var itemloginName = '';
            $.ajax({
                url: ngUrl + "/repositories/" + repname + "/"+datas[i]+"?abstract=1",
                cache: false,
                async:false,
                headers:headerToken,
                success: function (msg) {
                    itemloginName = getscreateName(msg.data.create_user);
                    var labels = msg.data.label.sys.supply_style;
                    var labeldatas = judgeLabel(labels);
                    var times = msg.data.optime;
                    var jsonTime = getTimes(times);
                    var labelstr = '';
                    if(msg.data.label != null && msg.data.label != ''){
                        var ptags = msg.data.label.owner;
                        for(var j in ptags) {
                            labelstr+='<p class="thislabels">'+ptags[j]+'</p>';
                        }
                    }
                    apendjson.repname = repname;
                    apendjson.datas = datas;
                    apendjson.create_user = msg.data.create_user;
                    apendjson.itemloginName = itemloginName;
                    apendjson.comment = msg.data.comment;
                    apendjson.pricestate = msg.data.pricestate;
                    apendjson.jdTime = jsonTime.jdTime;
                    apendjson.showTime = jsonTime.showTime;
                    apendjson.tagss = msg.data.tags;
                    apendjson.labelV = labeldatas.labelV;
                    apendjson.vvclass = labeldatas.vvclass;
                    $.ajax({
                        url: ngUrl+"/subscription_stat/"+repname+"/"+datas[i],
                        type: "GET",
                        cache:false,
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){     
                            	apendjson.dataitemd = json.data.numsubs;
                            }
                        }
                    });
                    $.ajax({
                        url: ngUrl+"/transaction_stat/"+repname+"/"+datas[i],
                        type: "GET",
                        cache:false,
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                            	apendjson.dataitemdpullNum=json.data.numpulls;
                            }
                        }
                    });
                    getAjax(ngUrl + "/star_stat/" +repname+"/"+datas[i],function(msg){
                        apendjson.dataitemstarNum = msg.data.numstars;
                    });
                    getAjax(ngUrl + "/comment_stat/" +repname+"/"+datas[i],function (msg) {
                        apendjson.dataitemdcommentNum = msg.data.numcomments;
                    });
                  //  apendjson.dataitemd = dataitemd;
                  //  apendjson.dataitemdpullNum = dataitemdpullNum;
                  //  apendjson.dataitemstarNum = dataitemstarNum;
                  //  apendjson.dataitemdcommentNum = dataitemdcommentNum;
                    apendBigbox(apendjson,i,labelstr);
                }
            });
        }
    }

    /////////////////////////////////////////////分页
    funitemList();
    $(".pages").pagination(paegeitems, {
        maxentries:paegeitems,
        items_per_page: 6,
        num_display_entries: 3,
        num_edge_entries: 3 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
//          num_edge_entries:1,
        link_to:"javascript:void(0)",
        callback:fenS,
        load_first_page:false
    });
    $('.pagination a').attr('href','javascript:void(0)')
    function fenS(new_page_index){
        getitemDeteails();
        getrepname(new_page_index+1);
        fornum = datas.length;
        apendjson = {};
        var headerToken={};
        //登陆后
        if($.cookie("token")!=null&&$.cookie("token")!="null"){
            headerToken={Authorization:"Token "+$.cookie("token")};
        }
        $('.bigBox').empty();
        // alert(ngUrl + "/repositories/" + repname + "/"+datas[1]);
        for(var i=0;i<fornum;i++) {
            var itemloginName = '';
            $.ajax({
                type: "get",
                url: ngUrl + "/repositories/" + repname + "/"+datas[i],
                cache: false,
                async:false,
                headers:headerToken,
                success: function (msg) {
                    itemloginName = getscreateName(msg.data.create_user);
                    var vvclass = "";
                    var labels = msg.data.label.sys.supply_style;
                    var labeldatas = judgeLabel(labels);
                    var times = msg.data.optime;
                    var jsonTime = getTimes(times);
                    var labelstr = '';
                    if(msg.data.label != null && msg.data.label != ''){
                        var ptags = msg.data.label.owner;
                        for(var j in ptags) {
                            labelstr+='<p class="thislabels">'+ptags[j]+'</p>';
                        }
                    }
                    apendjson.repname = repname;
                    apendjson.datas = datas;
                    apendjson.create_user = msg.data.create_user;
                    apendjson.itemloginName = itemloginName;
                    apendjson.comment = msg.data.comment;
                    apendjson.pricestate = msg.data.pricestate;
                    apendjson.jdTime = jsonTime.jdTime;
                    apendjson.showTime = jsonTime.showTime;
                    apendjson.tagss = msg.data.tags;
                    apendjson.labelV = labeldatas.labelV;
                    apendjson.vvclass = labeldatas.vvclass;
                    //apendjson.dataitemd = dataitemd;
                    //apendjson.dataitemdpullNum = dataitemdpullNum;
                    $.ajax({
                        url: ngUrl+"/subscription_stat/"+repname+"/"+datas[i],
                        type: "GET",
                        cache:false,
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){     
                            	apendjson.dataitemd = json.data.numsubs;
                            }
                        }
                    });
                    $.ajax({
                        url: ngUrl+"/transaction_stat/"+repname+"/"+datas[i],
                        type: "GET",
                        cache:false,
                        async:false,
                        dataType:'json',
                        success:function(json){
                            if(json.code == 0){
                            	apendjson.dataitemdpullNum=json.data.numpulls;
                            }
                        }
                    });
                    getAjax(ngUrl + "/star_stat/" +repname+"/"+datas[i],function(msg){
                        apendjson.dataitemstarNum = msg.data.numstars;
                    });
                    getAjax(ngUrl + "/comment_stat/" +repname+"/"+datas[i],function (msg) {
                        apendjson.dataitemdcommentNum = msg.data.numcomments;
                    });
                    //apendjson.dataitemstarNum = dataitemstarNum;
                    //apendjson.dataitemdcommentNum = dataitemdcommentNum;
                    apendBigbox(apendjson,i,labelstr);
                }
            });
        }
    }
    window.onscroll = function(){
        var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
        if(scrolltop>400){
            $('.gotop').show();
        }else{
            $('.gotop').hide();
        }
    }
    $('.gotop').click(function(){
        document.documentElement.scrollTop = document.body.scrollTop =0;
    })

});

function apendBigbox(apendjson,i,labelstr){
    var thispricestate = '';
    if(apendjson.pricestate != ''){
        if(apendjson.pricestate == '免费'){
            pricestype = 'freetype';
        }else if(apendjson.pricestate == '付费'){
            pricestype = 'chargetype';
        }else{
            pricestype = 'limitedfreetype';
        }
        thispricestate = '<p class="'+pricestype+'">'+apendjson.pricestate+'</p>';
    }
    htmls =
        '<div class="repo">'+
        '<div class="left">'+
        '<div class="subtitle">'+
        '<a href="itemDetails.html?repname='+apendjson.repname+'&itemname='+apendjson.datas[i]+'">'+apendjson.datas[i]+'</a>'+
        '</div>'+
        '<div class="description">'+
        '<p>' + apendjson.comment + '</p>'+
        '</div>'+
        '<div class="subline">'+
        '<div class="lable">'+
        '<p class='+ apendjson.vvclass +'>' + apendjson.labelV + '</p>'+labelstr+
        '</div>'+
        '<div class="icon">'+
        '<img class="iconiamg1" src="images/newpic004.png" data-toggle="tooltip" datapalecement="top" title="更新时间"/>'+
        '<span data-toggle="tooltip" datapalecement="top" title="'+apendjson.jdTime+'">' + apendjson.showTime + '</span>'+
        '<img class="iconiamg1" src="images/newpic005.png" data-toggle="tooltip" datapalecement="top" title="tag量" />'+
        '<span>'+ apendjson.tagss + '</span>'+
        '</div>'+
        '</div>'+
        '<div class="supplier">'+
        '<p> 本数据由 <a href="dataOfDetails.html?username='+apendjson.create_user+'">' + apendjson.itemloginName +' </a>提供</p>'+
        '</div>'+
        '</div>'+
        '<div class="right">'+
        '<div class="price">'+
        thispricestate+
        '</div>'+
        '<div class="iconGroup">'+
        '<div class="like">'+
        '<img style=""src="images/newpic001.png" data-toggle="tooltip" datapalecement="top" title="点赞量">'+
        '<span>' + apendjson.dataitemstarNum + '</span>'+
        '</div>'+
        '<div class="cart">'+
        '<img style=""src="images/newpic002.png" data-toggle="tooltip" datapalecement="top" title="订购量">'+
        '<span>'+apendjson.dataitemd+'</span>'+
        '</div>'+
        '<div class="download">'+
        '<img style=""src="images/newpic003.png" data-toggle="tooltip" datapalecement="top" title="下载量">'+
        '<span>'+apendjson.dataitemdpullNum+'</span>'+
        '</div>'+
        '<div class="comment">'+
        '<img style=""src="../images/selects/comment.png" data-toggle="tooltip" datapalecement="top" title="评论量">'+
        '<span>'+apendjson.dataitemdcommentNum+'</span>'+
        '</div>'+
        '</div>'+
        '</div>';
    $('.itemList').append(htmls);
    $('[data-toggle="tooltip"]').tooltip();

}


//获取reponame,itemname
function getParam(key) {
    var value='';
    var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
    if (itemid.test(decodeURIComponent(window.location.href))) {
        value = itemid.exec(decodeURIComponent(window.location.href))[1];
    }
    return value;
}
//the amount of like:star
function subscription(repoName){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var starAmount = '';
        $.ajax({
            url: ngUrl + "/star_stat/"+repoName,
            type: "GET",
            cache: false,
            async: false,
            dataType: 'json',
            //headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                if(json.code == 0) {
                    starAmount = json.data.numstars;
                }
            }
        });
        return starAmount;
}

//the amount of purchase icon cart
function purchase(repoName){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var purchaseAmount = '';
            $.ajax({
                url: ngUrl+"/subscription_stat/"+repoName,
                type: "GET",
                cache:false,
                async:false,
                dataType:'json',
                //headers:{Authorization:"Token "+$.cookie("token")},
                success:function(json){
                    if(json.code == 0){
                        //$(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.nummypulls);
                        purchaseAmount=json.data.numsubs;
                    }
                 }
             });
    return purchaseAmount;
 }
//the amount of download the icon download
function download_icon(repoName){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
     }
     var downloadAmount ='';
     $.ajax({
         url: ngUrl+"/transaction_stat/"+repoName,
         type: "GET",
         cache:false,
         async:false,
         dataType:'json',
         //headers:{Authorization:"Token "+$.cookie("token")},
         success:function(json){
             if(json.code == 0){
                 downloadAmount = json.data.numpulls;
             }
         }
     });
     return downloadAmount;
}
//the amount of comment
function getComments(repoName){
    var commentAmount=0;
    var allCommentAmount=0;
    var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $.ajax({
        url: ngUrl+"/repositories/"+repoName+"?items=1",
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:headerToken,
        success:function(json){
            if(json.code == 0){
                if(json.data.dataitems!=null){
                    var dataItem=json.data.dataitems;
                    var len=json.data.items;
                    for(var i=0;i<len;i++){
                        var itemName=dataItem[i];
                        $.ajax({
                            url: ngUrl+"/comment_stat/"+repoName+"/"+itemName,
                            type: "GET",
                            cache:false,
                            async:false,
                            dataType:'json',
                            headers:headerToken,
                            success:function(json){
                                if(json.code == 0){
                                    commentAmount=json.data.numcomments;
                                }
                            }
                        });
                        allCommentAmount+=commentAmount;
                    }
                }
            }
        },error:function (json)
        {
            if(json.status == 400) {
                if ($.parseJSON(json.responseText).code == 1006) {
                    alert("信息已过期，访问首页!");
                    window.location.href="/";
                }
            }

        }

    });
    return allCommentAmount;
}

$(document).ready(function(){
    var repoName=getParam("repname");
   var allCommentAmount= getComments(repoName);
    $(".numcomments").text(allCommentAmount);

    getUserEmail();
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

//the amount of like:star
function subscription(repoName){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var starAmount = '';
    $.ajax({
        url: ngUrl + "/star_stat/"+repoName,
        type: "GET",
        cache: false,
        async: false,
        dataType: 'json',
        //headers: {Authorization: "Token " + $.cookie("token")},
        success: function (json) {
            if(json.code == 0) {
                starAmount = json.data.numstars;
            }
        }
    });
    return starAmount;
}

//the amount of purchase icon cart
function purchase(repoName){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var purchaseAmount = '';
    $.ajax({
        url: ngUrl+"/subscription_stat/"+repoName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                //$(".content1_pullNumber span:nth-child(2)").text("pull:"+json.data.nummypulls);
                purchaseAmount=json.data.numsubs;
            }
        }
    });
    return purchaseAmount;
}
//the amount of download the icon download
function download_icon(repoName){
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var downloadAmount ='';
    $.ajax({
        url: ngUrl+"/transaction_stat/"+repoName,
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        //headers:{Authorization:"Token "+$.cookie("token")},
        success:function(json){
            if(json.code == 0){
                downloadAmount = json.data.numpulls;
            }
        }
    });
    return downloadAmount;
}
//the amount of comment
function getComment(repoName){
    var commentAmount=0;
    var allCommentAmount=0;
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
        headers:headerToken,
        dataType:'json',
        success:function(json){
            if(json.code == 0){
                if(json.data.dataitems!=null){
                    var dataItem=json.data.dataitems;
                    var len=json.data.items;
                    for(var i=0;i<len;i++){
                        var itemName=dataItem[i];
                        $.ajax({
                            url: ngUrl+"/comment_stat/"+repoName+"/"+itemName,
                            type: "GET",
                            cache:false,
                            async:false,
                            dataType:'json',
                            success:function(json){
                                if(json.code == 0){
                                    commentAmount=json.data.numcomments;
                                }
                            }
                        });
                        allCommentAmount+=commentAmount;
                    }
                }
            }
        }
    });
    return allCommentAmount;
}

var $place=$("<div></div>").appendTo($("#hot"));
//get currently user's loginname(email)
function getUserEmail()
    var headerToken={};
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
       headerToken={Authorization:"Token "+$.cookie("token")};
    }
    var repname = getParam("repname");
    var loginEmail = '';
     $.ajax({
         url: ngUrl +"/repositories/"+repname,
         type: "get",
         cache: false,
         async: false,
         headers:headerToken,
         success: function (jsons) {
         loginEmail = jsons.data.create_user;
         //get username

            $.ajax({
                url: ngUrl +"/users/"+loginEmail,
                type: "get",
                cache: false,
                async: false,
                success: function (jsons){
            //get reponame

            var repoName = '';
            $.ajax({
                url: ngUrl +"/repositories/"+"?size=3&username="+loginEmail,
                type: "get",
                cache: false,
                async: false,
                headers:headerToken,
                success: function (jsons) {
                    var repoName_exist=$(".title .titlename").text();
                    var data_len=jsons.data.length;
                    if(data_len==0||data_len==null){
                        $("#hot").hide();
                    }else{
                        $("#hot").show();
                    }
                    for (i=0;i<jsons.data.length;i++){
                        repoName=jsons.data[i].repname;
                        if(repoName_exist==repoName){
                            continue;
                        }
                        var like = subscription(repoName);
                        var cart =purchase(repoName);
                        var download =download_icon(repoName);
                        var comment = getComment(repoName);
                        var url ="repDetails.html?repname="+repoName
                        $place.append(""+
                            "<div class='completeDiv'  style='float: left;'>"+
                            "<a href='"+url+"'> <p class='subtitle'>"+repoName+"</p></a>"+
                            "<div class='icons' >"+
                            "<div class='likes' >"+"<img src='images/newpic001.png'>"+"<span>"+like+"</span>"
                            +"</div>"
                            +"<div class='carts' >"+"<img src='images/newpic002.png'>"+"<span>"+cart+"</span>"
                            +"</div>"
                            +"<div class='downloads' >"+"<img src='images/newpic003.png'>"+"<span>"+download+"</span>"
                            +"</div>"
                            +"<div class='comments' >"+" <img src='../images/selects/comment.png'>"+"<span>"+comment+"</span>"
                            +"</div>"+"</div>"+"</div>"+"</div>");
                    }
                }
            });
        }
    });
   }
});
}
