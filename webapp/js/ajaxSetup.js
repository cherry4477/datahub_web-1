$.ajaxSetup({
   // timeout:3000,
	error:function(json){
		if(json.statusText=="timeout"){
			errorDialog(99,"",""); 
		}else{
	    	if(json.status==400){
	    		errorDialog(json.status,$.parseJSON(json.responseText).code,$.parseJSON(json.responseText).msg);			            
	    	}else{
	    		errorDialog(json.status,"","");            
	    	}
		}
        $('#errorDM').modal('show');
    }
//    complete:function(XHR,TextStatus){
//    	alert(TextStatus);
//        if(TextStatus=='timeout'){
//        	errorDialog("888888","",""); 
//        	$('#errorDM').modal('show');
//        }
//    }
});
