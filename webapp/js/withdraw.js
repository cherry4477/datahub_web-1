/**
 * Created by Max cheng on 2016/2/1.
 */

$(document).ready(function(){
    Validate();
});
//js验证密码必须为大小写字母和数字组成
    function checkPass(pass){
        if(pass.length < 6){  return 0; }
        var ls = 0;
        if(pass.match(/([a-z])+/)){  ls++; }
        if(pass.match(/([0-9])+/)){  ls++; }
        if(pass.match(/([A-Z])+/)){   ls++; }
        if(pass.match(/[^a-zA-Z0-9]+/)){ ls++;}
        return ls;
    }
function Validate(){
    $("#newPWD").blur(function(){
        var newPWD =$("#newPWD").val();
        var refPWD =$("#refPWD").val();
        if(newPWD.length==0){
            $("#label_zero").show().siblings().hide();
            $("#label_zero").fadeOut(2000);
            return false;
        }
        if(newPWD.length<8){
            $("#label_two").show().siblings().hide();
            $("#label_two").fadeOut(2000);
            return false;
        }
        if(checkPass(newPWD)<2){
            $("#label_one").show().siblings().hide();
            $("#label_one").fadeOut(2000);
            return false ;
        }
    });
    $("#refPWD").blur(function(){
        if(refPWD.length==0){
            $("#label_four").show().siblings().hide();
            $("#label_four").fadeOut(2000);
            return false;
        }
        if(newPWD!=refPWD){
            $("#label_five").show().siblings().hide();
            $("#label_five").fadeOut(2000);
            return false;
        }
    });
    return true;
}


function SubmitForm(){
    if(Validate()){
        var con;
        con=confirm("请牢记您的密码,确认执行该操作吗？");
        if(con==true){
            document.InfoForm.submit();
        }
    }
}

