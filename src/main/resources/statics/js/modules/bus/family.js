$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'family/list',
        datatype: "json",
        colModel: [
			{ label: '流水号', name: 'fptzId', index: 'fptz_id', width: 80 ,key: true},
			{ label: '户编号', name: 'familyNo', index: 'family_no', width: 80 },
			{ label: '户主', name: 'name', index: 'name', width: 80 },
			{ label: '地址', name: 'address', index: 'address', width: 80 },
			{ label: '贫困等级', name: 'level', index: 'level', width: 80 },
			{ label: '致贫原因', name: 'reson', index: 'reson', width: 80 },
			{ label: '人均收入', name: 'payin', index: 'payin', width: 80 }
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
		init: false,
        q:{
            name: null
        },
		showList: true,
		title: null,
		vo: {},
		shis:[],
		xians:[],
		zhens:[],
		cuns:[],
		zus:[],
		shi:0,
		xian:0,
		zhen:0,
		cun:0,
		zu:0,
		blank:[{deptId:0,name:"请选择"}]
	},
	methods: {
		query: function () {
			vm.reload();
		},
		subDetps: function(level,value){
			$.get(baseURL + "/sys/dept/subDetps/"+value, function(result){
				if(level == 'shi'){
					vm.shis = result;
					vm.xians = vm.blank;
					vm.zhens = vm.blank;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
				}
				if(level == 'xian'){
					vm.xians = result;
					vm.zhens = vm.blank;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
				}
				if(level == 'zhen'){
					vm.zhens = result;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
				}
				if(level == 'cun'){
					vm.cuns = result;
					vm.zus = vm.blank;
				}
				if(level == 'zu'){
					vm.zus = result;
				}
			});
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.vo = {};

			vm.subDetps('shi',0);
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
			var url = vm.vo.fptzId == null ? "family/save" : "family/update";
			vm.vo.shiId = vm.shi;
			vm.vo.xianId = vm.xian;
			vm.vo.zhenId = vm.zhen;
			vm.vo.cunId = vm.cun;
			vm.vo.zuId = vm.zu;

			vm.vo.shi = vm.shis.find(item => item.deptId === vm.shi)['name'];
			vm.vo.xian = vm.xians.find(item => item.deptId === vm.xian)['name'];
			vm.vo.zhen = vm.zhens.find(item => item.deptId === vm.zhen)['name'];
			vm.vo.cun = vm.cuns.find(item => item.deptId === vm.cun)['name'];
			vm.vo.zu = vm.zus.find(item => item.deptId === vm.zu)['name'];
			vm.vo.address = vm.vo.shi+vm.vo.xian+vm.vo.zhen+vm.vo.cun+vm.vo.zu;
			
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.vo),
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
				    url: baseURL + "family/delete",
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
			$.get(baseURL + "family/info/"+id, function(r){
                vm.vo = r.vo;
				vm.shi = vm.vo.shiId;
				vm.xian = vm.vo.xianId;
				vm.zhen = vm.vo.zhenId;
				vm.cun = vm.vo.cunId;
				vm.zu = vm.vo.zuId;
				
				vm.shis = vm.vo.deptSelects.shi;
				vm.xians = vm.vo.deptSelects.xian;
				vm.zhens = vm.vo.deptSelects.zhen;
				vm.cuns = vm.vo.deptSelects.cun;
				vm.zus = vm.vo.deptSelects.zu;

            });

			
		},
		reload: function (event) {
			// alert(typeof(vm.shi))

            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'name': vm.q.name},
                page:page
            }).trigger("reloadGrid");
		}
	}
});