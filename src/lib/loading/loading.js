var loading = function (){
    var loadingObjId;
    //生成ID
    var setId = function () {
            return ("loading" + ($(".load_mask").length + 1));
    }
    var init = function(){
        loadingObjId = setId();
//        loadingHtml = "<div id='"+loadingObjId+"' class=load_mask>" +
        loadingHtml = "<div  class='load_mask'>" +
                        "<img class='load_img' src='../admin/assets/plugins/loading/image/loading.gif'/>"+
                        "</div>";
        renderTo(loadingHtml);
    }


    var renderTo = function (objHtml) {
        $("body").append(objHtml);
    }
    var setMaskArea = function(){
        var window_height = document.body.scrollHeight;//可视区域加滚动条区域
        $(".load_mask").css("height",window_height+"px");
    }

    /**
     * 转换当前页面的密码控件显示
     * @param converFlag 值为boolean类型，ture：改变密码控件的显示方式，false：恢复密码控件显示方式
     */
    var converPwd = function(converFlag){
        //当页面存在消息框时不执行
        var pwdItems = $("embed,object");
        if(pwdItems.length==0){return;}
        for(var i=0;i<pwdItems.length;i++){
            var objId = pwdItems[i].id+"_conver"
            if(converFlag){
                $(pwdItems[i]).css("visibility","hidden");//.hide();
            }else{
                $("#"+objId).remove();
                $(pwdItems[i]).css("visibility","visible");
            }
        }
    }
    this.loadingOpen = function(){
        converPwd(true);
        setMaskArea();
        $(".load_mask").show();
    }

    this.loadingClose = function(){
        //后继开发人员不要在这里使用延时调用，这样会有影响，影响的地方（页面存在密码框时，请求后台并弹出message时出现问题）
        converPwd(false);
        $(".load_mask").hide();
    }
    init();
}