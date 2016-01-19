/**
 * Created by Administrator on 2016/1/9.
 */
$(function(){
    $('#commentcon').val('');
    function getParam(key) {
        var value='';
        var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
        if (itemid.test(decodeURIComponent(window.location.href))) {
            value = itemid.exec(decodeURIComponent(window.location.href))[1];
        }
        return value;
    }
    $(document).bind("click", function (e) {
        if ((e.target.className.indexOf("promptbox")<0&& e.target.id != "replycon_btn"&& e.target.id != "pushcon_btn"&&e.target.className.indexOf("publish_btn")<0)) {
            $(".promptbox").css("display","none");
        }
    });
    $(document).on('click','.gotologin',function(){
        $(".modal-open").css("padding-right","15px");
        $('#myModal').modal('toggle');
    })
    function addprompt(thisobj,thiscon){
        $('.promptbox').remove();
        var promptbox = '<div class="promptbox" style="display: block; left: 706px;">'+
            thiscon
            '</div>';
        $(thisobj).siblings('.conmentbt').append(promptbox);
    }

    var repoName=getParam("repname");
    var itemName=getParam("itemname");
    var commentthisname = '';
    var loginitemname = $.cookie("tname");
    var thistname = '';
    var headerToken={};

    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    $.ajax({
        url:ngUrl+"/repositories/"+repoName+"/"+itemName+"?abstract=1",
        type: "GET",
        cache:false,
        async:false,
        dataType:'json',
        headers:headerToken,
        success:function(json) {
            if(json.code==0){
                thistname= json.data.create_user;
            }
        }
    });

    /////////////登录用户的真实姓名
   //if(loginitemname != 'null' && loginitemname != null){
   //    $.ajax({
   //        url: ngUrl+"/users/"+loginitemname,
   //        type: "GET",
   //        cache:false,
   //        async:false,
   //        headers:headerToken,
   //        dataType:'json',
   //        success:function(json) {
   //            if(json.code==0){
   //                commentthisname= json.data.userName;
   //            }
   //        }
   //    });
   //}


    function addcommenthtml(towho){
        var thisstr = '<div class="commentwrop replycboxbg" id="replyCommnet">'+
            '<textarea name="" id="replycommentcon" datatowho="回复'+towho+'">回复'+towho+'</textarea>'+
            '<div class="conmentbt">'+
            '<div class="commentnums">还可以输入<span class="reply_surplusnum">210</span>字，已超出<span class="reply_exceednum">0</span>字</div>'+
            '<div class="publish_btn" id="replycon_btn">评论</div>'+
            '</div>'+
            '</div>';
        return thisstr;
    }

    ////////////////////////////////////////生成uuid
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };

    function guid() {
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    ///////////////////////展示评论列表
    function addreplyhtml(listcon){
        //alert('listcon.username-----'+listcon.username);
        //alert('thistname-----'+thistname);
        var replytostr = '';
        var replythisname = '';
        var myitemcolor = '';
        if(thistname == listcon.username){
            $.ajax({
                url: ngUrl+"/users/"+thistname,
                type: "GET",
                cache:false,
                async:false,
                headers:headerToken,
                dataType:'json',
                success:function(json) {
                    if(json.code==0){
                        commentthisname= json.data.userName;

                    }
                }
            });
            replythisname = commentthisname;
            myitemcolor = 'myitemcolor';
        }else{
            replythisname = listcon.nickname
        }
        var delstr = '';
        var replytousername = ''
        if(loginitemname == listcon.username){
            delstr = '<span class="delcommentbtn">删除</span>';
        }
        if(listcon.replyto){
            replytousername = '回复'+listcon.replyto.username;
        }
        var createtime = listcon.createtime.replace(/[A-Z]/g, " ");
        var aplystr = '<div class="comListconwrop" datacomid="'+listcon.commentid+'">'+
            '<div class="replytousername">'+replytousername+'</div>'+
            '<div class="comnews '+myitemcolor+'">'+listcon.content+'</div>'+
            '<span class="commenname towho" datanickname="'+ listcon.nickname +'">'+replythisname+'</span>'+
            '<div class="commentdate">'+createtime+'</div>'+
            '<div class="reply_wrop"><span class="reply_btn">回复</span>'+ delstr +'</div>'+
            '<div class="replytobox">'+replytostr+'</div>'+
            '</div>';
        $('.commentList').append(aplystr);

    }
    var replytoNum = 0;
    function getcommentlist(commentpages){
        $('.commentList').empty();
        $.ajax({
            type:'GET',
            url: ngUrl + "/comments/" + repoName + "/"+itemName+'?page='+commentpages+'&size=20',
            cache: false,
            async: false,
            dataType:'json',
            success: function (msg) {
                var msglenth = msg.data.results.length;
                replytoNum = msg.data.total;
                $('.commentallnum').html(replytoNum)
                for(var i = 0;i<msglenth;i++){
                    addreplyhtml(msg.data.results[i]);
                }
            }
        });

    }
    getcommentlist(1);
    $(".conmentpages").pagination(replytoNum, {
        maxentries:replytoNum,
        items_per_page: 20,
        num_display_entries: 1,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:replyfenS,
        load_first_page:false
    });
    function replyfenS(new_page_index){
        getcommentlist(new_page_index+1);
    }
    ///////////////////回复评论
    $(document).on('click','.reply_btn',function(){
        var thisnickname = $(this).closest('.reply_wrop').siblings('.towho').attr('datanickname');
        var thistext = $(this).html();
        $('.comListconwrop').children('#replyCommnet').remove();
        $('.reply_btn').html('回复');
        if(thistext == '回复'){
            $(this).html('收起');
            $(this).parent().siblings('#replyCommnet').remove();
            $(this).closest('.comListconwrop').append(addcommenthtml(thisnickname));
        }else if(thistext == '收起'){
            $(this).html('回复');
            $(this).parent().siblings('#replyCommnet').remove();
        }

    })
    ///////////////删除评论///////////////
    function delcomment(commentid){
        $.ajax({
            type:'DELETE',
            url: ngUrl + "/comment/" + repoName + "/"+itemName+'?commentid='+commentid,
            cache: false,
            //async: false,
            dataType:'json',
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function (msg) {
                getcommentlist();
            }
        });
    }
    $(document).on('click','.delcommentbtn',function(){
        var commentid =  $(this).closest('.reply_wrop').closest('.comListconwrop').attr('datacomid');
        delcomment(commentid);
    })
    ////////////////回复评论///////////////
    $(document).on('focus','#replycommentcon',function(){
        var thisdatatowho = $(this).attr('datatowho');
        var thistext = $(this).val();
        if(thisdatatowho == thistext){
            $(this).val('');
        }
    })
    $(document).on('click','#replycon_btn',function(){
        var thisdatacomid = parseInt($(this).parents('.comListconwrop').attr('datacomid'));
        getissub('#replycommentcon',thisdatacomid);
    })
    ////////////////////评论框文字长度验证//////////////
    function commentkeyup(combj,surobj,exceedobj){
        var commentcon = $(combj).val();
        var residue = 210 - (commentcon.length);
        var exceeding = 0;
        if(residue<0){
            residue = 0;
            exceeding = commentcon.length - 210;
        }
        $(surobj).html(residue);
        $(exceedobj).html(exceeding);
    }
    $(document).on('keyup','#replyCommnet',function(){
        commentkeyup('#replycommentcon','.reply_surplusnum','.reply_exceednum');
    })
    $('#commentcon').keyup(function(){
        commentkeyup('#commentcon','.surplusnum','.exceednum');
    });
    function pushreplycom(thisobj,isreply){
        var thisuuid = guid();
        var parten = /^\s*$/ ;
        var commentcon = $(thisobj).val();
        if(parten.test(commentcon)){
            //$('.commenterr').html('评论不能为空');
            //$('#commemtalert').modal('toggle');
            addprompt(thisobj,'评论不能为空');
            return false;
        }else if(commentcon.length > 210){
            return false;
        }else{
            var thisdatas = {
                "token" : thisuuid,
                "replyto": isreply,
                "content": commentcon
            }
            $.ajax({
                type:'POST',
                url: ngUrl + "/comment/" + repoName + "/"+itemName,
                cache: false,
                dataType:'json',
                data:JSON.stringify(thisdatas),
                headers: {Authorization: "Token " + $.cookie("token")},
                success: function (msg) {
                    getcommentlist();
                    $(thisobj).val('');
                    $('.surplusnum').html('210');
                    $('.exceednum').html('0');
                }
            });
        }
    }
    ///////////////////发表评论///////////////////////
    function getissub(thisobj,orreply){
        var issubscription = false;
        if($.cookie("token") == null || $.cookie("token") == 'null'){
            //$('.commenterr').html('您还没有登录')
            //$('#commemtalert').modal('toggle');
            //$('.promptbox').remove();
            //$(thisobj).siblings('.conmentbt').append(promptbox);
            addprompt(thisobj,'您还没有登录，请<span class="gotologin">登录</span>');
            return;
        }else{
            $.ajax({
                type:'get',
                url: ngUrl + "/subscription/" + repoName + "/"+itemName,
                cache: false,
                dataType:'json',
                async: false,
                headers: {Authorization: "Token " + $.cookie("token")},
                success: function (msg) {
                    if(msg.code == 0){
                        issubscription = msg.data;
                    }
                }
            });
            if(issubscription == true || thistname == loginitemname){
                pushreplycom(thisobj,orreply);
                //$(thisobj).val('');
                //$('.surplusnum').html('210');
                //$('.exceednum').html('0');

            }else{
                //$('.commenterr').html('您还没有订购该item')
                //$('#commemtalert').modal('toggle');
                addprompt(thisobj,'您还没有订购该item');
                return
            }
        }
    }
    $('#pushcon_btn').click(function(){
        getissub('#commentcon',0)
    })

})