$(function () {
	
	(function($) {
		$.getUrlParam = function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		}
	})(jQuery);
	var xianAndCom = $.getUrlParam('xianAndCom');
	var pro = xianAndCom.split(",");
	var xianId = pro[0];
	vm.xianId = xianId;
	var companyId = pro[1];
	vm.companyId = companyId;
	vm.projectId = pro[2];
	var par = 'indistry/help/list';
	if (xianAndCom != null) {

		par = 'indistry/help/list?xianId=' + xianId+"&projectId="+vm.projectId;
	}
	
	
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [			
			{ label: '编号', name: 'hlepId', index: 'hlep_id', hidden:true,key: true },
			{ label: '户主姓名', name: 'name', index: 'name', width: 80 }, 		
			{ label: '户编号', name: 'familyNo', index: 'family_No', width: 80 }, 			
			{ label: '帮扶组织', name: 'org', index: 'org', width: 80 }, 			
			{ label: '帮扶方式', name: 'helpMethod', index: 'help_Method', width: 80 }, 			
			{ label: '内容', name: 'desc', index: 'desc', width: 80 }, 			
			{ label: '金额', name: 'payin', index: 'payin', width: 80 },
			{ label: '签字', name: 'sign', index: 'sign', width: 80 }
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
            
            vm.getInfo(id);
		},
		saveOrUpdate: function (event) {
		
                
                var url = vm.dict.hlepId == null ? "indistry/help/save" : "indistry/help/update";
                
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
				    url: baseURL + "indistry/help/delete",
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
			$.get(baseURL + "indistry/help/info/"+id, function(r){
                vm.dict = r.dict;
                vm.dict.hlepId = r.dict.hlepId;
            });
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'name': vm.q.familyNo},
                page:page
            }).trigger("reloadGrid");
		}
	}
});