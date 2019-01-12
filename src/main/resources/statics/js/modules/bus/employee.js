function editDetail(phone,id,cunId) {
    window.location.href = "empfamilyselect.html?xianAndCom=" + phone+","+id+","+cunId;
}

function cuoshi(phone,id,cunId) {
    window.location.href = "zhidaoFamilyMain.html?xianAndCom=" +  phone+","+id+","+cunId;
}
$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'emp/help/list',
        datatype: "json",
        colModel: [
            { label: 'id', name: 'id', index: 'id', width: 80 },
			{ label: '名称', name: 'name', index: 'name', width: 80 },
			{ label: '单位', name: 'unit', index: 'unit', width: 80 }, 			
			{ label: '职务', name: 'title', index: 'title', width: 80 }, 			
			{ label: '电话', name: 'phone', index: 'phone', width: 80 }, 			
			{ label: '所指导的村', name: 'cun', index: 'cun', width: 80 },
			{ label: '所指导的村Id', name: 'cunId', index: 'cun_id' },
			{ label: '主导产业', name: 'industry', index: 'industry', width: 80 }, 	
			{ label: '备注', name: 'desc', index: 'desc', width: 80 },
			{
                label: '操作', name: '', index: 'operate', width: 200, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail ="&nbsp;&nbsp;<button type='button'  onclick=\"cuoshi('" + rowObject.phone +","+ rowObject.id+","+ rowObject.cunId + "')\">贫困户管理</button>";
                    detail += "&nbsp;&nbsp;<button type='button'  onclick=\"editDetail('" + rowObject.phone +","+ rowObject.id+","+ rowObject.cunId+ "')\">绑定贫困户</button>";
                    return detail;
                }
            }
		],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var vm = new Vue({
	el:'#rrapp',
	data:{
        q:{
            name: null
        },
		showList: true,
		title: null,
		dict: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.dict = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.dict.id == null ? "emp/help/save" : "emp/help/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.dict),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (event) {
			var ids = getSelectedRows();
			if(ids == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "emp/help/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(baseURL + "emp/help/info/"+id, function(r){
                vm.dict = r.dict;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'name': vm.q.name},
                page:page
            }).trigger("reloadGrid");
		}
	}
});