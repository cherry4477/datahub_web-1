/**
 * Created by Administrator on 2015/11/24.
 */
$(function(){
    function getParam(key) {
        var value='';
        var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
        if (itemid.test(decodeURIComponent(window.location.href))) {
            value = itemid.exec(decodeURIComponent(window.location.href))[1];
        }
        return value;
    }
    /////////////////table栏切换
    $('.itembtNav li').click(function(){
        var thisindex = $(this).index();
        $(this).addClass('borderBt').siblings().removeClass('borderBt');
        $('.itembottomcon li').eq(thisindex).show().siblings().hide();
    })

    var repname = getParam("repname");
    var itemname = getParam("itemname");
    var mark = getParam("mark");
    if(mark == 'mark'){
        $('.itembtNav li').eq(2).addClass('borderBt').siblings().removeClass('borderBt');
        $('.itembottomcon > li').eq(2).show().siblings().hide();
    }
    $('.renameitem').html(repname);
    $('.renameitem').attr("href","myPublish.html?repname="+repname);
    $('.itemnameitem').html("&nbsp;/&nbsp;"+itemname);
//得到用户登录token;
    var account= $.cookie('token');
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
///////////////判断数据类型//////////////////
    function judgeLabel (labels){
        var labeldata = {
            'label' : labels,
            'vvclass' : '',
            'labelV' : ''
        };
        if (labeldata.label == "api") {
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
    //获取该repo发布者
    function getrepocurname(){
        var thisrepocurname = '';
        $.ajax({
            type: "get",
            url:ngUrl+"/repositories/"+repname,
            cache:false,
            async:false,
            headers:{Authorization: "Token "+account},
            success: function(json){
                thisrepocurname = getrealnames(json.data.create_user);
                return thisrepocurname;
            }
        });
        return thisrepocurname;
    }
    //得到发布者的真实姓名
    function getrealnames(create_userrealname){
        var thsirealname = ''
        $.ajax({
            url: ngUrl + "/users/"+create_userrealname ,
            type: "get",
            cache: false,
            async: false,
            datatype: 'json',
            success:function(datas){
                if(datas.code == 0){
                    thsirealname = datas.data.userName;
                    return thsirealname;
                }
            }
        });
        return thsirealname;
    }
//返回该DataItem的订阅量
    getAjax(ngUrl + "/subscription_stat/"+itemname,function(msg){
        $('.myitemdy').html(msg.data.numsubs);
    });
//返回该DataItem的pull量
    getAjax(ngUrl + "/transaction_stat/"+repname+"/"+itemname,function(msg){
        $('.myitempull').html(msg.data.numpulls);
    });
// 返回item的star量
    getAjax(ngUrl + "/star_stat/"+repname+"/"+itemname,function(msg){
        $('.myitemstar').html(msg.data.numstars);
    });
// 得到tag的下载量

    function gettagpullnum(tagname){
        var tagpullnum ;
        if(account != 'null'){
            $.ajax({
                type: "get",
                url:ngUrl+"/transaction_stat/"+repname+"/"+itemname+"/"+tagname,
                cache:false,
                async:false,
                headers:{Authorization: "Token "+account},
                success: function(msg){
                    tagpullnum = msg.data.nummypulls;

                }
            });
        }else{
            alert('请先登录');
        }
        return tagpullnum;
    }
    // 得到用户的pull记录
    //tag信息
    var tagallnum;
    var taglist = [];
    var meta ;
    var sample;
    var paegetags;
    var tagallnums = 0;
    var itemshowtime;
    var itemaccesstype;
    var supply_style;
    function getcurrpullnum(tagpage){
        $.ajax({
            type: "get",
            url:ngUrl+"/transactions/push/"+repname+"/"+itemname+"?groupbydate=1&size=10&page="+tagpage,
            cache:false,
            async:false,
            headers:{Authorization: "Token "+account},
            success: function(msg){
                $('.pullListcomment').empty();
                tagallnums = msg.data.total;
                for(var i = 0 ;i<msg.data.results.length;i++){
                    var str = '<div class="pullListconwrop">'+
                        '<div class="pulltagtime">'+msg.data.results[i].date+'</div>';
                    for(var j = 0; j < msg.data.results[i].pulls.length; j++){
                        str += '<div class="pullListcon">'+
                            '<div class="pullalltaglist">'+
                            '<div class="pullusername">'+msg.data.results[i].pulls[j].buyername+'</div>'+
                            '<div class="pullthistime">'+msg.data.results[i].pulls[j].pulltime.substr(11,8)+'</div>'+
                            '<div class="pulltagName">'+msg.data.results[i].pulls[j].tag+'</div>'+
                            '</div>'+
                            '</div>';
                    }

                    str += '</div>';
                    $('.pullListcomment').append(str);
                }


            }
        });
    }
    getcurrpullnum(1);
    /////////////////////////pull记录分页
    $(".tagpages").pagination(tagallnums, {
        maxentries:tagallnums,
        items_per_page: 10,
        num_display_entries: 3,
        num_edge_entries: 2 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
//          num_edge_entries:1,
        link_to:"javascript:void(0)",
        callback:tagfenS,
        load_first_page:false
    });
    function tagfenS(new_page_index){
        getcurrpullnum(new_page_index+1)
    }
    //tag信息
    var tagallnum;
    var taglist = [];
    var meta ;
    var sample;
    var paegetags;
    var itemshowtime;
    var itemaccesstype;
    var supply_style;
    var allpricecon;
    var thisitemispublic
    function tagbox(pages){
        $(".filletspan .personaltag").remove();
        var ispagetags = 0;
        $('.tagListcomment').empty();
        $.ajax({
            type: "get",
            async: false,
            headers:{Authorization: "Token "+account},
            url:ngUrl+'/repositories/'+repname+"/"+itemname+'?size=10&page='+pages,
            success: function(msg) {
            	//添加状态开始
            	var thisispricestatenew="";
                var thisiscooperatestatname = '';
                ////////////是否协作
                var thisiscooperatestat = ''
                if(msg.data.cooperatestate == 'null' || msg.data.cooperatestate == null || msg.data.cooperatestate == ''){
                    thisiscooperatestat = '';
                }else{
                    thisiscooperatestat = '<span class="pricetype freetype reptoppr">'+msg.data.cooperatestate+'</span>';
                    if(msg.data.cooperatestate == '协作'){
                        thisiscooperatestatname = getrealnames(msg.data.create_user);
                        $('.thisiscooperatestatname').html('由&nbsp;'+thisiscooperatestatname+'&nbsp;协作');
                    }else if(msg.data.cooperatestate == '协作中'){
                        thisiscooperatestatname = getrepocurname();
                        $('.thisiscooperatestatname').html('由&nbsp;'+thisiscooperatestatname+'&nbsp;邀请协作');
                    }
                }
                $(".itemnameitem").after(thisiscooperatestat);
            	if(msg.data.pricestate=='付费'){
            		thisispricestatenew = '<strong style="border-radius: 3px;display: inline;font-size: 12px;margin-left: 5px;padding: 2px 5px;color:red;border:1px solid red;position: relative;top: -3px;">' + msg.data.pricestate + '</strong>'
            	}else if(msg.data.pricestate==''){
                    thisispricestatenew="";
            	}else{
                    thisispricestatenew = '<strong style="border-radius: 3px;display: inline;font-size: 12px;margin-left: 5px;padding: 2px 5px;color:#f49f12;border:1px solid #f49f12;position: relative;top: -3px;">' + msg.data.pricestate + '</strong>'
                }
            	$(".itemnameitem").after(thisispricestatenew);
            	//添加状态结束
                allpricecon = msg.data.price;
                tagallnum = msg.data.tags;
                $('.alltagnums').html(tagallnum);
                taglist = msg.data.taglist;
                supply_style = msg.data.label.sys.supply_style;
                var classjson = judgeLabel(supply_style)
                $("#supply_style").attr('class', classjson.vvclass);
                $("#supply_style").html(classjson.labelV);
                if (msg.data.Meta != null) {
                    meta = msg.data.Meta;
                } else {
                    meta = '';
                }
                if(msg.data.label){

                    var ptags = msg.data.label.owner;
                    var labelstr = '';
                    for(var j in ptags) {
                        labelstr+='<span class="personaltag">'+ptags[j]+'</span>';
                    }
                }
                $(".topbtcenter").append(labelstr);
                if (msg.data.Sample != null) {
                    sample = msg.data.Sample;
                } else {
                    sample = '';
                }
                paegetags = msg.data.tags;

                if (paegetags == 0) {
                    ispagetags = "该Item下还没有发布任何Tags";
                } else {
                    ispagetags = paegetags + "Tag";
                }
                var jsonTime = getTimes(msg.data.optime);
                itemaccesstype = msg.data.itemaccesstype;
                if (itemaccesstype == 'public') {
                    thisitemispublic = 'public';
                    $('.baimingdan').hide();
                    $('.itemaccesstype').html('公开');
                } else if (itemaccesstype == 'private') {
                    thisitemispublic = 'private';
                    $('.itemaccesstype').html('私有');
                    if(msg.data.cooperatestate == '协作中' || msg.data.cooperatestate == ''){
                        $('.baimingdan').show();
                    }

                }
                $('.itemoptime').html(jsonTime.showTime);
                $('.itemoptime').attr('data-original-title', jsonTime.jdTime);
                $('.itemComment').html(msg.data.comment)
            }

        });
        for(var i = 0;i<taglist.length;i++){
            var tagpullnum = gettagpullnum(taglist[i].tag);
            var times = getTimes(taglist[i].optime);
            var str = '<div class="tagListcon">'+
                '<div class="tagName">'+
                '<p>'+taglist[i].tag+'</p>'+
                '<p>'+taglist[i].comment+'</p>'+
                '</div>'+
                '<div class="tagtime">'+
                '<img datapalecement="top" data-toggle="tooltip" src="images/newpic004.png" class="iconiamg1 iconiamg2" data-original-title="更新时间">'+
                '<span datapalecement="top" data-toggle="tooltip" data-original-title=" 18:57:39">'+times.showTime+'</span>'+
                '</div>'+
                '<div class="tagpullNum">'+
                '<p><img datapalecement="top" data-toggle="tooltip" src="images/newpic007.png" data-original-title="Pull量"></p>'+
                '<p>'+tagpullnum+'</p>'+
                '</div>'+
                '</div>';
            $('.tagListcomment').append(str);
        }
    }

    tagbox(1);
    $(".pages").pagination(paegetags, {
        maxentries:paegetags,
        items_per_page: 10,
        num_display_entries: 3,
        num_edge_entries: 2 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
//          num_edge_entries:1,
        link_to:"javascript:void(0)",
        callback:fenS,
        load_first_page:false
    });
    $('.pagination a').attr('href','javascript:void(0)');
    function fenS(new_page_index){
        tagbox(new_page_index+1)
    }
    //////////////////////元数据、样例数据/////////////////////
    function metadatabox(){
        $('.metaList').empty();
        var str =  '<div class="metatitle">样例 <a href="myMark.html?repname='+repname+'&itemname='+itemname+'&type=sample"><div class="editmeta">修改</div></a></div>'+
            '<div class="metabox" id="metadata">'+marked(sample)+'</div>'+
            '<div class="metatitle" style="margin-top:20px;">元数据<a href="myMark.html?repname='+repname+'&itemname='+itemname+'&type=meta" ><div class="editsample">修改</div></a></div>'+
            '<div class="metabox metadata-con markdown-body" id="sampledata">'+marked(meta)+'</div>';
        $('.metaList').append(str);
    }
    metadatabox();
////////////////////////////////////////////////////////查看价格
    $('.chekcprice').click(function(){
        $('.allpriceList').empty();
        var str = ''
        if(allpricecon.length == 0){
            str = '<div style="text-align:center">暂时没有价格计划</div>'
            $('.allpriceList').append(str);
        }else{
            for(var i = 0; i < allpricecon.length;i++){
                var limitstr = '';
                if(allpricecon[i].limit){
                    limitstr = '每个用户限购&nbsp;'+allpricecon[i].limit+'&nbsp;次';
                }
                var str =  '<li>￥'+allpricecon[i].money+'&nbsp;/&nbsp;'+allpricecon[i].units+'次&nbsp;有效期&nbsp;'+allpricecon[i].expire+'&nbsp;天&nbsp;'+limitstr+'</li>'
                $('.allpriceList').append(str);
            }
        }

        $('#pricealertbox').modal('toggle');
    })
    var gotodelelables = [];
//////////////////////////////////////////////////////////修改item
    $(".itemListName-icon").click(function() {
        gotodelelables = [];
        $('.valuemoney').empty();
        $('.itemtag .value').empty();
        $.ajax({
            url: ngUrl+"/repositories/"+repname+"/"+itemname,
            type: "GET",
            cache:false,
            data:{},
            async:false,
            dataType:'json',
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                if(json.code == 0){
                    var itemaccesstype = '开放';
                    if(json.data.itemaccesstype == 'private'){
                        //itemaccesstype = '私有'
                        $("#ispublic").attr('data-tagle',2);
                        $("#ispublic").val(2);
                    }else{
                        //itemaccesstype = '开放'
                        $("#ispublic").attr('data-tagle',1);
                        $("#ispublic").val(1);
                    }
                    var itemNameInput = $("#editItem .itemname .value input");
                    var itemCommentTextArea = $("#editItem .itemcomment .value textarea");
                    //var itemProSelect = $("#editItem .itempro .value span");
                    var itemtagDiv = $("#editItem .itemtag .value");
                    itemNameInput.val(itemname).attr("disabled", "disabled");
                    itemCommentTextArea.val(json.data.comment);
                    //itemProSelect.html(itemaccesstype);
                    if(json.data.label != undefined && json.data.label != null && json.data.label != "null" &&
                        json.data.label.owner != undefined && json.data.label.owner != null && json.data.label.owner != "null") {
                        var lables = json.data.label.owner;
                        $("#editItem .itemtag .value").html("");
                        for(var i in lables) {
                            createItemTag(i, lables[i], false,'disabled');
                        }
                    }
                    var jsonobj = json.data.price;
                    if(jsonobj){
                        for(var i = 0;i<jsonobj.length;i++){
                            var islimit = false;
                            var limitvalue = ''
                            if (jsonobj[i].limit){
                                islimit = true;
                                limitvalue = jsonobj[i].limit;
                            }
                            var itemdatatype = supply_style;
                            createItemTagmoney(jsonobj[i].units, jsonobj[i].money, jsonobj[i].expire,jsonobj[i].plan_id,false,islimit,itemdatatype,limitvalue);
                        }
                    }

                }
            }
        });
        $('#editItem').modal('toggle');
    });


    $("#editItem .itemtag .key .addbtn .btnicon").click(function() {
        createItemTag();
    });


    $("#editItem .itemtagmoney .keymoney .divmoney .btniconmoney").click(function() {
        createItemTagmoney();
    });

///////////////提交修改
    $("#editItem .submit input").click(function() {
        var reg = new RegExp("^[0-9]*$");
        //var newmoney = new RegExp("^([1-9][0-9]*)+(.[0-9]{1,2})?$");
        var itemtagDiv = $("#editItem .itemtag .value");
        var thisitemtypes = $('#ispublic').val();
        var itemaccesstypes = '';
        if(thisitemtypes == 1){
            itemaccesstypes = 'public';
        }else{
            itemaccesstypes = 'private';
        }
        var labels = itemtagDiv.children(".persontag");
        var itemtagDivmoney = $("#editItem .itemtagmoney .valuemoney");
        var moneydivs = itemtagDivmoney.children(".persontag");
        var dataitem = {};
        var dataarr = [];
        for(var i=0; i<moneydivs.length; i++) {
            dataarr[i] = {};
            var moneydiv = $(moneydivs[i]);
            var dataid = moneydiv.attr('dataid')
            var tagtime = moneydiv.children(".tagtime:first").val();
            var tagmoney = moneydiv.children(".tagmoney:first").val();
            var tagexpire = moneydiv.children(".tagexpire:first").val();
            var isnimitid = moneydiv.children(".isnimitid:first");
            var limitnum = moneydiv.children(".ishiddenbox").children(".limitnum:first").val();
            if(!reg.test(tagtime) || tagtime ==0 || tagtime == ""){
                $('#itemmess').html('次数（天数）需为大于0的整数').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert("");
                return;
            }
            if(isNaN(tagmoney)){
                $('#itemmess').html('价格必须为数字').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                return;
            }
            if(tagmoney == ''){
                $('#itemmess').html('价格不能为空').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                return;
            }
            if(tagmoney < 0 ){
                $('#itemmess').html('价格需大于等于0').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                return;
            }
            var dot = tagmoney.indexOf(".");
            if(dot != -1){
                var dotCnt = tagmoney.substring(dot+1,tagmoney.length);
                if(dotCnt.length > 2){
                    $('#itemmess').html('价格精确到小数点后2位').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                    return;
                }
            }
            //alert(tagmoney.indexOf('.'))
            if(tagmoney.indexOf('.') == -1){
                tagmoney = tagmoney+'.00';
            }

            if(tagexpire == ""){
                $('#itemmess').html('有效期不能为空').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert('有效期不能为空');
                return;
            }
            if(!reg.test(tagexpire) || tagexpire == 0){
                $('#itemmess').html('有效期需为大于0的整数').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                //alert("有效期需为大于0的整数");
                return;
            }
            if(isnimitid.is(':checked') == true){
                if(limitnum){
                    if(!reg.test(limitnum)){
                        $('#itemmess').html('限购次数必须为大于0的整数').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                        //alert("限购次数必须为数字");
                        return;
                    }
                    if(limitnum <= 0){
                        $('#itemmess').html('限购次数必须大于0').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
                        //alert("限购次数必须大于0");
                        return;
                    }
                    dataarr[i].limit = parseInt(limitnum);
                }else{
                    $('#itemmess').html('限购次数不能为空').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                    return;
                }
            }


            dataarr[i].units = parseInt(tagtime);
            dataarr[i].money = parseFloat(tagmoney);
            dataarr[i].expire = parseInt(tagexpire);
            dataarr[i].plan_id = dataid;

        }
        for(var i = 0;i < gotodelelables.length;i++){
            $.ajax({
                        type:"DELETE",
                        url: ngUrl+"/repositories/"+repname+"/"+itemname+"/label?owner."+gotodelelables[i].owname+"="+gotodelelables[i].thistagvalue,
                        cache: false,
                        async: false,
                        headers:{ Authorization:"Token "+$.cookie("token") },
                        success: function (datas) {
                            //other.parent().remove();
                        }
                    });
        }
        dataitem.price = dataarr ;
        dataitem.comment = $.trim($("#editItem .itemcomment .value textarea").val());
        dataitem.itemaccesstype = itemaccesstypes;
        if(dataitem.comment.length > 200) {
            alert('"DataItem 描述"太长！');
            return;
        }
        $('.itemcon').html(dataitem.comment)
        //修改item
        var datalabel = {};
        $.ajax({
            url: ngUrl+"/repositories/"+repname+"/"+itemname,
            type: "PUT",
            cache:false,
            async:false,
            dataType:'json',
            data:JSON.stringify(dataitem),
            headers:{ Authorization:"Token "+$.cookie("token") },
            success:function(json){
                var labelstr = '';
                if(json.code == 0){
                    var priceobj = {};
                    for(var i=0; i<labels.length; i++) {
                        var label = $(labels[i]);
                        var labelkey = $.trim(label.children(".tagkey:first").val());
                        var labelvalue = $.trim(label.children(".tagvalue:first").val());
                        if(labelkey == "" || labelvalue == "") {
                            //alert("标签名和标签值不能为空！");
                            $('#errlabels').html('标签名和标签值不能为空').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                            return;
                        }
                        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
                        if(reg.test(labelkey)){
                            $('#errlabels').html('key值不能为中文').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
                            return
                        }
                        datalabel["owner."+labelkey] = labelvalue;
                        labelstr+='<span class="personaltag">'+labelvalue+'</span>';
                    }
                    $(".topbtcenter .personaltag").remove();
                    $(".topbtcenter").append(labelstr);
                    $.ajax({
                        url: ngUrl+"/repositories/"+repname+"/"+itemname+"/label",
                        type: "PUT",
                        cache:false,
                        data:{},
                        async:false,
                        dataType:'json',
                        data:datalabel,
                        headers:{ Authorization:"Token "+$.cookie("token") },
                        success:function(json){
                            if(json.code == 0){
                                $('#editItem').modal('toggle');
                            }
                        }
                    });
                }
                location.reload();
            }
        });

    });
    $('#ispublic').change(function(){
        if($(this).val() ==2){
            $('#messcooperatorpublic').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
        }
    })
    $(document).on('blur','.tagkey',function(){
        var tagval = $(this).val();
        var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        if(reg.test(tagval)){
            $('#errlabels').html('key值不能为中文').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300)
        }
    })
    $('.baimingdan').click(function(){
        $('.namelist').empty();
        getpagesF();
        //$('#editItem').modal('toggle');
        // $('#editBox').on('hidden.bs.modal', function (e) {
        //     $("body").addClass("modal-open");
        // })

        $('#editBox').modal('toggle');


    })
    if(thisitemispublic == 'private'){
        $.ajax({
            type: "get",
            url:ngUrl+"/permission/"+repname+"/"+itemname+'?size=6&page=1',
            cache:false,
            async:false,
            headers: {Authorization: "Token " + $.cookie("token")},
            success: function(msg){
                $('.baimingdan').html('白名单管理('+msg.data.total+')');
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                     $('.baimingdan').html('白名单管理(0)');
                }

            }
        });
    }
    ////////修改白名单/////////////////////////////////////////////
    var totals = 0;
    function getpagesF(){
        getpermissions(1);
        $(".baipages").pagination(totals, {
            items_per_page: 6,
            num_edge_entries:2,
            num_display_entries:3,
            prev_text:"上一页",
            next_text:"下一页",
            ellipse_text:"...",
            link_to:"javascript:void(0)",
            callback:Fens,
            load_first_page:false
        });
    }
    function getpermissions(pages){

        $.ajax({
            type: "get",
            url:ngUrl+"/permission/"+repname+"/"+itemname+'?size=6&page='+pages,
            cache:false,
            async:false,
            headers:{Authorization: "Token "+account},
            success: function(msg){
                $('.namelist').empty();
                var fornum = msg.data.permissions.length;
                totals = msg.data.total;
                 $('.baimingdan').html('白名单管理('+totals+')');
                for(var i = 0;i<fornum;i++)
                {
                    var lis = '<li class="lis">'+ '<input class="ischeck" type="checkbox"/><span class="namelistcon"></span><span class="thisusername">'+msg.data.permissions[i].username+'</span><span class="namelistdel">[删除]</span>'+
                        '</li>';
                    $('.namelist').append(lis);
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    $('.baimingdan').html('白名单管理(0)');
                }

            }
        });

    }
    function Fens(new_page_index){
        getpermissions(new_page_index+1);
    }
////////新增白名单/////////////////////////////////////////////
    $('.addnamebtn').click(function(event) {
        /* Act on the event */
        var username = $.trim($('#addvalue').val());
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(username == ''){
            $('#mess').html('用户不能为空').addClass('errorMess').removeClass('successMess').show().fadeOut(800)
            return false;
        }else if(!filter.test(username)){
            $('#mess').html('邮箱格式不正确').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkloginusers(username) == 1){
            //$('#mess').html('该用户还未注册').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if(checkname(username) == 2){
            $('#mess').html('已添加该用户').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else if($.cookie("tname") == username){
            $('#mess').html('不能添加自己').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
            return false;
        }else{
            $.ajax({
                type:"put",
                url:ngUrl+"/permission/"+repname+"/"+itemname,
                cache:false,
                dataType:'json',
                async:false,
                headers:{Authorization: "Token "+account},
                data:JSON.stringify({"username":username}),
                success: function(adduser){
                    $('#mess').html('成功添加白名单').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
                    getpagesF();
                }
            });
        }
    });
/////////////////////////////////////////////////////////////////清空白名单
    $('.emptylist').click(function(){
        $.ajax({
            type:"DELETE",
            url:ngUrl+"/permission/"+repname+"/"+itemname+"?delall=1",
            cache:false,
            dataType:'json',
            headers:{Authorization: "Token "+account},
            success: function(deluser){
                if(deluser.code == 0){
                    $('.namelist').empty();
                    $(".baipages").pagination(0, {
                        items_per_page: 6,
                        num_display_entries: 3,
                        num_edge_entries:2,
                        prev_text:"上一页",
                        next_text:"下一页",
                        ellipse_text:"...",
                        link_to:"javascript:void(0)",
                        callback:Fens,
                        load_first_page:false
                    });
                }
            }
        });

    })
////////////////////////////////////////////////////////////////单个删除白名单
    $(document).on('click','.namelistdel',function(){
        var thisusername = $(this).siblings('.thisusername').html();
        var _this = $(this);
        $.ajax({
            type:"DELETE",
            url:ngUrl+"/permission/"+repname+"/"+itemname+"?username="+thisusername,
            cache:false,
            headers:{Authorization: "Token "+account},
            success: function(deluser){
                if(deluser.code == 0){
                    _this.parent().remove();
                    $('.gobackbtnwrop').hide();
                    $('#mess').html('删除成功').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
                    getpagesF();
                }
            }
        });

    })


////////////////////////////////////////////////////////////////批量删除白名单
    $('.dellist').click(function(){
        var thisusername = [];
        var isdele = false;
        var namejson = {}
        var lilist = $('.namelist li');
        for(var i = 0;i<lilist.length;i++){
            if($('.namelist li').eq(i).children('.ischeck').is(':checked')==true){
                var thisval = $(lilist[i]).children('.thisusername').html();
                namejson[$('.namelist li').eq(i).index()] = thisval;
                thisusername.push(thisval);
            }
        }
        if(thisusername.length>0){
            for(var j in namejson){
                $.ajax({
                    type:"DELETE",
                    url:ngUrl+"/permission/"+repname+"/"+itemname+"?username="+namejson[j],
                    cache:false,
                    dataType:'json',
                    headers:{Authorization: "Token "+account},
                    success: function(deluser){
                        if(deluser.code == 0){
                            $('.namelist').empty();
                            isdele = true;
                            $('.gobackbtnwrop').hide();
                            getpagesF();
                        }
                    }
                })
            };
            if(isdele = true){
                $('#mess').html('删除成功').addClass('successMess').removeClass('errorMess').show().fadeOut(800);
            }
        }
    })
//////////////////搜索白名单
    $('.selectbtn').click(function(){
        var curusername = $.trim($('#addvalue').val());
        if(curusername == ''){
            return;
        }
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+repname +'/'+itemname+'?username='+curusername,
            cache: false,
            headers:{ Authorization:"Token "+$.cookie("token") },
            success: function (datas) {
                if(datas.code == 0){
                    if(datas.data.permissions.length > 0){
                        var lis = '<li class="lis">'+
                            '<input class="ischeck" type="checkbox"/><span class="namelistcon"></span><span class="thisusername">'+datas.data.permissions[0].username+'</span><span class="namelistdel">[删除]</span>'+
                            '</li>';
                        $('.namelist').empty().append(lis);
                        $('.gobackbtnwrop').show();
                        $(".baipages").pagination(0, {
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
//////////////////////////返回按钮
    $('.gobackbtnwrop').click(function(){
        $('.namelist').empty();
        getpagesF();
        $(this).hide();
    })

    function checkname(curusername){
        var iscurname = 1;
        $.ajax({
            type:"GET",
            url: ngUrl+'/permission/'+repname +'/'+itemname+'?username='+curusername,
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
            error:function (XMLHttpRequest, textStatus, errorThrown)
            {
                if(XMLHttpRequest.status == 400){
                    $('#mess').html('该用户还未注册').addClass('errorMess').removeClass('successMess').show().fadeOut(800);
                }

            }
        });
        return isloginusers;
    }
//////////////////////////////////添加价格计划
    function createItemTagmoney(tagtime, tagmoney,tagexpire,dataid,newlabel,ischecked,itemdatatype,limitvalue) {
        var isday = '';
        var thisthistagmoney = '';
        if(tagmoney >= 0 && tagmoney != 'null' && tagmoney != null){
            if(tagmoney.toString().indexOf('.') == -1){
                thisthistagmoney = tagmoney+'.00';
            }else{
                thisthistagmoney = tagmoney;
            }
        }
        if(itemdatatype == 'flow'){
            isday = '天';
        }else{
            isday = '次';
        }
        if(limitvalue == '' || limitvalue == null || null== 'limitvalue'){
            limitvalue = '';
        }
        var itemtagmoney = $("#editItem .itemtagmoney .valuemoney");
        var thisstr = '<div class="ishiddenbox"><div class="tagequal">限购&nbsp;每个用户限购多少次</div><input class="limitnum" type="text" value="'+limitvalue+'"/></div>';
        if(itemtagmoney.children("div").length < 6) {
            var ishidestr = '<div class="tagequal gohide">限购&nbsp;</div>'
            var persontag = $("<div></div>").addClass("persontag").attr("newlabel",newlabel?true:false).attr('dataid',dataid).appendTo(itemtagmoney);
            persontag.append($("<input/>").addClass("tagtime").attr("type", "text").val(tagtime));
            persontag.append($("<div> "+isday +"=</div>").addClass("tagequal"));
            persontag.append($("<input/>").addClass("tagmoney").attr("type", "text").val(thisthistagmoney));
            persontag.append($("<div>元&nbsp;&nbsp;有效期</div>").addClass("tagequal"));
            persontag.append($("<input/>").addClass("tagexpire").attr("type", "text").val(tagexpire));
            persontag.append($("<div>天</div>").addClass("tagequal"));
            persontag.append($("<input type='checkbox'/>").attr("checked",ischecked).addClass("isnimitid").click(function() {
                if($(this).attr('checked') == 'checked') {
                    $(this).removeAttr("checked");
                    persontag.children('.ishiddenbox').remove();
                    $(this).after(ishidestr)
                }else {
                    $(this).attr("checked",'checked');
                    persontag.children('.gohide').remove();
                    $(this).after(thisstr)
                }
            }));
            persontag.append(ishidestr);
            if(persontag.children('.isnimitid').attr('checked') == "checked") {
                persontag.children('.gohide').remove();
                persontag.children('.isnimitid').after(thisstr)
            }else {
                persontag.children('.ishiddenbox').remove();
            }
            persontag.append($("<div class='delitemmoneyicon'></div>").click(function() {
                if(persontag.attr("newlabel") != "true") {
                    $(this).parent().remove();
                }else {
                    $(this).parent().remove();
                }
            }));
        }else{
            $('#itemmess').html('最多添加6个价格属性').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
        }
    }
//////////////////////////////////////////////////////添加自定义标签
    function createItemTag(tagkey, tagvalue,newlabel,isdisabled) {
        tagkey = tagkey == undefined ? "": tagkey;
        tagvalue = tagvalue == undefined ? "": tagvalue;
        var itemtag = $("#editItem .itemtag .value");
        var strinput = '';
        if(isdisabled){
            strinput = '<input type="text" class="tagkey" disabled="disabled" value="'+tagkey+'"/>';
        }else{
            strinput = '<input type="text" class="tagkey" value="'+tagkey+'"/>';
        }
        if(itemtag.children("div").length < 5) {
            var persontag = $("<div></div>").addClass("persontag").attr("newlabel",newlabel?true:false).appendTo(itemtag);
            persontag.append(strinput);
            persontag.append($("<div>=</div>").addClass("tagequal"));
            persontag.append($("<input/>").addClass("tagvalue").attr("type", "text").val(tagvalue));
            persontag.append($("<div class='delitemlabelicon'></div>").click(function() {
                var delelable = {
                    owname : $(this).siblings('.tagkey').val(),
                    thistagvalue : $(this).siblings('.tagvalue').val()
                }
                gotodelelables.push(delelable);
                //if(persontag.attr("newlabel") != "true") {
                //    var other = $(this);
                //    var owname = $(this).siblings('.tagkey').val();
                //    var thistagvalue = $(this).siblings('.tagvalue').val();
                //    $.ajax({
                //        type:"DELETE",
                //        url: ngUrl+"/repositories/"+repname+"/"+itemname+"/label?owner."+owname+"="+thistagvalue,
                //        cache: false,
                //        async: false,
                //        headers:{ Authorization:"Token "+$.cookie("token") },
                //        success: function (datas) {
                //            other.parent().remove();
                //        }
                //    });
                //
                //}else {

                    $(this).parent().remove();
                //}
            }));
        }else{
            $('#errlabels').html('最多添加5个标签').addClass('errorMess').removeClass('successMess').show().delay(600).fadeOut(300);
        }
    }















})
	