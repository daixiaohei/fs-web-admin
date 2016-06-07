/**
 * 单例生成loading控件
 * @param Container_id
 * @returns {{}}
 */
var loadingObj;
//var createMask = function(){
//    return function(){
//        return loadingObj || ( loadingObj = new loading());
//    }
//}
//createMask()();



/**
 * 列表点击查询前验证当前用户是否已超时
 * @returns {boolean} 超时返加true，不超时返回false;
 */
function isSessionTimeOut(){
    var data = getJSON("/check",null);
    if(data.success==true){
        return false;
    }else{
        return true;
    }
}


/**
 * 用于获取需要提交内容的值，以JSON返回，返回格式:[{name1:value},{name2:value}]
 * @param Container_id 容器ID
 */
function getSubmitItems(Container_id){
    var data ={};
   // var elements = jQuery("input,select,textarea",$("#"+Container_id));
   var elements = jQuery("input,select,textarea",document.forms[0]);
    for(var i=0; i < elements.length;i++){
        var isok = false;
        //input 类型
        if(elements[i].nodeName=="INPUT"){
            if("text,hidden,password".indexOf(elements[i].type)!=-1){
                isok =  true;
            }
            if("radio".indexOf(elements[i].type)!=-1){
                if(elements[i].checked){
                    isok =  true;
                }
            }
        }
        if(elements[i].nodeName=="SELECT"){
                isok =  true;
        }
        if(elements[i].nodeName=="TEXTAREA"){
                isok =  true;
        }
        if(isok){
/*            var id = elements[i].id.trim();
            var name = elements[i].name.trim();
            var value = elements[i].value.trim();*/
            var id = $.trim(elements[i].id);
            var name = $.trim(elements[i].name);
            var value = $.trim(elements[i].value);
            data[name]=value;
        }
    }
    return data;
}

/**
 *调用后台时返回JSON数 据
 *
 * @param url 调用后台的URL
 * @param data 调用时需要的参数 参数格式｛key : value｝
 * @param isAsync 是否同步操作 false同步，true异步
 */
function getJSON(url,data,isAsync,fnCallback){
    var async = true;//false同步，true异步
    if(isAsync!= undefined && isAsync == false){
        async = isAsync;
    }
//    loadingObj.loadingOpen();
    var result = [];
    $.ajax( {
        type : "post",
        url : url,
        cache : false,
        async : false,//同步
        data : data,
        success : function(data) {
            result=data;
            if(fnCallback){
                fnCallback(result);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
        }
    });
//    loadingObj.loadingClose();
    return result;
}

function getJSON2(url,data,isAsync,fnCallback){
    var async = true;//false同步，true异步
    if(isAsync!= undefined && isAsync == false){
        async = isAsync;
    }
//    loadingObj.loadingOpen();
    var result = [];
    $.ajax( {
        type : "get",
        url : url,
        cache : false,
        async : false,//同步
        data : data,
        success : function(data) {
            result=data;
            if(fnCallback){
                fnCallback(result);
            }
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
        }
    });
//    loadingObj.loadingClose();
    return result;
}

/**
 *调用后台时返回JSON数 据
 *
 * @param url 调用后台的URL
 * @param data 调用时需要的参数 参数格式｛key : value｝
 * @param isAsync 是否同步操作 false同步，true异步
 */
function getJSON_notMask(url,data,isAsync){
    var async = true;//false同步，true异步
    if(isAsync!= undefined && isAsync == false){
        async = isAsync;
    }
    var result = [];
    $.ajax( {
        type : "post",
        url : url,
        cache : false,
        async : false,//同步
        data : data,
        success : function(data) {

            result=data;
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
        }
    });

    return result;
}

function forwardToLogin(){
    window.location.href="/login";
}

function refresh(){
    window.location.href = window.location.href;
}





/**
 * 打印返回结果JSON格式
 * @param jsonData
 */
function alertJSON(jsonData){
    alert(JSON.stringify(jsonData));
}

/**
 * 科学计数法 123,456,789.10
 * @param number 数字字符
 * @returns {string}
 */
function scientificNotation(number){
    var money_str  = number+"";
    if(isNaN(money_str)!=false){
        return;
    }

    var money_arry = [];

    var index = money_str.indexOf(".");
    if(index !=-1){
        money_arry = money_str.split(".");
    }else{
        money_arry[0] =money_str;
    }
    var str ="";
    var s1 = money_arry[0];
    var index =1;
    for(var i=s1.length-1; i>=0;i--){
        var a = s1.charAt(i);
        str =a+str;
        if(index%3==0 && index<s1.length){
            str = ","+str;
        }
        index++;
    }
    if(money_arry.length>1){str+="."+money_arry[1]}
    //alert(str);
    return str;
}

/**
 * 银行账号每四位分隔 方便用户查看
 * @param bankCode 银行账号
 * @param length 每隔多少个字符
 * @param charStr 加入的字符
 * @returns {string} 返回转换后的字符账号
 */
function bankNoConvert(bankCode,length,charStr){
    var bankNo = bankCode+"";
    var reg = new RegExp("(\\S{" + length + "})","g");
    bankNo = bankNo.replace(reg,"$1"+charStr);
    return bankNo;
}

/**
 * 还原被转换过的银行卡号
 * @param bankCode 被转换过的银行卡号
 * @param charStr 需要还原的字符
 */
function bankNoRestore(bankNo,charStr){
    var bankCode =  bankNo.replace("",charStr);
    return bankCode;
}


/**
 *
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



/**
 * 根据字符格式
 * 获取当天开始时间 如 2014-06-12
 * @param format 时间格式
 * @returns {*}
 */
function getTodayBeginTime(){
    var dateTemp=new Date();
    dateTemp.setHours(0);
    dateTemp.setMinutes(0);
    dateTemp.setSeconds(0);
    return dateTemp.Format('yyyy-MM-dd hh:mm:ss');
}

/**
 * 获取当天结束时间 如 2014-06-12 23:59:59
 * @returns {*}
 */
/**
 * 获取当天结束时间 如 2014-06-12 23:59:59
 * @param format 时间格式
 * @returns {*}
 */
function getTodayEndTime(){
    var dateTemp=new Date();
    dateTemp.setHours(23);
    dateTemp.setMinutes(59);
    dateTemp.setSeconds(59);
    return dateTemp.Format('yyyy-MM-dd hh:mm:ss');
}




/**
 * 获取当天时间 2012-05-12
 * @returns {string}
 */
function getDate(){
    var myDate = new Date();
    var yy = myDate.getYear();        //获取当前年份(2位)
    var yyyy = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var mm = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    var dd = myDate.getDate();        //获取当前日(1-31)
    return yyyy + "-" + mm + "-" + dd;//
}


/**
 * 获取当天时间 2012-05-12
 * @returns {string}
 */
function getDateTime(start){
    var myDate = new Date();
    var yy = myDate.getYear();        //获取当前年份(2位)
    var yyyy = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var mm = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    var dd = myDate.getDate();        //获取当前日(1-31)
    if(start == '0'){
        start = " 00:00:00"
    } else {
        start = " 23:59:59"
    }
    return yyyy + "-" + mm + "-" + dd + start;//
}

/**
 * 获取m个月之前的当天日期 by weizhansong,2014-11-03
 * @returns {string}
 */
function getSomeMonthAgoDate(mparam){
    var myDate = new Date();
    var yy = myDate.getYear();        //获取当前年份(2位)
    var yyyy = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var mm = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    var dd = myDate.getDate();        //获取当前日(1-31)

    if(mparam>=mm){
        mm = mm+ 12 -mparam;
        yyyy = yyyy -1;
    }else{
        mm = mm - mparam;
    }
    return yyyy + "-" + mm + "-" + dd;//
}

function getSomeMonthAgoDateTime(mparam, start){
    var myDate = new Date();
    var yy = myDate.getYear();        //获取当前年份(2位)
    var yyyy = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var mm = myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
    var dd = myDate.getDate();        //获取当前日(1-31)

    if(mparam>=mm){
        mm = mm+ 12 -mparam;
        yyyy = yyyy -1;
    }else{
        mm = mm - mparam;
    }
    if(start == '0'){
        start = " 00:00:00"
    } else {
        start = " 23:59:59"
    }
    return yyyy + "-" + mm + "-" + dd + start;//
}

/**
 * 初始化下拉列表
 * @param id 需要模态select的id
 * @param requrl 异步请求select数据的url
 * @param withoutDefault 是否显示请选择，默认显示
 */
var ajaxInitSelectTab = function(id,ajaxUrl,withoutDefault){
    var json = getJSON(ajaxUrl,null);
    if(json.success){
        //alert("服务器返回页面提交结果：" + JSON.stringify(json));
        if(withoutDefault){
            $(id).select2({
                allowClear: true,
                data:json.result
            });
        }else{
            $(id).select2({
                placeholder: "请选择...",
                allowClear: true,
                data:json.result
            });
        }
    };
}

/**
 * 获得字符串在连接字符串的初始位置
 * @param str 子字符串
 * @param split 分割符号
 */
String.prototype.indexOfSplit = function(str,split){
    str = new String(str);
    if(str == null || str.length==0 || this ==null || this.length==0){
        return -1;
    }
    //alert("str.length:"+str.length+";this.length:"+this.length);
    if(split == null){
        split = ",";
    }
    var tempArr = this.split(split);
    var i =0;
    var index = 0;
    while(i<tempArr.length){
        if(str == tempArr[i]){
            return index;
        }else{
            index = index + tempArr[i].length + 1;
        }
        i++;
    }
    return -1;
}


/**
 * 金额换算 分转元；
 * money:单位分
 */
function moneyConverter(money){
    return money*1/100;
}

function numberConverter(number){
    var numBerStr =number + "";
    if(numBerStr.indexOf('.')==-1){
        return number+".00";
    }else{
        return number;
    }
}

/**
 * 银行账号显示（前4位+******+后4位）
 * @param codeNo
 * @constructor
 */
function subAccountNo(accountNo) {
    var star_str = "";
    for (var i = 0; i < 6; i++) {
        star_str += "*";
    }
    return accountNo.substr(0, 4) + star_str + accountNo.substr(accountNo.length - 4, 4);
}

/**
 * 对公对私金额限制判断
 * @param amount 金额
 * @param isperson  对公或对私
 * @param submit_form  提交form
 * @param nodeid  校验标签ID
 */
function  amountVerification(amount,isperson,submit_form,nodeid){
    if(amount!=""&&isperson!=""&&submit_form!=""&&nodeid!=""){
        if(isperson=="1"){
            if(amount>500000){
                var val ={};
                val[nodeid] = "对私账户不能超过50万";
                $("#"+submit_form).validate().showErrors(val);
                return false;
            }
        }else{
            if(amount>10000000){
                var val ={};
                val[nodeid] = "对公账户不能超过1000万";
                $("#"+submit_form).validate().showErrors(val);
                return false;
            }
        }
    }
    return true;
}
/**
 * 对公对私金额限制判断
 * @param amount 金额
 * @param isperson  对公或对私
 * @param submit_form  提交form
 * @param nodeid  校验标签ID
 */
function  amountVerification1(amount,isperson,submit_form,nodeid){
    if(amount!=""&&isperson!=""&&submit_form!=""&&nodeid!=""){
        if(isperson=="1"){
            if(amount>500000){
                var val ={};
                val[nodeid] = "对私账户不能超过50万";
                $("#"+submit_form).validate().showErrors(val);
                return false;
            }
        }else{
            if(amount>5000000){
                var val ={};
                val[nodeid] = "对公账户不能超过500万";
                $("#"+submit_form).validate().showErrors(val);
                return false;
            }
        }
    }
    return true;
}
/*
* 获取两个时间相隔天数
* */
/*function DateDiff(sDate1, sDate2){  //sDate1和sDate2是2002-12-18格式
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为12-18-2002格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);  //把相差的毫秒数转换为天数
    return iDays;
}*/
/*
*两个时间段是否超过三个月
* */
function DateDiff(sDate1, sDate2){  //sDate1和sDate2是2002-12-18格式
    var times1=sDate1.split("-");
    var times2=sDate2.split("-");
    if(times1[0]==times2[0]){
        if((times2[1]-times1[1])>3){
            return false;
        }else if((times2[1]-times1[1])==3){
            if(times1[2]<times2[2]){
                return false;
            }
        }
    }else if((times2[0]-times1[0])==1){
            var newmonth=parseInt(times2[1])+parseInt(12);
            if((newmonth-times1[1])>3){
                return false;
            }else if((newmonth-times1[1])==3){
                if(times1[2]<times2[2]){
                    return false;
                }
            }
    }else{
        return false;
    }
    return true;
 }
/*
 *两个时间段是否超过三个月
 * */
function DateTimeDiff(sDate1, sDate2){  //sDate1和sDate2是2002-12-18 00:00:00格式
    sDate1 = sDate1.split(" ")[0];
    sDate2 = sDate2.split(" ")[0];
    var times1=sDate1.split("-");
    var times2=sDate2.split("-");
    if(times1[0]==times2[0]){
        if((times2[1]-times1[1])>3){
            return false;
        }else if((times2[1]-times1[1])==3){
            if(times1[2]<times2[2]){
                return false;
            }
        }
    }else if((times2[0]-times1[0])==1){
        var newmonth=parseInt(times2[1])+parseInt(12);
        if((newmonth-times1[1])>3){
            return false;
        }else if((newmonth-times1[1])==3){
            if(times1[2]<times2[2]){
                return false;
            }
        }
    }else{
        return false;
    }
    return true;
}

/**
 *根据登录情况设置错误页面跳转按钮显示
 */
function setUrlForLogin(isLogin) {
    if(isLogin == ""){
        $("#exception_content_link").css("visibility","hidden");
    }else{
        $("#exception_content_link").css("visibility","visible");
    }
}

/*
 * 用于解决JS小数计算的错误，当前为减法
 */
function dcmAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
    try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
    m=Math.pow(10,Math.max(r1,r2));
    return (accMul(arg1,m)-accMul(arg2,m))/m;
}

//乘法函数，用来得到精确的乘法结果
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果
//调用：accMul(arg1,arg2)
//返回值：arg1乘以arg2的精确结果
function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace("." ,""))*Number(s2.replace(".",""))/Math.pow(10,m);
}


/**
 * 过滤非法请求的跨站脚本
 * @param str 验证字符
 * @returns {*} 返回过滤后的字符
 */
function checkXss(str){
    if(str==undefined||str==""){return "";}
    var JAVASCRIPT_KEYWORD_REGEX ="^.*(ACX|SCRIPT|JAVASCRIPT|ALERT|WINDOW|BREAK|DELETE|FUNCTION|RETURN|TYPEOF|CASE|DO|IF|SWITCH|VAR|CATCH|ELSE|IN|THIS|VOID|CONTINUE|FALSE|INSTANCEOF|THROW|WHILE|DEBUGGER|FINALLY|NEW|TRUE|WITH|DEFAULT|FOR|NULL|TRY|ABSTRACT|DOUBLE|GOTO|NATIVE|STATIC|BOOLEAN|ENUM|IMPLEMENTS|PACKAGE|SUPER|BYTE|EXPORT|IMPORT|PRIVATE|SYNCHRONIZED|CHAR|EXTENDS|INT|PROTECTED|THROWS|CLASS|FINAL|INTERFACE|PUBLIC|TRANSIENT|CONST|FLOAT|LONG|SHORT|VOLATILE).*$";
    var  JAVA_KEYWORD_REGEX = "^.*(JAVA|CLASS|ABSTRACT|ASSERT|BOOLEAN|BREAK|BYTE|CASE|CATCH|CHAR|CLASS|CONSTCONTINUE|DEFAULT|DODOUBLE|ELSEENUM|EXTENDS|FINAL|FINALLY|FLOATFOR|GOTO|IF|IMPLEMENTS|IMPORTINSTANCEOF|INT|INTERFACE|LONG|NATIVENEW|PACKAGE|PRIVATE|PROTECTED|PUBLICRETURN|STRICTFP|SHORT|STATIC|SUPERSWITCH|SYNCHRONIZED|THIS|THROW|THROWSTRANSIENT|TRY|VOID|VOLATILE|WHILE).*$";
    var  EVENT_KEYWORD_REGEX = "^.*(CLICK|DBLCLICK|MOUSEDOWN|MOUSEUP|MOUSEOVER|MOUSEMOVE|MOUSEOUT|KEYPRESS|KEYDOWN|KEYUP|ABORT|BEFOREUNLOAD|ERROR|LOAD|MOVE|RESIZE|SCROLL|STOP|UNLOAD|BLUR|CHANGE|FOCUS|RESET|SUBMIT|BOUNCE|FINISH|START|BEFORECOPY|BEFORECUT|BEFOREEDITFOCUS|BEFOREPASTE|BEFOREUPDATE|CTEXTMENU|COPY|CUT|DRAG|DRAGDROP|DRAGEND|DRAGENTER|DRAGLEAVE|DRAGOVER|DRAGSTART|DROP|LOSECAPTURE|PASTE|SELECT|SELECTSTART|AFTERUPDATE|CELLCHANGE|DATAAVAILABLE|DATASETCHANGED|DATASETCOMPLETE|ERRORUPDATE|ROWENTER|ROWEXIT|ROWSDELETE|ROWSINSERTED|AFTERPRINT|BEFOREPRINT|FILTERCHANGE|HELP|PROPERTYCHANGE|READYSTATECHANGE\n).*$";
    str.toUpperCase().replace(JAVASCRIPT_KEYWORD_REGEX, "");
    str.toUpperCase().replace(JAVASCRIPT_KEYWORD_REGEX, "");
    str.toUpperCase().replace(JAVASCRIPT_KEYWORD_REGEX, "");
    return str;
}

/**
 * 字符串长度超出，则截取部分加上省略号显示
 * @param text 被截取的字符
 * @param len  截取长度
 * @returns {string} 返回被截取后的字符串
 */
function overlength(text, len) {
    if(len == undefined){
        len = 10;
    }
    return (text && text.length > len) ? (text.substring(0, len) + "…"): text;
}

/**
 * 获取字符串长度，英文占一个字符，中文占两个字符
 * @param str
 * @returns {number}
 */
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }else {
            len+=2;
        }
    }
    return len;
}


//增加身份证验证
function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }

    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}

function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function getParameterByName(name)  
{  
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");  
  var regexS = "[\\?&]" + name + "=([^&#]*)";  
  var regex = new RegExp(regexS);  
  var results = regex.exec(window.location.search);  
  if(results == null)  
    return "";  
  else  
    return decodeURIComponent(results[1].replace(/\+/g, " "));  
} 
