$(function () {
	(function ($) {
		  $.getUrlParam = function (name) {
		   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		   var r = window.location.search.substr(1).match(reg);
		   if (r != null) return unescape(r[2]); return null;
		  }
		 })(jQuery);
		var Fno = $.getUrlParam('fno');
		
		var par ='family/member/list';
		if(Fno != null){
			par ='family/member/list?fno='+Fno;
		}
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
			{ label: '流水号', name: 'id', index: 'id', width: 80 ,key: true},
			{ label: '户编号', name: 'familyNo', index: 'family_no', width: 80 },
			{ label: '姓名', name: 'name', index: 'name', width: 80 },
			{ label: '户主关系', name: 'housemaster', index: 'housemaster', width: 80 },
			{ label: '身份证号', name: 'idcard', index: 'idcard', width: 80 },
			{ label: '教育情况', name: 'edu', index: 'edu', width: 80 },
			// { label: '在校情况', name: 'studying', index: 'studying', width: 80 },
			{ label: '健康状况', name: 'health', index: 'health', width: 80 },
			{ label: '劳动能力', name: 'workAble', index: 'workAble', width: 80 },
			// { label: '务工情况', name: 'work', index: 'work', width: 80 },
			{ label: '月务工数', name: 'workMonth', index: 'workMonth', width: 80 },
			{ label: '教育情况', name: 'edu', index: 'edu', width: 80 }
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
		vo: {},
		shis:[],
		xians:[],
		zhens:[],
		cuns:[],
		zus:[],
		shi:'',
		xian:'',
		zhen:'',
		cun:'',
		zu:'',
		blank:[{deptId:0,name:"请选择"}]
	},
	methods: {
		subDetps: function(level,value){
			$.get(baseURL + "/sys/dept/subDetps/"+value, function(result){
				if(level == 'shi'){
					vm.shis = result;
					vm.xians = vm.blank;
					vm.zhens = vm.blank;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
					vm.shi='';
					vm.xian='';
					vm.zhen='';
					vm.cun='';
					vm.zu='';
				}
				if(level == 'xian'){
					vm.xians = result;
					vm.zhens = vm.blank;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
					vm.xian='';
					vm.zhen='';
					vm.cun='';
					vm.zu='';
				}
				if(level == 'zhen'){
					vm.zhens = result;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
					vm.zhen='';
					vm.cun='';
					vm.zu='';
				}
				if(level == 'cun'){
					vm.cuns = result;
					vm.zus = vm.blank;
					vm.cun='';
					vm.zu='';
				}
				if(level == 'zu'){
					vm.zus = result;
					vm.zu='';
				}
			});
		},
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.vo = {};
			this.subDetps('shi',0);
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
			var url = vm.vo.id == null ? "family/member/save" : "family/member/update";
			vm.vo.shi = vm.shi;
			vm.vo.xian = vm.xian;
			vm.vo.zhen = vm.zhen;
			vm.vo.cun = vm.cun;
			vm.vo.zu = vm.zu;
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
				    url: baseURL + "family/member/delete",
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
			$.get(baseURL + "family/member/info/"+id, function(r){
                vm.vo = r.vo;
            });
			vm.subDetps('shi',0);
			vm.shi = vm.vo.shi;
			
			// vm.subDetps('xian',vm.shi);
			vm.xian = vm.vo.xian;
			
			// vm.subDetps('xian',vm.shi);
			vm.zhen = vm.vo.zhen;
			
			// vm.subDetps('xian',vm.shi);
			vm.cun = vm.vo.cun;
			
			// vm.subDetps('xian',vm.shi);
			vm.zu = vm.vo.zu;
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