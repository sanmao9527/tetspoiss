$(function () {
	(function ($) {
		  $.getUrlParam = function (name) {
		   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		   var r = window.location.search.substr(1).match(reg);
		   if (r != null) return unescape(r[2]); return null;
		  }
		 })(jQuery);
		var Fnos = $.getUrlParam('fno');
	
		var pros = Fnos.split(",");
		var Fno = pros[0];
		vm.familyNo = Fno;
		if(pros.length >1){
			var zdyId = pros[1];
			vm.zdyId = zdyId;
			var cunId = pros[2];
			var phone = pros[3];
			vm.cunId = cunId;
			vm.zhidaoyuanPhone = phone;
		}
		
		var par ='family/industry/list';
		if(Fno != null){
			par ='family/industry/list?familyNo='+Fno;
		}
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
			{ label: '流水号', name: 'id', index: 'id', width: 80 ,key: true},
			{ label: '户编号', name: 'familyNo', index: 'family_no', width: 80 },
			{ label: '产业类别', name: 'industryName', index: 'industryName', width: 80 },
			{ label: '指导员电话', name: 'zhidaoyuanPhone', index: 'zhidaoyuanPhone', width: 80 },
			{ label: '规模', name: 'amount', index: 'amount', width: 80 },
			{ label: '收益', name: 'payin', index: 'payin', width: 80 },
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
			familyNo: null
        },
		showList: true,
		title: null,
		vo: {},
		industrys:[],
		chanyeNo:'',
		zdyId:'',
		zhidaoyuanPhone:'',
		cunId:'',
		industryNo:'',
		familyNo:'',
		blank:[{id:0,name:"请选择"}]
	},
	methods: {
		subIndustrys: function(value){
			$.get(baseURL + "sys/dict/"+value, function(result){
				vm.industrys = result;
			});
		},
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.vo = {};
			vm.vo.familyNo = vm.familyNo;
			vm.vo.zhidaoyuanId = vm.zdyId;
			vm.vo.cunId = vm.cunId;
			vm.vo.zhidaoyuanPhone = vm.zhidaoyuanPhone;
		},
		choosefamily:function(){
        	
        	
       	 window.open( "familyselect.html");
       	
       	//vm.vo.companyId =1;
       	
       	 vm.vo.companyName =vm.vo.companyName;
       	 vm.vo.companyId =vm.vo.companyId;
       	// vm.vo.companyId =vm.ccid;
       
       	alert(vm.vo.companyId);
       	 
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
			var url = vm.vo.id == null ? "family/industry/save" : "family/industry/update";
			vm.vo.chanyeNo = vm.chanyeNo;
			vm.vo.industryNo = vm.industryNo;
			vm.vo.industryName = vm.industrys.find(item => item.code === vm.industryNo)['value'];

			// alert(vm.industryNo)
			// var value = vm.industrys.find(item => {item.code == vm.industryNo});
			// alert(value)
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
				    url: baseURL + "family/industry/delete",
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
			$.get(baseURL + "family/industry/info/"+id, function(r){
                vm.vo = r.vo;
				vm.chanyeNo = vm.vo.chanyeNo;
				vm.industryNo = vm.vo.industryNo;
				vm.subIndustrys(vm.vo.chanyeNo);
            });
			
			
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'familyNo': vm.q.familyNo},
                page:page
            }).trigger("reloadGrid");
		}
	}
});