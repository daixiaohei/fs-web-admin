/**
 * 服务器端分页初始化数据表格
 * @param resultId 表格id 格式“#Search_Result”
 * @param tableId 表格id 格式“sample_1” 默认为‘sample_1’
 * @param titleAndcolumns 标题，字段 格式“[{'title':'checkbox','column':'id'},{'title':'完成时间','column':'endTime'}]”
 * @param ajaxUrl 异步请求地址,以?结尾，便于用get拼接请求参数
 * @param paramData 查询请求参数，json格式
 * @param fnRowCallback 改变行内容的回调fn，可为空
 * @param fnDrawCallback run some code on table redraw
 * @param isRadio 是否为单选框，默认为复选框，可为空
 * @param withoutPageSize 是否显示分页条数，默认为显示，可为空
 * @param firstIsnotCheckbox 表头第一列不为checkbox,默认为checkbox，可为空
 */
var initTableDateOnServer = function(resultId,tableId,titleAndcolumns,ajaxUrl,paramData,fnRowCallback,fnDrawCallback,isRadio,withoutPageSize,columnDefsParams) {
    this.oTable;
    var columnsParams = []; // set columns mode
//    var columnDefsParams=[{
//        "targets": [0], // 目标列位置，下标从0开始
//        "bSearchable": false,
//        'bSortable': false,
//        "render": function(data, type, full) { // 返回自定义内容
//            if(!firstIsnotCheckbox){
//                return '<div class="checker"><span><input type="checkbox" class="checkboxes" value="'+data+'"/></span></div>';
//            }
//        }
//    }];
    var addColumnsParams=function(value) {
        columnsParams.push({"data": value});
    }
    var tableId = tableId?tableId:'sample_1';
    var tableHtml = '<table class="table table-border table-bordered table-bg table-hover dataTable no-footer" id="'+tableId+'" style="z-index:1">';
    tableId='#'+tableId;
    var theadHtml='<thead><tr>';
    var checkboxHtml='<th class="table-checkbox sorting_disabled" role="columnheader" rowspan="1" colspan="1" ><div class="checker"><span class=""><input type="checkbox" class="group-checkable" data-set="'+tableId+' .group-checkable"></span></div></th>';
    $.each(titleAndcolumns,function(i,item){

        addColumnsParams(item.column);
        if(i==0){
            if(item.title==='checkbox'){
                theadHtml+=checkboxHtml;
            }else{
                columnDefsParams=null;
                theadHtml+='<th width='+item.width+'>';
                theadHtml+=item.title;
                theadHtml+='</th>';
            }
        }else{
            theadHtml+='<th width='+item.width+'>';
            theadHtml+=item.title;
            theadHtml+='</th>';
        }
    });
    theadHtml+='</tr></thead>';
    tableHtml+=theadHtml;
    tableHtml+='</table>';
    $('#'+resultId).empty();
    $('#'+resultId).html(tableHtml);
    this.oTable = $(tableId).dataTable( {
        "sPaginationType": "bootstrap_extended_jump",
        "bSort":false,
        "bProcessing": true,
        "bServerSide": true,
        'bPaginate': true,  //是否分页。
        'bFilter': false,  //是否使用内置的过滤功能
        'bLengthChange': !withoutPageSize, //是否允许自定义每页显示条数
        "sAjaxSource": ajaxUrl+'?'+paramData,
        "columns":columnsParams,
        "columnDefs":columnDefsParams,
        "fnRowCallback": fnRowCallback,
        "fnDrawCallback":fnDrawCallback,
        "aLengthMenu": [
            [10, 25, 50,100],
            [10, 25, 50,100] // change per page values here
        ],
        // set the initial value
        "iDisplayLength": 10
    });
    jQuery(tableId+' .group-checkable').change(function () {
        var set = jQuery(this).attr("data-set");
        var checked = jQuery(this).is(":checked");
        if(checked){
            jQuery(this).attr("checked", true);
            jQuery(this).parent('span').addClass("checked");
        }else{
            jQuery(this).attr("checked", false);
            jQuery(this).parent('span').removeClass("checked");
        }
        jQuery(set).each(function () {
            if (checked) {
                $(this).parent('span').addClass("checked");
                $(this).attr("checked", true);
                $(this).parents('tr').addClass("active");
            } else {
                $(this).parent('span').removeClass("checked");
                $(this).attr("checked", false);
                $(this).parents('tr').removeClass("active");
            }
        });
        //jQuery.uniform.update(set);
    });
    jQuery(tableId).on('change', 'tbody tr .checkboxes', function(){
        if(isRadio) {//复选框为单选
            var thisObj = this;
            jQuery(tableId + ' tbody tr .checkboxes:checked').each(
                function () {
                    if (this.checked && this != thisObj) {
                        $(this).attr("checked", false);
                        $(this).parents('tr').removeClass("active");
                        $(this).parents('span').removeClass("checked");
                    }
                }
            );
        }
        var checked = $(this).is(":checked");
        if(checked){
            $(this).attr("checked", true);
            $(this).parents('tr').addClass("active");
            $(this).parents('span').addClass("checked");
        }else{
            $(this).attr("checked", false);
            $(this).parents('tr').removeClass("active");
            $(this).parents('span').removeClass("checked");
        }
    });
    jQuery(tableId+'_wrapper .dataTables_filter input').addClass("form-control input-small input-inline"); // modify table search input
    jQuery(tableId+'_wrapper .dataTables_length select').addClass("form-control input-small"); // modify table per page dropdown

    //分页表格方法
    /**
     * 页面上获取后台返回的数据，
     * 注：只能获取当前加载页的数据
     * tableObj.oTable.DataTable().context[0].aoData ---jquery dataTable 存放后参数据的结构
     */
    this.getData = function(){
        var data=[];
        //表格是否已初始化
        if(this.oTable){
            var jqData = this.oTable.DataTable().context[0].aoData;//获取初始化后
            if(jqData.length>0){
                jqData._aData;
                for(var i=0; i<jqData.length;i++){
                    var newObj={};
                    for(var key in jqData[i]["_aData"]){
                        newObj[key] = jqData[i]["_aData"][key];
                    }
                    data.push(newObj);
                }
            }
        }
        return data;
    }
    /**
     * 返回选中行的数据11
     * @param className 选中时给点的样式，值为：.classStyle
     * @returns {Array}
     */
    this.getSelectData = function(className){
        var rows = [];
        $.each(this.oTable._(className),function(i,rowData){
            rows.push(rowData);
        });
        return rows;
    }

    this.getSelectedRowsDatas=function() {
        var rows = [];
        $.each(this.oTable._('.active'),function(i,rowData){
            rows.push(rowData);
        });
        return rows;
    }
    //通过属性名称以及属性值获取一行数据
    this.getRowByNameAndValue = function(name,value) {
        var jsonData = this.getData();
        var dataLength = jsonData.length;
        var tempData;
        for(var index=0;index<dataLength;index++){
            tempData = jsonData[index];
            if(tempData[name] == value){
                return tempData;
            }
        };
    }
}