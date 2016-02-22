/**
 * Created by Administrator on 2015/12/28.
 */
$(function() {
    function getParam(key) {
        var value='';
        var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
        if (itemid.test(decodeURIComponent(window.location.href))) {
            value = itemid.exec(decodeURIComponent(window.location.href))[1];
        }
        return value;
    }
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
    var repname = getParam("repname");
    var itemname = getParam("itemname");
    var pages=1;
    var thistaglength = 0;
    function addgatlist(tagname,tagcomment,tagpullnum) {
        var html =
            '<li class="taglistcon borderb">' +
            '<div class="infobox">'+
            '<div class="listTop">' +
            '<div class="tagName">'+tagname+'</div>' +
            '<div class="tagpullnum"><span class="downloaded-icon"></span><span class="pullnum">'+tagpullnum+'</span></div>' +
            '</div>' +
            '<div class="tagcomment">'+tagcomment+'</div>' +
            '</div>'+
            '</li>';

        $('.listbox').append(html);
    }
    function gettagcon(pages){
        $.ajax({
            type: "get",
            async: false,
            url: ngUrl+"/repositories/"+repname+"/"+itemname+'?page='+pages+'&size=6',
            success: function(msg){
                var tagsnum = msg.data.tags;
                $('.tagnum').html(tagsnum);
                var taglist  = msg.data.taglist;
                thistaglength = msg.data.taglist.length;
                for(var i = 0; i < taglist.length;i++){
                    var tagname = msg.data.taglist[i].tag;
                    var tagcomment = msg.data.taglist[i].comment;
                    var tagpullnum = 0;
                    getAjax(ngUrl+"/transaction_stat/"+repname+"/"+itemname+"/"+tagname,function(json){
                        tagpullnum = json.data.numpulls;
                    })

                    addgatlist(tagname,tagcomment,tagpullnum)
                }
            }
        });
    }
    gettagcon(1);
    window.onscroll = function(){
        if(getScrollTop() + getWindowHeight() == getScrollHeight()){
            if(thistaglength>=6){
                pages++;
                gettagcon(pages);
            }
        }
    };




})

//滚动条在Y轴上的滚动距离
function getScrollTop(){
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if(document.body){
        bodyScrollTop = document.body.scrollTop;
    }
    if(document.documentElement){
        documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
}
//文档的总高度
function getScrollHeight(){
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if(document.body){
        bodyScrollHeight = document.body.scrollHeight;
    }
    if(document.documentElement){
        documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
}
//浏览器视口的高度
function getWindowHeight(){
    var windowHeight = 0;
    if(document.compatMode == "CSS1Compat"){
        windowHeight = document.documentElement.clientHeight;
    }else{
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}