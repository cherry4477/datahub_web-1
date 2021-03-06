/**
 * Created by Administrator on 2015/12/9.
 */

var idorder = '';
var itemid = /\?.*order=([^&]*).*$/;
if (itemid.test(decodeURIComponent(window.location.href))) {
    idorder = itemid.exec(decodeURIComponent(window.location.href))[1];
}
$(function() {
    $(document).on('mouseover','.repo',function (e) {
        $(this).children('.describe').css("background-color", "#f4fbfe");
    });
    $(document).on('mouseout','.repo',function (e) {
        $(this).children('.describe').css("background-color", "#ffffff");
    });
    if(idorder == 'order'){
        $('.top_nav > div').eq(1).addClass('cur').siblings().removeClass('cur');
        $('.mypushcomment > li').eq(1).show().siblings().hide();
    }
    function getAjax(url,fun){
        $.ajax({
            type: "get",
            async: false,
            url: url,
            success: function(msg){
                fun(msg);
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }
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
    var allrepnums = 0;
    $.ajax({
        url: ngUrl + "/repositories?size=-1",
        type: "get",
        cache: false,
        data: {},
        async: false,
        dataType: 'json',
        headers: {Authorization: "Token " + $.cookie("token")},
        success: function (json) {
            if (json.code == 0) {
                allrepnums = json.data.length;
            }
        },
        error: function (json) {
            errorDialog($.parseJSON(json.responseText).code);
            $('#errorDM').modal('show');
        }
    });
    //请求所有rep
    var curpagerepoarr = [];
    function getreps(nextpages) {
        $('.repList').empty();
        reps = null;
        $.ajax({
            url: ngUrl + "/repositories?size=10&page=" + nextpages,
            type: "get",
            cache: false,
            data: {},
            async: false,
            dataType: 'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                if (json.code == 0) {
                    for (var i = 0;i<json.data.length;i++) {
                        getrepocon(json.data[i]);
                    }
                }
            },
            error: function (json) {
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }

    getreps(1);
    ////////////////获取repo详细信息
    function getrepocon(thisrepoame){
        $.ajax({
            url: ngUrl+"/repositories/"+thisrepoame.repname+"?items=update_time_down&myRelease=1",
            type: "get",
            cache:false,
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(json.code == 0){
                    addrepohtml(json.data,thisrepoame);
                }
            },
            error:function(json){
                errorDialog($.parseJSON(json.responseText).code);
                $('#errorDM').modal('show');
            }
        });
    }
    ////////////////////////////////repo分页
    $(".repopages").pagination(allrepnums, {
        maxentries: allrepnums,
        items_per_page: 10,
        num_display_entries: 3,
        num_edge_entries: 2,
        prev_text: "上一页",
        next_text: "下一页",
        ellipse_text: "...",
        link_to: "javascript:void(0)",
        callback: gonextpage,
        load_first_page: false
    });
    function gonextpage(new_page_index){
        getreps(new_page_index+1);
    }


    /////////////////添加repo列表
    function addrepohtml(repocon,iscooperatestate){
        ////////点赞；
        var starnum = '';
        getAjax( ngUrl+"/star_stat/"+iscooperatestate.repname,function(msg){
            starnum = msg.data.numstars;
        })
        ////////订购量；
        var subsnum = '';
        getAjax( ngUrl+"/subscription_stat/"+iscooperatestate.repname,function(msg){
            subsnum = msg.data.numsubs;
        })
        ////////下载量
        var pullnum = '';
        getAjax( ngUrl+"/transaction_stat/"+iscooperatestate.repname,function(msg){
            pullnum = msg.data.numpulls;
        })
        ////////////是否协作
        var thisiscooperatestat = '';
        var thiscoopername = '';
        //协作显示
        var ifcooper=true;
        var isdelerepo =  '<span class="isdelerepo" datarepoName="'+iscooperatestate.repname+'" datarepoisxiezuo="'+repocon.cooperateitems+'"></span>';
        if(iscooperatestate.cooperatestate == 'null' || iscooperatestate.cooperatestate == null || iscooperatestate.cooperatestate == 'undefined'){
            thisiscooperatestat = '';
        }else{
            thisiscooperatestat = '<span class="pricetype freetype reptoppr">'+iscooperatestate.cooperatestate+'</span>';
            if(iscooperatestate.cooperatestate=="协作中"){
            	ifcooper=false;
                var thiscreate_user = '';
                $.ajax({
                    url: ngUrl + "/users/"+repocon.create_user ,
                    type: "get",
                    cache: false,
                    async: false,
                    headers: {Authorization: "Token " + $.cookie("token")},
                    datatype: 'json',
                    success:function(json){
                        if(json.code == 0){
                            thiscreate_user = json.data.userName;
                        }
                    }

                });
                thiscoopername = '<div class="thiscoopername"><span>由&nbsp;'+thiscreate_user+'&nbsp;邀请协作</span></div>';
                isdelerepo =  '';
            }
        }
        ////////是否开放;
        var ispublic = '';
        var baimingdan = '';
        if(repocon.repaccesstype == 'public'){
            ispublic = '开放';
        }else{
            if(iscooperatestate.cooperatestate != "协作中"){
                var permissioncon = getpermission(iscooperatestate.repname,1,0);
                // console.log(permissioncon)
                if(permissioncon == 'null' || permissioncon == '' || permissioncon == 'undefined'){
                    baimingdan = '<p class="baimingdan" datareponame="'+iscooperatestate.repname+'">白名单管理（<span>0</span>）</p>';
                }else{
                    baimingdan = '<p class="baimingdan" datareponame="'+iscooperatestate.repname+'">白名单管理（<span>'+permissioncon.total+'</span>）</p>';
                }
                ispublic = '私有';
            }
        }
        var dataitemsalllist = '';
        if(repocon.dataitems){
            dataitemsalllist = 'itemdata="'+repocon.dataitems+'"';
        }else{
            dataitemsalllist = 'itemdata=""';
        }
        if(iscooperatestate.cooperatestate != "协作中") {
            var xizuozhe = '<p class="xiezuozhe ' + iscooperatestate.repname + '" datareponame="' + iscooperatestate.repname + '" dataispublic="' + repocon.repaccesstype + '">协作者管理（<span>0</span>）</p>';
            var cooperator = getcooperator(iscooperatestate.repname);
            if (cooperator == 'null' || cooperator == '' || cooperator == 'undefined' || cooperator == 'error') {
                xizuozhe = '<p class="xiezuozhe ' + iscooperatestate.repname + '" datareponame="' + iscooperatestate.repname + '" dataispublic="' + repocon.repaccesstype + '">协作者管理（<span>0</span>）</p>';
            } else {

                xizuozhe = '<p class="xiezuozhe ' + iscooperatestate.repname + '" datareponame="' + iscooperatestate.repname + '" dataispublic="' + repocon.repaccesstype + '">协作者管理（<span>' + cooperator.total + '</span>）</p>';
            }
        }
        var repotiems = getTimes(repocon.optime);
        //右侧rep
        var repright="";
        if(ifcooper){
        	repright="<div class='repright'>"+baimingdan+xizuozhe+"<p class='xiugairep' datareponame="+iscooperatestate.repname+">Repository修改</p></div>";
        }
        var repostr = '<div class="repo" >'+
            '<div class="describe" '+dataitemsalllist+'>'+
            isdelerepo+
            '<div class="left">'+
            '<div class="subtitle" id="'+iscooperatestate.repname+'"><span class="curreoName">'+iscooperatestate.repname+'</span></a>'+thisiscooperatestat+'</div>'+
            thiscoopername+
            '<div class="description"><p>'+repocon.comment+'</p></div>'+
            '<div class="subline">'+
            '<div class="icon">'+
            '<img data-original-title="更新时间" class="iconiamg1 iconiamg2" src="images/newpic004.png" data-toggle="tooltip" datapalecement="top">'+
            '<span 	data-original-title="'+repotiems.jdTime+'" data-toggle="tooltip" datapalecement="top">'+repotiems.showTime+'</span>'+
            '<img data-original-title="item量" class="iconiamg1" src="images/newpic005.png" data-toggle="tooltip" datapalecement="top"/>'+
            '<span>'+repocon.dataitems.length+'</span>'+
            '<img  class="iconiamg1" data-original-title="属性" src="images/sx.png" data-toggle="tooltip" datapalecement="top">'+
            '<span>'+ispublic+'</span>'+
                //'<img data-original-title="tag量" class="iconiamg1" src="images/tg.png" data-toggle="tooltip" datapalecement="top"/>'+
                //'<span>4</span>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div class="repcenter">'+
            '<div class="iconGroup">'+
            '<div class="like">'+
            '<img data-original-title="点赞量" style="" src="images/newpic001.png" data-toggle="tooltip" datapalecement="top" >'+
            '<span>'+starnum+'</span>'+
            '</div>'+
            '<div class="cart">'+
            '<img data-original-title="订购量" style="" src="images/newpic002.png" data-toggle="tooltip" datapalecement="top" >'+
            '<span>'+subsnum+'</span>'+
            '</div>'+
            '<div class="download">'+
            '<img data-original-title="下载量" style="" src="images/newpic003.png" data-toggle="tooltip" 	datapalecement="top">'+
            '<span>'+pullnum+'</span>'+
            '</div>'+
            '</div>'+
            '</div>'+
            repright
            '</div>'+
            '</div>';
        $('.repList').append(repostr);
        $(function(){
            $('[data-toggle="tooltip"]').tooltip();
        })
    }
    //////////////查看repo下的item
    $(document).on('click','.describe',function (e) {
    	var thisrepName = $(this).find('.curreoName').html();
        if ((e.target.className.indexOf("isdelerepo")<0 && e.target.className.indexOf("baimingdan")<0 && e.target.className.indexOf("xiezuozhe")<0 && e.target.className.indexOf("xiugairep")<0)) {
            if ($(this).siblings('.tablelist').length <= 0) {
                var thisitems = $(this).attr('itemdata');
                var itemstr = ' <div class="tablelist">' +
                    ' <div class="dtable">' +
                    ' <div class="dhead">' +
                    ' <span class="col1"><b>DataItem name</b></span>' +
                    ' <span class="col2"><b>更新时间</b></span>' +
                    ' <span class="col3"><b>属性</b></span>' +
                    ' <span class="col4"><b>Tag数量</b></span>' +
                    ' </div>' +
                    ' <div class="dbody">';
                //////////////////添加item列表;
                if(thisitems){
                    var itemsarr = thisitems.split(",");
                    var thisrepName = $(this).find('.curreoName').html();
                    for (var i = 0; i < itemsarr.length; i++) {
                        $.ajax({
                            url: ngUrl + "/repositories/" + thisrepName + "/" + itemsarr[i],
                            type: "get",
                            cache: false,
                            async: false,
                            headers: {Authorization: "Token " + $.cookie("token")},
                            success: function (json) {
                                if (json.code == 0) {
                                    var itemtimes = getTimes(json.data.optime);
                                    var ispublic = '';
                                    if (json.data.itemaccesstype == 'public') {
                                        ispublic = '开放';
                                    } else {
                                        ispublic = '私有';
                                    }
                                    var thisiscooperatestat = '';
                                    var thisiscooperatestatname = '';
                                    if (json.data.cooperatestate == 'null' || json.data.cooperatestate == null || json.data.cooperatestate == '') {
                                        thisiscooperatestat = '';
                                    } else {
                                        thisiscooperatestat = '<strong class="xzbox">' + json.data.cooperatestate + '</strong>';
                                        if(json.data.cooperatestate == '协作'){
                                            $.ajax({
                                                url: ngUrl + "/users/"+json.data.create_user ,
                                                type: "get",
                                                cache: false,
                                                async: false,
                                                headers: {Authorization: "Token " + $.cookie("token")},
                                                datatype: 'json',
                                                success:function(json){
                                                    if(json.code == 0){
                                                        thisiscooperatestatname = '<br/><br/><b class="thisiscooperatestatname">由&nbsp;'+json.data.userName+'&nbsp;协作</b>'
                                                    }
                                                }

                                            });
                                        }


                                    }
                                    var thisispricestate = ''
                                    if (json.data.pricestate == 'null' || json.data.pricestate == null || json.data.pricestate == '') {
                                        thisispricestate = '';
                                    } else {
                                    	if(json.data.pricestate=='付费'){
                                    		thisispricestate = '<strong class="pricetype freetype" style="color:red;border:1px solid red">' + json.data.pricestate + '</strong>'
                                    	}else{
                                    		thisispricestate = '<strong class="pricetype freetype">' + json.data.pricestate + '</strong>'
                                    	}
                                       
                                    }
                                    itemstr += ' <div class="row">' +
                                        ' <span class="col1"><a target="_blank" href="myItemDetails.html?repname='+thisrepName+'&itemname='+itemsarr[i]+'">' + itemsarr[i] + '</a>' + thisiscooperatestat + thisispricestate +thisiscooperatestatname+'</span>' +
                                        ' <span class="col2" title="">' + itemtimes.showTime + '</span>' +
                                        ' <span class="col3">' + ispublic + '</span>' +
                                        ' <span class="col4">' + json.data.tags + '</span>' +
                                        ' </div>';
                                }
                            },
                            error: function (json) {
                                errorDialog($.parseJSON(json.responseText).code);
                                $('#errorDM').modal('show');
                            }
                        });
                    }
                }
                itemstr += ' </div>' +
                    ' <div class="dtail">' +
                    ' <a class="icon2wrop" href="myItems.html?repname='+ thisrepName +'">查看更多</a>' +
                    ' </div>' +
                    ' </div>' +
                    ' </div>';
                $(this).after(itemstr).hide().slideDown(600);
            }else{
                $(this).siblings('.tablelist').slideToggle(600)
            }
        }
    })

////////////////////////////////全选repo////////////////////////
//    $("#select_all_rep").click(function(){
//        if(this.checked){
//            $(".checkrepo").each(function() {
//                $(this).prop("checked", true);
//            });
//        }else{
//            $(".checkrepo").each(function() {
//                $(this).prop("checked", false);
//            });
//        }
//    });

////////////////////////////////////得到白名单
    function getpermission(repopermission,pages,isdelhtml){
        var  permission = '';
        $.ajax({
            url: ngUrl + "/permission/"+repopermission+"?page="+pages+"&size=6",
            type: "get",
            cache: false,
            async: false,
            dataType: 'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                total=json.data.total;
                if (json.code == 0) {
                    permission = json.data;
                    addpomitionhtml(permission,isdelhtml);
                }
                return permission;
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    // $('.baimingdan').html('白名单管理（0）')
                }

            }
        });
        return permission;

    }
    //////////////////////////////////得到协作者名单
    function getcooperator(repopermission){
        var  permission = '';
        $.ajax({
            url: ngUrl + "/permission/"+repopermission+"?&size=-1&cooperator=1",
            type: "get",
            cache: false,
            async: false,
            dataType: 'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (json) {
                if (json.code == 0) {
                    permission = json.data;
                    //addcooperatorhtml(permission);
                }
                return permission;
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                     permission = 'error';
                }
                return permission;
            }
        });
        return permission;

    }
    //////////////////////////////////填充白名单列表
    function addpomitionhtml(thispermissioncon,isdelhtml){

        $('#modalRep_list').empty();
        $(".cooperatorpomitionList").empty();
        var len = thispermissioncon.permissions.length;
        for (var i = 0; i < len; i++) {
            var isdelhtml = isdelhtml;
            var delthispomition;
            if(isdelhtml == 0){
                delthispomition = '<div class="delthispomition"><a class="deleteTest" href="javaScript:void(0)"; datareponame="'+ thispermissioncon.permissions[i].username +'">[删除]</a></div>'
            }else{
                delthispomition = ''
            }
            var thisstr = "<div class='pomosionList' datareponame='"+ thispermissioncon.permissions[i].username +"'>"+
                "<div class='pomosionListcon'>"+
                "<input class='ischeck' style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + thispermissioncon.permissions[i].username + "</input></div>"+delthispomition+
                "</div>"
            $("#modalRep_list").append(thisstr);
            $(".cooperatorpomitionList").append(thisstr)
        }



    }
    //////////////////////////////////填充协作者列表
    function addcooperatorhtml(thispermissioncon){
        $('.cooperator_list').empty();
        if(thispermissioncon.permissions){
            var len = thispermissioncon.permissions.length;
            if(len>0){
                for (var i = 0; i < len; i++) {
                    var thisstr = "<div class='pomosionList' datareponame='"+ thispermissioncon.permissions[i].username +"'>"+
                        "<div class='pomosionListcon'>"+
                        "<input class='ischeck' style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + thispermissioncon.permissions[i].username + "</input></div>"+
                        '<div class="delthispomition"><a class="delecooperator" href="javaScript:void(0)"; datareponame="'+ thispermissioncon.permissions[i].username +'">[删除]</a></div>'+
                        "</div>"
                    $(".cooperator_list").append(thisstr);
                }
            }
        }

    }
    ///////////////////////////////////////////白名单分页
    function getpagesF(thisrepoName,pages,isdelhtml){
        $('#modalRep_list').empty();
        $('.cooperatorpomitionList').empty();
        var thispermissioncon = getpermission(thisrepoName,pages,isdelhtml);
        var total = thispermissioncon.total;
        $(".pagesPer").pagination(total, {
            items_per_page: 6,
            num_display_entries: 3,
            num_edge_entries:2,
            prev_text: "上一页",
            next_text: "下一页",
            ellipse_text: "...",
            link_to: "javascript:void(0)",
            callback: Fens,
            load_first_page: false
        });
        $(".pagescooperator").pagination(total, {
            items_per_page: 6,
            num_display_entries: 3,
            num_edge_entries: 2,
            prev_text: "上一页",
            next_text: "下一页",
            ellipse_text: "...",
            link_to: "javascript:void(0)",
            callback: Fens1,
            load_first_page: false
        });
    }
    function Fens(new_page_index){
        var thisrepoName =  $('#myModalTest').attr('modal-repoName') || $('.cooperatorpomitionList').attr('modal-repoName')
        getpermission(thisrepoName,new_page_index+1,0);
    }
    function Fens1(new_page_index){
        var thisrepoName =  $('#myModalTest').attr('modal-repoName') || $('.cooperatorpomitionList').attr('modal-repoName')
        getpermission(thisrepoName,new_page_index+1,1);
    }

////////////////////////////////////////管理白名单
    $(document).on('click','.baimingdan',function () {
        $('#modalRep_list').empty();
        var thisrepoName = $(this).attr('datareponame');
        $('#myModalTest').attr('modal-repoName',thisrepoName);
        getpagesF(thisrepoName,1,0);
        $('#myModalTest').modal('toggle');

    })
    ////////////////////////////////协作者添加列表

    $(document).on('click','.xiezuozhe',function () {
        $('.cooperator_list').empty();
        var dataispublic = $(this).attr('dataispublic');
        var thisrepoName = $(this).attr('datareponame');
        var thiscooperatorcon = getcooperator(thisrepoName)
        $('.cooperator_list').attr('modal-repoName',thisrepoName);
        addcooperatorhtml(thiscooperatorcon);

        $('.cooperatorpomitionList').empty();
        var thisrepoName = $(this).attr('datareponame');
        $('.cooperatorpomitionList').attr('modal-repoName',thisrepoName);
        getpagesF(thisrepoName,1,1);
        if(dataispublic == 'public'){
            $('#pwublicalertbox').modal('toggle');
            $('#pwublicalertbox').attr('modal-repoName',thisrepoName)
        }else{
            $('.cooperator_list').attr('modal-repoName',thisrepoName)
            $('#privatealertbox').modal('toggle');
        }

    })
//////////////////////////////////新增白名单//////////////////////////////////
    function addpomitionorcoo(username,errorobj,tihsreponame,ispublic){
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var userjson = {};
        if(username == ''){
            $(errorobj).html('请输入邮箱').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
            return false;
        }else if(!filter.test(username)){
            $(errorobj).html('您输入的邮箱格式不正确，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkloginusers(username) == 1){
            $(errorobj).html('您输入的邮箱不存在，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if($.cookie("tname") == username){
            $(errorobj).html('不能添加自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else{
            if(ispublic == 'public'){
                userjson = {
                    "username":username,
                    "opt_permission":1
                }
            }else{
                if(checkname(tihsreponame,username) == 2){
                    $(errorobj).html('已添加该用户').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                    return false;
                }
                userjson = {
                    "username":username
                }
            }
            $.ajax({
                type:"put",
                url:ngUrl+"/permission/"+tihsreponame,
                cache:false,
                dataType:'json',
                async:false,
                headers:{ Authorization:"Token "+$.cookie("token") },
                data:JSON.stringify(userjson),
                success: function(adduser){
                    if(ispublic == 'public'){
                        var thiscooperatorcon = getcooperator(tihsreponame);
                        $("."+tihsreponame).html("协作者管理（"+thiscooperatorcon.total+"）");
                        if($('#'+tihsreponame).find('.pricetype').length <= 0 && thiscooperatorcon.total>0){
                            var thisiscooperatestat = '<span class="pricetype freetype reptoppr">协作</span>';
                            $('#'+tihsreponame).append(thisiscooperatestat)
                        }
                        addcooperatorhtml(thiscooperatorcon);

                    }else{
                        $(errorobj).html('成功添加白名单').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
                        getpagesF(tihsreponame,1,0);
                        perTong(tihsreponame,"add",1); //同步数字
                    }
                }
            });
        }
    }
    $('#inList').click(function(event) {
        /* Act on the event */
        var thisrepoName =  $('#myModalTest').attr('modal-repoName');
        var username = $.trim($('#emailTest').val());
        addpomitionorcoo(username,'#mess',thisrepoName,'privet');
    });

///////////////////////////////////////////////////公开repo添加白名单
    $('#cooperatorinList').click(function(){
        var thisrepoName =  $('#pwublicalertbox').attr('modal-repoName');
        var username = $.trim($('#cooperatoremailTest').val());
        addpomitionorcoo(username,'#messcooperatorpublic',thisrepoName,'public');

    })

//////////////////搜索白名单//////////////////////////////////////////////////
    $('#seList').click(function(){
        var curusername = $.trim($('#emailTest').val());
        var thisrepoName =  $('#myModalTest').attr('modal-repoName');
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(curusername == ''){
            $('#mess').html('请输入邮箱').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
            return false;
        }else if(!filter.test(curusername)){
            $('#mess').html('您输入的邮箱格式不正确，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkloginusers(curusername) == 1){
            return false;
        }else if($.cookie("tname") == curusername){
            $('#mess').html('不能查找自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+thisrepoName +'?username='+curusername,
            cache: false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0){
                    if(datas.data.permissions.length > 0){
                        var thisstr = "<div class='pomosionList' datareponame='"+ datas.data.permissions[0].username +"'>"+
                            "<div class='pomosionListcon'>"+
                            "<input class='ischeck' style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + datas.data.permissions[0].username + "</input></div>"+
                            '<div class="delthispomition"><a class="deleteTest" href="javaScript:void(0)"; datareponame="'+ datas.data.permissions[0].username +'">[删除]</a></div>'+
                            "</div>"
                        $("#modalRep_list").empty().append(thisstr);
                        $('.gobackbtnwrop').show();
                        $(".pagesPer").pagination(0, {
                            items_per_page:6,
                            num_display_entries: 3,
                            num_edge_entries: 2 ,
                            prev_text:"上一页",
                            next_text:"下一页",
                            ellipse_text:"...",
                            link_to:"javascript:void(0)",
                            callback:Fens,
                            load_first_page:false
                        });
                    }
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    $('#mess').html('该用户不在白名单').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                }

            }
        });

    })
//////////////////////////私有repo白名单收索
    $('#searchpomisionemailTest').click(function(){
        var curusername = $.trim($('#privatepomisionemailTest').val());
        var thisrepoName =  $('.cooperatorpomitionList').attr('modal-repoName');
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(curusername == ''){
            $('#messcooperatorprivate').html('请输入邮箱').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
            return false;
        }else if(!filter.test(curusername)){
            $('#messcooperatorprivate').html('您输入的邮箱格式不正确').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkloginusers(curusername) == 1){
            $('#messcooperatorprivate').html('您输入的邮箱不存在，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if($.cookie("tname") == curusername){
            $('#messcooperatorprivate').html('不能搜索自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+thisrepoName +'?username='+curusername,
            cache: false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0){
                    if(datas.data.permissions.length > 0){
                        var thisstr = "<div class='pomosionList' datareponame='"+ datas.data.permissions[0].username +"'>"+
                            "<div class='pomosionListcon'>"+
                            "<input class='ischeck' style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + datas.data.permissions[0].username + "</input></div>"+
                            "</div>"
                        $(".cooperatorpomitionList").empty().append(thisstr);
                        $('.gobackbtnwropcoo').show();
                        $(".pagescooperator").pagination(0, {
                            items_per_page:6,
                            num_display_entries: 3,
                            num_edge_entries: 2 ,
                            prev_text:"上一页",
                            next_text:"下一页",
                            ellipse_text:"...",
                            link_to:"javascript:void(0)",
                            callback:Fens,
                            load_first_page:false
                        });
                    }
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    $('#mess').html('该用户不在白名单').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                }

            }
        });

    })
    /////////////////////////////////开放协作者搜索//////////////////////////////////////////////////
    $('#cooperatorseList').click(function(){
        var curusername = $.trim($('#cooperatoremailTest').val());
        var thisrepoName =  $('#pwublicalertbox').attr('modal-repoName');
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(curusername == ''){
            $('#messcooperatorpublic').html('请输入邮箱').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
            return false;
        }else if(!filter.test(curusername)){
            $('#messcooperatorpublic').html('您输入的邮箱格式不正确，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkloginusers(curusername) == 1){
            $('#messcooperatorpublic').html('您输入的邮箱不存在，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if($.cookie("tname") == curusername){
            $('#messcooperatorpublic').html('不能搜索自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+thisrepoName +'?username='+curusername+'&cooperator=1',
            cache: false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0){
                    if(datas.data.permissions.length > 0){
                        var thisstr = "<div class='pomosionList' datareponame='"+ datas.data.permissions[0].username +"'>"+
                            "<div class='pomosionListcon'>"+
                            "<input class='ischeck' style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + datas.data.permissions[0].username + "</input></div>"+
                            '<div class="delthispomition"><a class="delecooperator" href="javaScript:void(0)"; datareponame="'+ datas.data.permissions[0].username +'">[删除]</a></div>'+
                            "</div>"
                        $(".cooperator_listpublic").empty().append(thisstr);
                        $('.publicgobackbtnwrop').show();
                        $('.gobackcooperator').show();
                    }else{
                        $('#messcooperatorpublic').html('该用户不在协作者名单').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                    }
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    $('#messcooperatorpublic').html('该用户不在协作者名单').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                }

            }
        });
    })
    $('.publicgobackbtnwrop').click(function(){
        $('.cooperator_listpublic').empty();
        var thisrepoName =  $('#pwublicalertbox').attr('modal-repoName');
        var thiscooperatorcon = getcooperator(thisrepoName);
        addcooperatorhtml(thiscooperatorcon);
        $(this).hide();

    })
    /////////////////////////////////私有协作者搜索//////////////////////////////////////////////////
    $('#searchcooperatoremailTest').click(function(){
        var curusername = $.trim($('#privatecooperatoremailTest').val());
        var thisrepoName =  $('.privatecooperList').attr('modal-repoName');
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(curusername == ''){
            $('#messcooperatorprivate1').html('请输入邮箱').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
            return false;
        }else if(!filter.test(curusername)){
            $('#messcooperatorprivate1').html('您输入的邮箱格式不正确').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkloginusers(curusername) == 1){
            $('#messcooperatorprivate1').html('您输入的邮箱不存在，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if($.cookie("tname") == curusername){
            $('#messcooperatorprivate1').html('不能搜索自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+thisrepoName +'?username='+curusername+'&cooperator=1',
            cache: false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0){
                    if(datas.data.permissions.length > 0){
                        var thisstr = "<div class='pomosionList' datareponame='"+ datas.data.permissions[0].username +"'>"+
                            "<div class='pomosionListcon'>"+
                            "<input class='ischeck' style='margin-left:10px;margin-right:6px;' type='checkbox' name='users'>" + datas.data.permissions[0].username + "</input></div>"+
                            "</div>"
                        $(".privatecooperList").empty().append(thisstr);
                        $('.privategobackbtnwrop').show();
                        $('.gobackprivatecooperList').show();
                    }
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    //$('#messcooperatorpublic').html('该用户不在白名单').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                }

            }
        });
    })
    $('.gobackprivatecooperList').click(function(){
        $('.privatecooperList').empty();
        var thisrepoName =  $('.privatecooperList').attr('modal-repoName');
        var thiscooperatorcon = getcooperator(thisrepoName);
        addcooperatorhtml(thiscooperatorcon);
        $(this).hide();
    })
//////////////////////////////批量添加协作者/////////////////////////////////////////////////
    $('#addpricoo').click(function(){
        var thisrepoName =  $('.cooperatorpomitionList').attr('modal-repoName');
        var thisusername = [];
        var lilist = $('.cooperatorpomitionList>div');
        for(var i = 0;i<lilist.length;i++){
            var namejson = {}
            if($('.cooperatorpomitionList>div').eq(i).find('.ischeck').is(':checked')==true){
                var thisval = $(lilist[i]).attr("datareponame");
                namejson['username'] = thisval;
                namejson['opt_permission'] = 1;
                thisusername.push(namejson);
            }


        }
        if(thisusername.length>0){
        	var count=0;
            for(var j = 0; j<thisusername.length;j++){
               // alert(j)
            	count++;
                $.ajax({
                    type:"put",
                    url:ngUrl+"/permission/"+thisrepoName,
                    cache:false,
                    dataType:'json',
                    data:JSON.stringify(thisusername[j]),
                    headers:{ Authorization:"Token "+$.cookie("token") },
                    success: function(deluser){
                        if(deluser.code == 0){
                            var thiscooperatorcon = getcooperator(thisrepoName);
                            addcooperatorhtml(thiscooperatorcon);
                            if($('#'+thisrepoName).find('.pricetype').length <= 0 && thiscooperatorcon.total>0){
                                var thisiscooperatestat = '<span class="pricetype freetype reptoppr">协作</span>';
                                $('#'+thisrepoName).append(thisiscooperatestat)
                            }
                            $('.'+thisrepoName).html('协作者管理（'+thiscooperatorcon.total +'）');
                            
                        }
                    }
                })
            };

            //perTongXie(thisrepoName,"add",count);
            
        }

    })

////////////////////////////////////////////////////////////////批量删除白名单
    $('#delCurrent').click(function(){
        var thisrepoName =  $('#myModalTest').attr('modal-repoName');
        var thisusername = [];
        var isdele = false;
        var namejson = {}
        var lilist = $('#modalRep_list>div');
        for(var i = 0;i<lilist.length;i++){
            if($('#modalRep_list>div').eq(i).find('.ischeck').is(':checked')==true){
                var thisval = $(lilist[i]).attr("datareponame");
                namejson[$('#modalRep_list>div').eq(i).index()] = thisval;
                thisusername.push(thisval);
            }
        }
        if(thisusername.length>0){
        	var perCount=0;
            for(var j in namejson){
            	perCount++;
                $.ajax({
                    type:"DELETE",
                    url:ngUrl+"/permission/"+thisrepoName+"/whitelist/"+namejson[j],
                    cache:false,
                    dataType:'json',
                    headers:{ Authorization:"Token "+$.cookie("token") },
                    success: function(deluser){
                        if(deluser.code == 0){
                            $('#modalRep_list').empty();
                            isdele = true;
                            $('.gobackbtnwrop').hide();
                            getpagesF(thisrepoName,1,0);
                        }
                    }
                })
            };
            if(isdele = true){
                $('#mess').html('删除成功').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
                perTong(thisrepoName,"del",perCount);
            }
        }
    })
////////////////////////////////////////////////////////////////批量删私有除协作者
    $('#cooperatordelCurrent').click(function(){
        var thisrepoName =  $('.cooperator_list').attr('modal-repoName');
        var thisusername = [];
        var isdele = false;
        var namejson = {}
        var lilist = $('.privatecooperList>div');
        for(var i = 0;i<lilist.length;i++){
            if($('.privatecooperList>div').eq(i).find('.ischeck').is(':checked')==true){
                var thisval = $(lilist[i]).attr("datareponame");
                namejson[$('.privatecooperList>div').eq(i).index()] = thisval;
                thisusername.push(thisval);
            }
        }
        if(thisusername.length>0){
        	var count=0;
            for(var j in namejson){
            	count++;
                $.ajax({
                    type:"DELETE",
                    url:ngUrl+"/permission/"+thisrepoName+"/cooperator/"+namejson[j],
                    cache:false,
                    dataType:'json',
                    headers:{ Authorization:"Token "+$.cookie("token") },
                    success: function(deluser){
                        if(deluser.code == 0){
                            $('.privatecooperList').empty();
                            var thiscooperatorcon = getcooperator(thisrepoName);
                            addcooperatorhtml(thiscooperatorcon);
                            if(thiscooperatorcon == 'error'){
                                if($('#'+thisrepoName).find('.pricetype').length > 0){
                                    $('#'+thisrepoName).find('.pricetype').remove();
                                }
                                $("."+thisrepoName).html("协作者管理（0）");

                            }else{
                                $("."+thisrepoName).html("协作者管理（"+thiscooperatorcon.total+"）");
                            }
                        }
                    }
                })
            };
            if(isdele = true){
                //$('#mess').html('删除成功').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
            	 perTongXie(thisrepoName,"del",count);
            }
        }
    })
    ////////////////////////////////////////////////////////////////批量删开放除协作者
    $('#cooperatordelCurrentpublic').click(function(){
        var thisrepoName =  $('.cooperator_list').attr('modal-repoName');
        var thisusername = [];
        var isdele = false;
        var namejson = {}
        var lilist = $('.cooperator_listpublic>div');
        for(var i = 0;i<lilist.length;i++){
            if($('.cooperator_listpublic>div').eq(i).find('.ischeck').is(':checked')==true){
                var thisval = $(lilist[i]).attr("datareponame");
                namejson[$('.cooperator_listpublic>div').eq(i).index()] = thisval;
                thisusername.push(thisval);
            }
        }
        if(thisusername.length>0){
        	var count=0;
            for(var j in namejson){
            	count++;
                $.ajax({
                    type:"DELETE",
                    url:ngUrl+"/permission/"+thisrepoName+"/cooperator/"+namejson[j],
                    cache:false,
                    dataType:'json',
                    headers:{ Authorization:"Token "+$.cookie("token") },
                    success: function(deluser){
                        if(deluser.code == 0){
                            $('.cooperator_listpublic').empty();
                            var thiscooperatorcon = getcooperator(thisrepoName);
                            if(thiscooperatorcon == 'error'){
                                $("."+thisrepoName).html("协作者管理（0）");
                                if($('#'+thisrepoName).find('.pricetype').length > 0){
                                    $('#'+thisrepoName).find('.pricetype').remove();
                                }
                            }else{
                                $("."+thisrepoName).html("协作者管理（"+thiscooperatorcon.total+"）");
                            }
                            addcooperatorhtml(thiscooperatorcon);
                        }
                    }
                })
            };
            if(isdele = true){
            	perTongXie(thisrepoName,"del",count);
                //$('#mess').html('删除成功').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
            }
        }
    })
/////////////////////////////////////////////////////////////////清空白名单
    function delallpomitionorcoop(repname,iscoo,boxobj,pagesobj){
        $.ajax({
            type:"DELETE",
            url:ngUrl+"/permission/"+repname+'/'+iscoo+"/username?delall=1",
            cache:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function(deluser){
                if(deluser.code == 0){
                    if(iscoo == 'whitelist'){
                        $(boxobj).empty();
                        $(pagesobj).pagination(0, {
                            items_per_page: 6,
                            num_display_entries: 3,
                            num_edge_entries: 2 ,
                            prev_text:"上一页",
                            next_text:"下一页",
                            ellipse_text:"...",
                            link_to:"javascript:void(0)",
                            callback:Fens,
                            load_first_page:false
                        });
                    }else{
                        $(boxobj).empty();
                    }
                }
            }
        });
    }
    //////////////////////////////////////////清空白名单
    $('#delAll').click(function(){
        var thisrepoame = $('#myModalTest').attr('modal-repoName');
        delallpomitionorcoop(thisrepoame,'whitelist','.namelist','.pagesPer');
        perTong(thisrepoame,"del",0);
    })
    //////////////////////////////////////////清空私有协作者
    $('#cooperatordelAllpri').click(function(){
        var thisrepoame = $('.cooperator_list').attr('modal-repoName');
        delallpomitionorcoop(thisrepoame,'cooperator','.cooperator_list');
        if($('#'+thisrepoame).find('.pricetype').length > 0){
            $('#'+thisrepoame).find('.pricetype').remove();
        }
        perTongXie(thisrepoame,"del",0);
    })
    //////////////////////////////////////////清空公开协作者
    $('#cooperatordelAll').click(function(){
        var thisrepoame = $('.cooperator_list').attr('modal-repoName');
        delallpomitionorcoop(thisrepoame,'cooperator','.cooperator_list');
        if($('#'+thisrepoame).find('.pricetype').length > 0){
            $('#'+thisrepoame).find('.pricetype').remove();
        }
        $("."+thisrepoame).html("协作者管理(0)");
        perTongXie(thisrepoame,"del",0);
    })
////////////////////////////////////////////////////////////////单个删除白名单
    function delonepomitionorcoo(thisrepoName,thisusername,iscoo){
        $.ajax({
            type:"DELETE",
            url:ngUrl+"/permission/"+thisrepoName+"/"+iscoo+"/"+thisusername,
            cache:false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function(deluser){
                if(deluser.code == 0){
                    if(iscoo == 'whitelist'){
                        $('.gobackbtnwrop').hide();
                        $('#mess').html('删除成功').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
                        getpagesF(thisrepoName,1,0);
                        perTong(thisrepoName,"del",1); //同步数字
                    }else{
                        var thiscooperatorcon = getcooperator(thisrepoName);
                        if(thiscooperatorcon == 'error'){
                            $("."+thisrepoName).html("协作者管理（0）");
                            if($('#'+thisrepoName).find('.pricetype').length > 0){
                                $('#'+thisrepoName).find('.pricetype').remove();
                            }
                        }else{
                            $("."+thisrepoName).html("协作者管理（"+thiscooperatorcon.total+"）");
                        }

                        perTongXie(thisrepoName,"del",1);
                       // addcooperatorhtml(thiscooperatorcon);
                    }
                }
            }
        });
    }
    $(document).on('click','.deleteTest',function(){
        var thisusername = $(this).attr('datareponame');
        var thisrepoName =  $('#myModalTest').attr('modal-repoName');
        var _this = $(this);
        delonepomitionorcoo(thisrepoName,thisusername,'whitelist');

    })

    $(document).on('click','.delecooperator',function(){
        var thisusername = $(this).attr('datareponame');
        var thisrepoName =  $('.cooperator_list').attr('modal-repoName');
        var _this = $(this);
        delonepomitionorcoo(thisrepoName,thisusername,'cooperator');
        _this.parents('.pomosionList').remove();

    })

//////////////////////////返回按钮
    $('.gobackbtnwrop').click(function(){
        $('.namelist').empty();
        var thisrepoName =  $('#myModalTest').attr('modal-repoName');
        getpagesF(thisrepoName,1,0);
        $(this).hide();
    })
//////////
    $('.gobackcooperator').click(function(){
        $('.cooperatorpomitionList').empty();
        var thisrepoName =  $('.cooperatorpomitionList').attr('modal-repoName');
        getpagesF(thisrepoName,1,0);
        $(this).hide();
    })

///////////////////////////////验证是否已经添加该用户/////////////////////////////////
    function checkname(repname,curusername){
        var iscurname = 1;
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+repname +'?username='+curusername,
            cache: false,
            async:false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0 && datas.data.permissions.length>0){
                    if(datas.data.permissions[0].username == curusername){
                        iscurname = 2;
                    }
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    iscurname = 1;
                }

            }
        });
        return iscurname;
    }
///////////////////////////////验证用户已经注册/////////////////////////////////
    function checkloginusers(loginusers){
        var isloginusers = 1;
        $.ajax({
            url: ngUrl + "/users/"+loginusers ,
            type: "get",
            cache: false,
            async: false,
            headers: {Authorization: "Token " + $.cookie("token")},
            datatype: 'json',
            success:function(json){
                if(json.code == 0){
                    isloginusers = 2;
                }
            },
            error:function (json)
            {
                if(json.status == 400){
                    $('#mess').html('您输入的邮箱不存在，请重新输入').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                }

            }
        });
        return isloginusers;
    }
////////////////////////修改白名单//////////////////////////////

    $(document).on('click','.xiugairep',function(e) {
        var thisusername = $(this).attr('datareponame');
        $("#addRep .submit input").attr("repevent", "edit");
        $("#addRep .head .title").text("修改Repository");
        $("#addRep .repname .value input").attr("disabled", "disabled");
        $("#addRep .repname .key .promt").hide();
        $("#addRep .repname .value input").val(thisusername);
        $('.xiugaireperror').hide();
        $.ajax({
            url: ngUrl+"/repositories/"+thisusername,
            type: "GET",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(json.code == 0){
                    //转换中英私有和开放
                    if(json.data.repaccesstype=="public")
                    {
                        // $("#addRep .property .value p").text("开放");
                        $("#ispublic").attr('data-tagle',1)
                        $("#ispublic").val(1);
                        // $("#ListManagement").css("display","none");
                    }
                    if(json.data.repaccesstype=="private")
                    {
                        // $("#addRep .property .value p").text("私有");
                        $("#ispublic").attr('data-tagle',2)
                        $("#ispublic").val(2);
                        // $("#ListManagement").css("display","block");
                    }
                    $("#addRep .repcomment .value textarea").val(json.data.comment);
                    $("#ListManagement p span:first").empty();

                }
            }
        });
        $('#ispublic').attr("disabled",false);
        $('#addRep').modal('toggle');
        stopEventStrans(e);
    });

////////////////////////提交修改//////////////////////////////
function postrepo(){

}
    $("#addRep .submit input").click(function(){
        var method = "POST";
        var data = {};
        var thisispublic = '';
        repname = $.trim($("#addRep .repname .value input").val());
        data["comment"] = $.trim($("#addRep .repcomment .value textarea").val());
        if($("#ispublic").val()==1) {
            data["repaccesstype"] ="public";
            thisispublic = '开放';
        }
        else {
            data["repaccesstype"] ="private";
            thisispublic = '私有';
        }

        if($(this).attr("repevent") == "add") {
            if(repname == '' || repname == '不能为空，52个字符以内，仅限使用英文字母、数字和"_"'){
                $('#addalertbox').html('Repository名称不能为空').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                return;
            }
            if(repname.search(/^[a-zA-Z0-9_]+$/) < 0) {
                $('#addalertbox').html('52个字符以内，仅限使用英文字母、数字和"_"').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                return;
            }else if(repname.length > 52){
                $('#addalertbox').html('Repository名称太长，限制52个字符').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                return;
            }
            method = "POST";
        }else {
            method = "PUT";
        }
        if(data.comment == '' || data.comment == '200字以内'){
            $('#addalertbox').html('Repository描述不能为空').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return;
        }
        if(data.comment.replace(/[^\x00-\xff]/g, '__').length > 400) {
            $('#addalertbox').html('Repository描述太长').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return;
        }
        var isreturnback = true;
        $.ajax({
            url: ngUrl+"/repositories/"+repname,
            type: method,
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            data:JSON.stringify(data),
            headers:{ Authorization:"Token "+$.cookie("token") },
            beforeSend:function(){
                $('#addRep .submit input').attr('disabled','disabled');
                $('#addRep .submit input').val("正在保存中");
            },
            complete:function(){
                $('#addRep .submit input').removeAttr('disabled');
                $('#addRep .submit input').val("提交");
            },
            success:function(json){
                if(json.code == 0){
                    isreturnback = true;
                    location.reload();
                }
            }, error:function (json)
            {
                isreturnback = false;
                if(json.status == 400){
                    if($.parseJSON(json.responseText).code==1012){
                        $('.ispublicrepo').html(thisispublic);
                        $('.xiugaireperror').show();
                    }else if($.parseJSON(json.responseText).code==1008){
                        $('#addalertbox').html('Repository名称重复').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                        return;
                    }else{
                        $('#addalertbox').html("您创建的"+repname+"有误,请重新创建").addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                        return;
                    }
                }

            }
        });
        if(isreturnback == false){
            return;
        }
        $('#addRep').modal('toggle');
        $('.xiugaireperror').hide();
    });
    $('#ispublic').change(function(){
        var dataTagle = $(this).attr('data-tagle');
        var thisloginname = $.cookie("tname");
        var thisval = $(this).val();
        $.ajax({
            url: ngUrl+"/quota/"+thisloginname+"/repository",
            type:"get",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            ContentType: 'application/json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(thisval == 1){
                    if(parseInt(json.data.quotaPublic) <= parseInt(json.data.usePublic) && thisval != dataTagle){
                       $('.ispublicrepo').html('开放');
                        $('.xiugaireperror').show();
                        $('#ispublic').val(1);
                    }else{
                        $('.xiugaireperror').hide();
                    }
                }else if(thisval == 2){
                    if(parseInt(json.data.quotaPrivate) <= parseInt(json.data.usePrivate) && thisval != dataTagle){
                        $('.ispublicrepo').html('私有');
                        $('.xiugaireperror').show();
                        $('#ispublic').val(0);
                    }else{
                        $('.xiugaireperror').hide();
                    }
                }

            }
        });
    })


/////////////////添加repo按钮///////////////////
    $(".add-icon").click(function() {
        var display=$("#judgment").css("display");
        if(display=="none")
        {
            $("#judgment").css("display","block");
        }
        if(display=="block")
        {
            $("#judgment").css("display","none");
        }
        $("#judgment_number").css("display","none");

    });

//////////////////开放repo//////////////////////
    $("#openRepo").click(function(){
        //判断是否有配额数
        $('.xiugaireperror').remove();
        $.ajax({
            url: ngUrl+"/quota/"+$.cookie("tname")+"/repository",
            type:"get",
            cache:false,
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(data){
                var usePublic=data.data.usePublic;
                var quotaPublic=data.data.quotaPublic;
                var uq_public=quotaPublic-usePublic;

                if(uq_public>0)
                {
                    $("#addRep .submit input").attr("repevent", "add");
                    $("#addRep .head .title").text("新增Repository");
                    $("#addRep .repname .value input").removeAttr("disabled");
                    $("#addRep .repname .value input").val("");
                    $("#addRep .repcomment .value textarea").val("");
                    $("#addRep .repname .key .promt").show();
                    $('#ispublic').attr("disabled",true);
                    $('#addRep').modal('toggle');
                    // $("#addRep .property .value p").text("开放");
                    $("#ispublic").val(1);
                    $("#judgment").css("display","none");
                    // $("#ListManagement").css("display","none");
                }else {
                    $("#judgment_number").css("display","block");
                    $("#judgment").css("display","none");
                }
            }

        });
    });
///////////////////////////新增私有repo///////////////////////////
    $("#privateRepo").click(function(){
        //判断是否有配额数
        $('.xiugaireperror').remove();
        $.ajax({
            url: ngUrl+"/quota/"+$.cookie("tname")+"/repository",
            type:"get",
            cache:false,
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(data){
                var usePrivate=data.data.usePrivate;
                var quotaPrivate=data.data.quotaPrivate;
                var uq_private=quotaPrivate-usePrivate;
                if(uq_private>0)
                {
                    $("#addRep .submit input").attr("repevent", "add");
                    $("#addRep .head .title").text("新增Repository");
                    $("#addRep .repname .value input").removeAttr("disabled");
                    $("#addRep .repname .value input").val("");
                    $("#addRep .repcomment .value textarea").val("");
                    $("#addRep .repname .key .promt").show();
                    $('#ispublic').attr("disabled",true);
                    $('#addRep').modal('toggle');
                    // $("#addRep .property .value p").text("私有");
                    $("#ispublic").val(2)
                    $("#judgment").css("display","none");
                    // $("#ListManagement").css("display","none");
                }else {
                    $("#judgment_number").css("display","block").slideDown(2000);
                    $("#judgment").css("display","none");
                }
            }

        });

    });

/////////////////////////////////////删除repo/////////////////////////////////////////////
    $(document).on('click','.isdelerepo',function(){
        var thisreponame = $(this).attr('datareponame');
        $('#delerepoalert').find('.delerepoalertcon').empty();
        var str = '';
        $.ajax({
            url: ngUrl+"/repositories/"+thisreponame,
            type:"get",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
               if(json.data.items > 0){
                     str = '<div class="delerepocomment">无法删除，请先通过Client端删除'+thisreponame+'内的Dataitem</div>'+
                           '<div class="delerepobtnwrop"><span class="nodelrepo nocantdele">我知道了</span></div>'
               }else{
                   str = '<div class="delerepocomment">删除'+thisreponame+'后不可恢复，请确认删除</div>'+
                       '<div class="delerepobtnwrop"><span class="nodelrepo yesdelerepo" datareponame="'+thisreponame+'">确认</span><span class="nodelrepo nodelerepo">取消</span></div>'

               }
                $('#delerepoalert').find('.delerepoalertcon').append(str);
                $('#delerepoalert').modal('toggle');
            }
        });


    })
    $(document).on('click','.yesdelerepo',function(){
        var thisreponame = $(this).attr('datareponame');
        $.ajax({
            url: ngUrl+"/repositories/"+thisreponame,
            type:"DELETE",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                $('#delerepoalert').modal('toggle');
                location.reload();
            }
        });
    })
    $(document).on('click','.nodelerepo',function(){
        $('#delerepoalert').modal('toggle');
    });
    $(document).on('click','.nocantdele',function(){
        $('#delerepoalert').modal('toggle');
    })
    function isyesornodel(reponamearr){
        if(reponamearr.length>0){
            for(var k = 0; k<reponamearr.length;k++){
                $.ajax({
                    url: ngUrl+"/repositories/"+reponamearr[k],
                    type:"DELETE",
                    cache:false,
                    data:{},
                    async:false,
                    dataType:'json',
                    headers:{ Authorization:"Token "+$.cookie("token") },
                    success:function(json){

                    }
                });
            }
        }
    }


})

//请求每个rep的详情



//把数据写入页面

//修改rep


function stopEventStrans(e) {
    e = e || window.event;
    if (e.stopPropagation) {
        e.stopPropagation();//IE以外
    } else {
        e.cancelBubble = true;//IE
    }
}
function getRep(reps,repname) {
    for(var i in reps) {
        if(reps[i].repname == repname) {
            return reps[i];
        }
    }
}

//白名单数量同步
function perTong(repname,type,num){
    $("p[datareponame="+repname+"]").each(function(){
    	if($(this).hasClass("baimingdan")){
    		if(type=="add"){
    			if(num==0){
    				$(this).children().text(num);
    			}else{
    				$(this).children().text(parseInt($(this).children().text())+num);
    			}        		
    		}
    		if(type=="del"){
    			if(num==0){
    				$(this).children().text(num);
    			}else{
            		$(this).children().text(parseInt($(this).children().text())-num);
    			}
    		}
    	} 	
    });
}

//白名单数量同步
function perTongXie(repname,type,num){
    $("p[datareponame="+repname+"]").each(function(){
    	if($(this).hasClass("xiezuozhe")){
    		if(type=="add"){
    			if(num==0){
    				$(this).children().text(num);
    			}else{
    				$(this).children().text(parseInt($(this).children().text())+num);
    			}        		
    		}
    		if(type=="del"){
    			if(num==0){
    				$(this).children().text(num);
    			}else{
            		$(this).children().text(parseInt($(this).children().text())-num);
    			}
    		}
    	} 	
    });
}





