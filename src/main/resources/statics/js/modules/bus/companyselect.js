$(function () {
	(function ($) {
		  $.getUrlParam = function (name) {
		   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		   var r = window.location.search.substr(1).match(reg);
		   if (r != null) return unescape(r[2]); return null;
		  }
		 })(jQuery);
		var Fno = $.getUrlParam('fno');
		
		var par ='company/list';
		if(Fno != null){
			par ='company/list?familyNo='+Fno;
		}
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
			{ label: '流水号', name: 'id', index: 'id', width: 80,key: true },
			{ label: '公司名称', name: 'companyName', width: 80 },
			{ label: '产业类别', name: 'industryTypeName',  width: 80 },
			{ label: '是否龙头企业', name: 'longtouVaule',  width: 80 },
			{ label: '三品一标', name: 'bands', width: 80 }
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
		longtous:[],
		chanyeNo:'',
		longtouNo:'',
		industryNo:'',
		chooseLongtouNo:'',
		blank:[{id:0,name:"请选择"}]
	},
	methods: {
		subIndustrys: function(value){
			alert(value);
			//alert(baseURL + "sys/dict/"+value);
			$.get(baseURL + "sys/dict/"+value, function(result){
				
				vm.industrys = result;
			});
		},
		longtouqiye: function(value){
			$.get(baseURL + "sys/dict/"+value, function(result){
				vm.longtous = result;
			});
		},
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.vo = {};
		},
		update: function (event) {
			var id = getSelectedRow();
			if(id == null){
				return ;
			}
			
		
            confirm('确定要选中的记录？', function() {
            	$.get(baseURL + "company/info/"+id, function(r){
            		vm.vo = r.vo;
            		alert('操作成功', function(){
            			
            			if (window.opener != null && !window.opener.closed) {
            		          window.opener.rs(id,r.vo.companyName);
            		         
            		      	window.close();
            		      } 
            			
    					
    				
    					 });
    				

                });
            });
        	
		},
		saveOrUpdate: function (event) {
		
			var url = vm.vo.id == null ? "company/save" : "company/update";
		
			
			vm.vo.industryNo = vm.chanyeNo;
//			vm.vo.industryNo = vm.industryNo;
//			vm.vo.industryTypeName = vm.industrys.find(item => item.code === vm.industryNo)['value'];
			
			vm.vo.isHeadCompany = vm.longtouNo;
//			vm.vo.chooseLongtouNo = vm.chooseLongtouNo;
//			vm.vo.isHeadCompany = vm.longtous.find(item => item.code === vm.chooseLongtouNo)['value'];
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
				    url: baseURL + "company/delete",
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
		   
			$.get(baseURL + "company/info/"+id, function(r){
				alert(r.companyName);
//                vm.vo = r.vo;
//				vm.chanyeNo = vm.vo.chanyeNo;
//				vm.vo.id=  r.vo.id;
//				vm.industryNo = vm.vo.industryNo;
				//vm.subIndustrys(vm.vo.chanyeNo);
            });
			
			
		},
		reload: function (event) {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{
                postData:{'companyName': vm.q.companyName},
                page:page
            }).trigger("reloadGrid");
		}
	}
});