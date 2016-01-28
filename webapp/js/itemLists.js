
$(function () {
	
})

var type=0;
var size=0;
//type类型，size分页数
function init(type,size){
	window.type=type;
	window.size=size;
	//总数
	var totalnum=ajaxTotal(type,size);
	if($("#terminal-content-body").html()==""){
		pagechange(0);
	}
}

function pagechange(new_page_index){
	$('body,html').animate({ scrollTop:0}, 500);
	var page=new_page_index+1;
	var type=window.type;
	var size=window.size;
	ajaxFunHtml(type,size,page);
	$('[data-toggle="tooltip"]').tooltip();
}


//获取列表集合 1.rep 2.item 3.tag 4.user 5.我的订购

function ajaxFunHtml(type,size,page){
	
	var list=[];
	var url="";
	var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    
	if(type=="1"){
		
	}
	if(type=="2"){
		
	}
	if(type=="3"){
		
	}
	if(type=="4"){	
	    $("#terminal-content-body").empty();
		url=ngUrl+"/repositories?username="+getParam("username")+"&size="+size+"&page="+page;
		$.ajax({
	        url: url,
	        type: "get",
	        cache:false,
	        async:false,
	        headers:headerToken,
	        dataType:'json',
	        success:function(json){
	            if(json.data.length!=0){
	                var pages=json.data.length;
	                for(var i=0;i<pages;i++){
	                    list.push([json.data[i].repname]);
	                }
	            }else{
	                console.log("报错");
	            }
	        }
	    });				
		forList(list,4);			
	}
	
	if(type=="5"){
		if($("#terminal-content-body").attr("mark")!=""){
		    $("#terminal-content-body").empty();
			url=ngUrl+"/subscriptions/pull?size="+size+"&page="+page;	
			$.ajax({
		        url: url,
		        type: "get",
		        cache:false,
		        async:false,
		        headers:headerToken,
		        dataType:'json',
		        success:function(json){
		        	var len=json.data.results.length;
		        	for(var i=0;i<len;i++){
		        		var oderdate="";
		        		if(json.data.results[i].signtime!=undefined){
		        			oderdate=json.data.results[i].signtime.substr(0,10)+"&nbsp;"+json.data.results[i].signtime.substr(11,8);
		        		}else{
		        			oderdate=json.data.results[i].applytime.substr(0,10)+"&nbsp;"+json.data.results[i].applytime.substr(11,8);      		
		        		}
		        		var expiretimeOrder=json.data.results[i].expiretime.substr(0,10)+"&nbsp;"+json.data.results[i].expiretime.substr(11,8);
		        		//详情内容
		        		var comment="";
		        		$.ajax({
		                    url: ngUrl+"/repositories/"+json.data.results[i].repname+"/"+json.data.results[i].itemname+"?abstract=1",
		                    type: "get",
		                    cache:false,
		                    async:false,
		                    dataType:'json',
		                    headers:headerToken,
		                    success:function(json){
		                    	comment=json.data.comment;
		                    }
		        		});
		        		//订单状态
		        		var orderStatus=json.data.results[i].phase;
		        		var btnStyle="padding: 10px 32px; border-top-width: 0px; margin-top: 65px; margin-left: 120px;";
		        		if(orderStatus=="5"){
		        			btnStyle="padding: 10px 32px; border-top-width: 0px; margin-top: 65px; margin-left: 65px;";
		        		}
		        		if(orderStatus=="10"){
		        			btnStyle="padding: 10px 32px; border-top-width: 0px; margin-top: 65px; margin-left: 100px;";
		        		}
		        		
		        		switch(orderStatus)
		        		{
		        			case 1:
		        				orderStatus="正在生效中";
		        			break;
		        			case 2:
		        				orderStatus="订单已完成";
		        			break;
		        			case 3:
		        				orderStatus="订单已完成";
		        			break;
		        			case 5:
		        				orderStatus="Item下线，订单失效";
		        			break;
		        			case 6:
		        				orderStatus="管理员删除";
		        			break;
		        			case 7:
		        				orderStatus="申请订购中";
		        			break;
		        			case 8:
		        				orderStatus="已撤回申请";
		        			break;
		        			case 9:
		        				orderStatus="申请被拒绝";
		        			break;
		        			case 10:
		        				orderStatus="余额不足失效";
		        			break;
		        			default:
		        				orderStatus="未知的状态";		
		        		}	        		
		        		//订购者
		        		var sellername=json.data.results[i].sellername;
		        		$.ajax({
		        	        url: ngUrl+"/users/"+sellername,
		        	        type: "get",
		        	        cache:false,
		        	        data:{},
		        	        async:false,
		        	        dataType:'json',
		        	        success:function(json){
		        	        	sellername=json.data.userName;
		        	        }
		        	    });
		        		//pull量
		        		var pullnum="";
		        		var pullText="";
//		        		$.ajax({
//		        	        url: ngUrl+"/transaction_stat/"+json.data.results[i].repname+"/"+json.data.results[i].itemname,
//		        	        type: "get",
//		        	        cache:false,
//		        	        data:{},
//		        	        async:false,
//		        	        headers:headerToken,
//		        	        dataType:'json',
//		        	        success:function(json){
//		        	        	pullnum = json.data.numpulls;
//		        	        	if(pullnum>0){
//		        	        		pullText="<span style='float:left;border: 2px solid #e60012;border-radius: 10px;height:10px;width:10px;display:block'></span>";
//		        	        	}else{
//		        	        		pullText="<span style='float:left;border: 2px solid #337ab7;border-radius: 10px;height:10px;width:10px;display:block'></span>";
//		        	        	}
//		        	        }
//		        	    }); 
		        		pullnum=json.data.results[i].plan.used;
        	        	if(pullnum>0){
	    	        		pullText="<span style='float:left;border: 2px solid #e60012;border-radius: 10px;height:10px;width:10px;display:block'></span>";
	    	        	}else{
	    	        		pullText="<span style='float:left;border: 2px solid #337ab7;border-radius: 10px;height:10px;width:10px;display:block'></span>";
	    	        	}
		        		//supply_style
		        		var supply_style="";
		        		if(json.data.results[i].supply_style=="flow"){
		        			supply_style="天";
		        		}
		        		if(json.data.results[i].supply_style=="batch"){
		        			supply_style="次";
		        		}
		        		
		        		$("#terminal-content-body").append(""+
		    	        		"<div class='repoE'>"+
		    	        			"<div class='order'>"+
		    	        				"<div class='orderNum'>"+
		    	        					"<p>订单号：<span>"+json.data.results[i].subscriptionid+"</span></p>"+
		    	        				"</div>"+
		    	        				"<div class='orderTime'>"+
		    	        					"<p>订购时间：<span>"+oderdate+"</span></p>"+
		    	        				"</div>"+
		    	        			"</div>"+
		    	        			"<div style='width:1130px;' class='repo'>"+
		    							"<div class='left'>"+
		    								"<div class='repoName'>"+ 
		    									"<a target='_blank' href='itemDetails.html?repname="+json.data.results[i].repname+"&itemname="+json.data.results[i].itemname+"'>"+json.data.results[i].repname+"/"+json.data.results[i].itemname+"</a>"+ 
		    								"</div>"+
		    								"<div class='description'>"+	
		    									"<p>"+comment+"</p>"+
		    								"</div>"+
		    								"<div class='supplier'>"+
		    									"<p>本数据由<a href='dataOfDetails.html?username="+json.data.results[i].sellername+"'>"+sellername+"</a>提供</p>"+
		    								"</div>"+
		    							"</div>"+		
		    						"<div class='orderStatus'>"+	
		    							"<p>"+orderStatus+"</p>"+
		    						"</div>"+
		    		
		    						"<div class='price'>"+
		    							"<p>价格:"+json.data.results[i].plan.money+"/"+json.data.results[i].plan.units+supply_style+" 有效期"+json.data.results[i].plan.expire+"天</p>" +
		    							"<p>失效日期："+expiretimeOrder+"</p>" +
		    							"<div style='float:left;'>"+pullText+"<p style='float: left;margin-left:10px;margin-top: -5px;width: 100px;'>Pull："+pullnum+"</p></div>"+
		    						"</div>"+
		    						"<div class='button'>"+
		    							"<a href='itemDetails.html?repname="+json.data.results[i].repname+"&itemname="+json.data.results[i].itemname+"&discuss=discuss' style='"+btnStyle+"' class='btn btn-warning' type='button'>评论</a>"+
		    						"</div>"+
		    					"</div>"+
		    				"</div>"
		                 ); 
		        	}
		    	    
		        }/*,
		        error:function(json){
		        	if(json.status==400){
		        		errorDialog(json.status,$.parseJSON(json.responseText).code,$.parseJSON(json.responseText).msg);			            
		        	}else{
		        		errorDialog(json.status,"","");            
		        	}
		            $('#errorDM').modal('show');
		        }*/
		    });
			//forList(null,5);
		}
		
	}
	if(type=="6"){
		if($("#terminal-content-body").attr("mark")!=""){
		    $("#terminal-content-body").empty();
			url=ngUrl+"/notifications?size="+size+"&page="+page;	
			$.ajax({
		        url: url,
		        type: "get",
		        cache:false,
		        async:false,
		        headers:headerToken,
		        dataType:'json',
		        success:function(json){
		        	allrepnum =json.data.total;
		        	$(".zongNums").text(allrepnum);
		        	var len=json.data.results.length;        	
		        	for(var i=0;i<len;i++){    		
		        		$("#terminal-content-body").append(""+
	    	        		"<div class='record'>"+
	    	        			"<div class='head'>"+
	    	        				"<span class='icon'></span>"+
	    	        				"<span class='date'>"+json.data.results[i].time+"</span>"+	
	    	        			"</div>"+
	    	        			"<div class='body'>"+
	    	        				"<div class='info'>"+
	    	        					"<div class='box'>"+
	    									"<p ID='title' style='font-size:16px; color: #000000;padding-top:20px;'>"+json.data.results[i].type+"</p>"+
	    									"<p ID='description' style='font:12px; color: #666666;padding-top:15px; padding-bottom:15px'>管理员<a style='font:14px bold;color:#43609f;'>****(用户真实姓名)申请加入repo名／item名白名单，并以“＊元＝＊条，有效期＊天 的价格订购。”</a></p>"+
	    								"</div>"+
	    							"</div>"+
	    	        			"</div>"+
	    	        		"</div>"	    	        	
		                 ); 
		        	}
		    	        	      	
		        }
		    });
		}
	    
	}

}


function forList(list,type){
	
	var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
	var url="";

	
	if(list!=null){
	    for(var i=0;i<list.length;i++){
	        $.ajax({
	            url: ngUrl+"/repositories/"+list[i],
	            type: "get",
	            cache:false,
	            async:false,
	            headers:headerToken,
	            dataType:'json',
	            success:function(json){
	                $("#loading").empty();
	                var times=json.data.optime;
	                var jdTime=times.substring(0, times.indexOf("."));
	                var xdTime="";
	                var showTime="";
	                var nums=times.indexOf("|");
	                if(nums!="-1"){
	                    showTime=times.substring(times.indexOf("|")+1,times.length);
	                }else{
	                    showTime=times.substring(0, times.indexOf("."));
	                }
	                var subnum="";
	                $.ajax({
	                    url: ngUrl+"/subscription_stat/"+list[i],
	                    type: "get",
	                    cache:false,
	                    data:{},
	                    async:false,
	                    dataType:'json',
	                    success:function(json){
	                        if(json.code == 0){
	                            subnum=json.data.numsubs;
	                        }else {
	                            console.log("报错");
	                        }
	                    }
	                });

	                var transnum="";
	                $.ajax({
	                    url: ngUrl+"/transaction_stat/"+list[i],
	                    type: "get",
	                    cache:false,
	                    data:{},
	                    async:false,
	                    dataType:'json',
	                    success:function(json){
	                        if(json.code == 0){
	                            transnum=json.data.numpulls;
	                        }else {
	                            console.log("报错");
	                        }
	                    }
	                });

	                var starsnum="";
	                $.ajax({
	                    url: ngUrl+"/star_stat/"+list[i],
	                    type: "get",
	                    cache:false,
	                    data:{},
	                    async:false,
	                    dataType:'json',
	                    success:function(json){
	                        if(json.code == 0){
	                            starsnum=json.data.numstars;
	                        }else {
	                            console.log("报错");
	                        }
	                    }
	                });
	                
	                if(type=="1"){
	            		
	            	}
	            	if(type=="2"){
	            		
	            	}
	            	if(type=="3"){
	            		
	            	}
	            	if(type=="4"){
	            		 $("#terminal-content-body").append(""+
	                     		
	                         	"<div class='repo'>"+
	         						"<div class='data_left'>"+

	     	    					"<div class='subtitle'>"+ 
	     	    						"<a style='color:#0077aa' href='repDetails.html?repname="+list[i]+"'>"+list[i]+"</a>"+ 
	     	    					"</div>"+

	     	    					"<div class='description'>"+	
	     	    						"<p>"+json.data.comment+"</p>"+
	     	    					"</div>"+

	     	    					"<div class='subline'>"+  	
	     	    						"<div class='icon'>"+
	     	    							"<img style='margin-right:15px;margin-left:30px' src='images/selects/images_17.png' data-toggle='tooltip' datapalecement='top' title='更新时间'/>"+
	     	    							"<span title='"+jdTime+"'>"+showTime+"<span>"+
	     	    							"<img style='margin-right:15px;margin-left:50px' src='images/selects/images_19.png' data-toggle='tooltip' datapalecement='top' title='item数量' />"+
	     	    							"<span>"+json.data.items+"</span>"+
	     	    						"</div>"+
	     	    					"</div>"+
	     	    					
	     	    				"</div>"+	

	         				"<div class='data_right' style='height:auto;margin-bottom:30px;'>"+	
	         					"<div class='iconGroup' style='margin-right:0px;float:right;border-top:0px;margin-top:60px;'>"+
	         						"<div class='like'>"+
	         							"<img src='images/selects/images_39.png' data-toggle='tooltip' datapalecement='top' title='star数量'>"+
	         							"<span style='margin-left: 20px;'>"+starsnum+"</span>"+
	         						"</div>"+	
	         						"<div class='cart'>"+
	         							"<img src='images/selects/images_32.png' data-toggle='tooltip' datapalecement='top' title='订购量'>"+
	         							"<span style='margin-left: 20px;'>"+subnum+"</span>"+
	         						"</div>"+
	         						"<div class='download'>"+
	         							"<img src='images/icon_download.png' data-toggle='tooltip' datapalecement='top' title='pull量'>"+
	         							"<span style='margin-left: 20px;'>"+transnum+"</span>"+ 
	         						"</div>"+
	         					"</div>"+
	         				"</div>"+
	         			"</div>"	                    		
	                             
	                         ); 
	            	}
	          
	            }/*,
	            error:function(json){
		        	if(json.status==400){
		        		errorDialog(json.status,$.parseJSON(json.responseText).code,$.parseJSON(json.responseText).msg);			            
		        	}else{
		        		errorDialog(json.status,"","");            
		        	}
		            $('#errorDM').modal('show');
		        }*/
	        });
	    }
	}else{
	
	}

	
}




//获取所有集合total,初始化分页 1.rep 2.item 3.tag 4.user
function ajaxTotal(type,size){
	var url="";
	var allrepnum="";
	var headerToken={};
    //登陆后
    if($.cookie("token")!=null&&$.cookie("token")!="null"){
        headerToken={Authorization:"Token "+$.cookie("token")};
    }
    if(type=="1"){
		
	}
	if(type=="2"){
		
	}
	if(type=="3"){
		
	}
	if(type=="4"){
		url=ngUrl+"/repositories?username="+getParam("username")+'&size=-1';
	    $.ajax({
	        url: url,
	        type: "get",
	        cache:false,
	        async:false,
	        headers:headerToken,
	        dataType:'json',
	        success:function(json){
	            if(json.data.length!=0){
	               allrepnum =json.data.length;
	            }else{
	                console.log("报错");
	            }
	        }/*,
	        error:function(json){
	        	if(json.status==400){
	        		errorDialog(json.status,$.parseJSON(json.responseText).code,$.parseJSON(json.responseText).msg);			            
	        	}else{
	        		errorDialog(json.status,"","");            
	        	}
	            $('#errorDM').modal('show');
	        }*/
	    });
	}
	if(type=="5"){
		url=ngUrl+"/subscriptions/pull?size="+window.size;
	    $.ajax({
	        url: url,
	        type: "get",
	        cache:false,
	        async:false,
	        headers:headerToken,
	        dataType:'json',
	        success:function(json){
	        	allrepnum =json.data.total;
	        	$("#itemnum").text(allrepnum);
	        	var len=json.data.results.length;
	        	for(var i=0;i<len;i++){
        			//alert(json.data.results[i].repname+"/"+json.data.results[i].itemname+"---"+json.data.results[i].phase+"---"+json.data.results[i].signtime+"---"+json.data.results[i].applytime);
	        		var oderdate="";
	        		if(json.data.results[i].signtime!=undefined){
	        			oderdate=json.data.results[i].signtime.substr(0,10)+"&nbsp;"+json.data.results[i].signtime.substr(11,8);
	        		}else{
	        			oderdate=json.data.results[i].applytime.substr(0,10)+"&nbsp;"+json.data.results[i].applytime.substr(11,8);      		
	        		}
	        		var expiretimeOrder=json.data.results[i].expiretime.substr(0,10)+"&nbsp;"+json.data.results[i].expiretime.substr(11,8);
	        		//详情内容
	        		var comment="";
	        		$.ajax({
	                    url: ngUrl+"/repositories/"+json.data.results[i].repname+"/"+json.data.results[i].itemname+"?abstract=1",
	                    type: "get",
	                    cache:false,
	                    async:false,
	                    dataType:'json',
	                    headers:headerToken,
	                    success:function(json){
	                    	comment=json.data.comment;
	                    }
	        		});
	        		//订单状态
	        		var orderStatus=json.data.results[i].phase;
	        		var btnStyle="padding: 10px 32px; border-top-width: 0px; margin-top: 65px; margin-left: 120px;";
	        		if(orderStatus=="5"){
	        			btnStyle="padding: 10px 32px; border-top-width: 0px; margin-top: 65px; margin-left: 65px;";
	        		}
	        		if(orderStatus=="10"){
	        			btnStyle="padding: 10px 32px; border-top-width: 0px; margin-top: 65px; margin-left: 100px;";
	        		}
	        		
	        		switch(orderStatus)
	        		{
	        			case 1:
	        				orderStatus="正在生效中";
	        			break;
	        			case 2:
	        				orderStatus="订单已完成";
	        			break;
	        			case 3:
	        				orderStatus="订单已完成";
	        			break;
	        			case 5:
	        				orderStatus="Item下线，订单失效";
	        			break;
	        			case 6:
	        				orderStatus="管理员删除";
	        			break;
	        			case 7:
	        				orderStatus="申请订购中";
	        			break;
	        			case 8:
	        				orderStatus="已撤回申请";
	        			break;
	        			case 9:
	        				orderStatus="申请被拒绝";
	        			break;
	        			case 10:
	        				orderStatus="余额不足失效";
	        			break;
	        			default:
	        				orderStatus="未知的状态";		
	        		}        		
	        		//订购者
	        		var sellername=json.data.results[i].sellername;
	        		$.ajax({
	        	        url: ngUrl+"/users/"+sellername,
	        	        type: "get",
	        	        cache:false,
	        	        data:{},
	        	        async:false,
	        	        dataType:'json',
	        	        success:function(json){
	        	        	sellername=json.data.userName;
	        	        }
	        	    });
	        		//pull量
	        		var pullnum="";
	        		var pullText="";
//	        		$.ajax({
//	        	        url: ngUrl+"/transaction_stat/"+json.data.results[i].repname+"/"+json.data.results[i].itemname,
//	        	        type: "get",
//	        	        cache:false,
//	        	        data:{},
//	        	        async:false,
//	        	        headers:headerToken,
//	        	        dataType:'json',
//	        	        success:function(json){
//	        	        	pullnum = json.data.numpulls;
//	        	        	if(pullnum>0){
//	        	        		pullText="<span style='float:left;border: 2px solid #e60012;border-radius: 10px;height:10px;width:10px;display:block'></span>";
//	        	        	}else{
//	        	        		pullText="<span style='float:left;border: 2px solid #337ab7;border-radius: 10px;height:10px;width:10px;display:block'></span>";
//	        	        	}
//	        	        }
//	        	    }); 
	        		pullnum=json.data.results[i].plan.used;
    	        	if(pullnum>0){
    	        		pullText="<span style='float:left;border: 2px solid #e60012;border-radius: 10px;height:10px;width:10px;display:block'></span>";
    	        	}else{
    	        		pullText="<span style='float:left;border: 2px solid #337ab7;border-radius: 10px;height:10px;width:10px;display:block'></span>";
    	        	}
	        		//supply_style
	        		var supply_style="";
	        		if(json.data.results[i].supply_style=="flow"){
	        			supply_style="天";
	        		}
	        		if(json.data.results[i].supply_style=="batch"){
	        			supply_style="次";
	        		}
	        		
	        		$("#terminal-content-body").append(""+
	    	        		"<div class='repoE'>"+
	    	        			"<div class='order'>"+
	    	        				"<div class='orderNum'>"+
	    	        					"<p>订单号：<span>"+json.data.results[i].subscriptionid+"</span></p>"+
	    	        				"</div>"+
	    	        				"<div class='orderTime'>"+
	    	        					"<p>订购时间：<span>"+oderdate+"</span></p>"+
	    	        				"</div>"+
	    	        			"</div>"+
	    	        			"<div style='width:1130px;' class='repo'>"+
	    							"<div class='left'>"+
	    								"<div class='repoName'>"+ 
	    									"<a target='_blank' href='itemDetails.html?repname="+json.data.results[i].repname+"&itemname="+json.data.results[i].itemname+"'>"+json.data.results[i].repname+"/"+json.data.results[i].itemname+"</a>"+ 
	    								"</div>"+
	    								"<div class='description'>"+	
	    									"<p>"+comment+"</p>"+
	    								"</div>"+
	    								"<div class='supplier'>"+
	    									"<p>本数据由<a href='dataOfDetails.html?username="+json.data.results[i].sellername+"'>"+sellername+"</a>提供</p>"+
	    								"</div>"+
	    							"</div>"+		
	    						"<div class='orderStatus'>"+	
	    							"<p>"+orderStatus+"</p>"+
	    						"</div>"+
	    		
	    						"<div class='price'>"+
	    							"<p>价格:"+json.data.results[i].plan.money+"/"+json.data.results[i].plan.units+supply_style+" 有效期"+json.data.results[i].plan.expire+"天</p>" +
	    							"<p>失效日期："+expiretimeOrder+"</p>" +
	    							"<div style='float:left;'>"+pullText+"<p style='float: left;margin-left:10px;margin-top: -5px;width: 100px;'>Pull："+pullnum+"</p></div>"+
	    						"</div>"+
	    						"<div class='button'>"+
	    							"<a href='itemDetails.html?repname="+json.data.results[i].repname+"&itemname="+json.data.results[i].itemname+"&discuss=discuss' style='"+btnStyle+"' class='btn btn-warning' type='button'>评论</a>"+
	    						"</div>"+
	    					"</div>"+
	    				"</div>"
	                 ); 
	        	}
	    	        	      	
	        }/*,
	        error:function(json){
	        	if(json.status==400){
	        		errorDialog(json.status,$.parseJSON(json.responseText).code,$.parseJSON(json.responseText).msg);			            
	        	}else{
	        		errorDialog(json.status,"","");            
	        	}
	            $('#errorDM').modal('show');
	        }*/
	    });
	}
	if(type=="6"){
		url=ngUrl+"/notifications?size="+window.size+"&level=0";
	    $.ajax({
	        url: url,
	        type: "get",
	        cache:false,
	        async:false,
	        headers:headerToken,
	        dataType:'json',
	        success:function(json){
	        	allrepnum =json.data.total;
	        	$(".zongNums").text(allrepnum);
	        	var len=json.data.results.length;  
        		var typeEvent="";
        		var typeTime="";
        		var typeRep="";
        		var typeItem="";
        		var typeTag="";
        		var typeText="";
        		var s="";
	        	if(len!=0){
	        		for(var i=0;i<len;i++){    		
		        		var type=json.data.results[i].type;
		        		if(type=="subsapply_event"){
		        			typeText="订购申请事件";
		        		}
		        		if(type=="item_event"){   			
		        			for(var p in json.data.results[i].data){
		        				if(p=="event"){
		        					typeEvent=json.data.results[i].data[p];
		        					if(typeEvent=="tag_added"){
		        						typeText="tag添加事件";
		        					}
									if(typeEvent=="tag_deleted"){
										typeText="tag删除事件";
									}
									if(typeEvent=="item_deleted"){
										typeText="item删除事件";
									}
									if(typeEvent=="repo_deleted"){
										typeText="repo删除事件";
									}	
		        				}
		        				if(p=="repname"){
		        					typeRep=json.data.results[i].data[p];
		        				}
								if(p=="itemname"){
									typeItem=json.data.results[i].data[p];       					
								}
								if(p=="eventtime"){
									typeTime=json.data.results[i].data[p]; 
									typeTime=typeTime.substr(0,10)+"&nbsp;"+typeTime.substr(11,8);
								}
								if(p=="tag"){
									typeTag=json.data.results[i].data[p];   
								}
								
								if(typeEvent=="tag_added"){
									s="管理员：您订购的<a class='acomRe' target='_blank' href='itemDetails.html?repname="+typeRep+"&itemname="+typeItem+"'>"+typeRep+"/"+typeItem+"</a>新增了一个tag："+typeTag+"。时间为："+typeTime;
	        					}
								if(typeEvent=="tag_deleted"){
									s="管理员：您订购的<a class='acomRe' target='_blank' href='itemDetails.html?repname="+typeRep+"&itemname="+typeItem+"'>"+typeRep+"/"+typeItem+"</a>删除一个tag："+typeTag+"。时间为："+typeTime;				
								}
								if(typeEvent=="item_deleted"){
									s="管理员：您订购的"+typeRep+"/"+typeItem+"被删除。您本次定购的费用将在本月返还给您。用户可点击<a href='javaScript:void(0);'></a>进入billing中心查看。";										
								}
								if(typeEvent=="repo_deleted"){
									s="管理员：您订购的"+typeRep+"被删除。";										
								}
								
		        				
				        	}
		        		}
		        		if(type=="subs_event"){
		        			typeText="订购事件";
		        		}
		        		if(type=="vip_remind"){
		        			typeText="会员续费提醒";
		        			s="管理员：您购买的金牌会员服务，将于30天后到期，请及时续费。<a href='javaScript:void(0);'>点击此处</a>进行续费。";
		        		}
		        		if(type=="apply_whitelist"){
		        			typeText="申请白名单";
		        		}
		        		if(type=="admin_message"){
		        			typeText="管理员消息";
		        		}		        			        		
		        		
		        		$("#terminal-content-body").append(""+
	    	        		"<div class='record'>"+
	    	        			"<div class='head'>"+
	    	        				"<span class='icon'></span>"+
	    	        				"<span class='date'>"+json.data.results[i].time+"</span>"+	
	    	        			"</div>"+
	    	        			"<div class='body'>"+
	    	        				"<div class='info'>"+
	    	        					"<div class='box'>"+
	    									"<p ID='title' style='font-size:16px; color: #000000;padding-top:20px;'>"+typeText+"</p>"+
	    									"<p ID='description' style='font:12px; color: #666666;padding-top:15px; padding-bottom:15px'>"+s+"</p>"+
	    								"</div>"+
	    							"</div>"+
	    	        			"</div>"+
	    	        		"</div>"	    	        	
		                 ); 
		        	}
	        	}else{
	        		$("#terminal-content-body").append("<p class='text-center'>暂无请求数据</p>");
	        	}
	        	
	    	        	      	
	        }
	    });
	}
       
	$(".pages").pagination(allrepnum, {
        maxentries:allrepnum,
        items_per_page: size,
        num_display_entries: 5,
        num_edge_entries: 5 ,
        prev_text:"上一页",
        next_text:"下一页",
        ellipse_text:"...",
        link_to:"javascript:void(0)",
        callback:pagechange,
        load_first_page:false
    });
    
	return allrepnum;
}

//获取数据拥有方详情
function ajaxReUser(){
    var username = getParam("username");
    $.ajax({
        url: ngUrl+"/users/"+username,
        type: "get",
        cache:false,
        data:{},
        async:false,
        dataType:'json',
        success:function(json){
            if(json.code == 0){
                $("#userName").text(json.data.userName);
                $("#userCom").text(json.data.comment);
            }else {
                console.log("报错");
            }
        }
    });
}

//获取url参数
function getParam(key) {
	var value='';
	var itemid = new RegExp("\\?.*"+key+"=([^&]*).*$");
	if (itemid.test(decodeURIComponent(window.location.href))) {
		value = itemid.exec(decodeURIComponent(window.location.href))[1];
	}
	return value;
}

