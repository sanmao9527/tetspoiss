function jiating(fno) {
    window.location.href = 'zhidaomember.html?fno='+fno;
}

function fazhan(fno,zhyId,cunId,zhyPhone) {
    window.location.href = "industry.html?fno=" +fno+","+zhyId+","+cunId+","+zhyPhone;
}
$(function() {
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
	var phone = pro[0];
	vm.zhidaoyuanPhone = phone;
	var zdyId = pro[1];
	var cunId = pro[2];
	vm.zhidaoyuanId = zdyId;
    vm.cunId = cunId;
    vm.zhidaoyuanPhone = phone;
	var par = 'emp/help/listMain';
	if (xianAndCom != null) {

		par = 'emp/help/listMain?cunId=' + cunId+"&zhidaoyuanId="+zdyId;
	}
	$("#jqGrid").jqGrid({
		url : baseURL + par,
		datatype : "json",
		colModel : [ {
			label : '序号',
			name : 'familyNo',
			index : "family_No",
			hidden:true
		}, {
			label : '户主姓名',
			name : 'familyName',
			index : "family_name",
			sortable : false,
			width : 25
		}, {
			label : '户编号',
			name : 'familyNo',
			sortable : false,
			width : 50,
			key : true
		},  {
			label : '村',
			name : 'cun',
			width : 35
		}, 
		{
			label : '组',
			name : 'zu',
			width : 25
		},
		
		{
            label: '操作', name: '', index: 'operate', width: 200, align: 'center',
            formatter: function (cellvalue, options, rowObject) {
                var detail ="&nbsp;&nbsp;<button type='button'  onclick=\"jiating('" + rowObject.familyNo   + "')\">家庭成员信息</button>";
                detail += "&nbsp;&nbsp;<button type='button'  onclick=\"fazhan('" + rowObject.familyNo + ","+vm.zhidaoyuanId + ","+vm.cunId+ ","+vm.zhidaoyuanPhone + "')\">产业发展情况</button>";
                return detail;
            }
        }
		],
		viewrecords : true,
		height : 385,
		rowNum : 10,
		rowList : [ 10, 30, 50 ],
		rownumbers : true,
		rownumWidth : 25,
		autowidth : true,
		multiselect : true,
		pager : "#jqGridPager",
		jsonReader : {
			root : "page.list",
			page : "page.currPage",
			total : "page.totalPage",
			records : "page.totalCount"
		},
		prmNames : {
			page : "page",
			rows : "limit",
			order : "order"
		},
		gridComplete : function() {
			// 隐藏grid底部滚动条
			$("#jqGrid").closest(".ui-jqgrid-bdiv").css({
				"overflow-x" : "hidden"
			});
		}
	});
	vm.subDetps('shi', 0);
});

// 菜单树
var menu_ztree;
var menu_setting = {
	data : {
		simpleData : {
			enable : true,
			idKey : "menuId",
			pIdKey : "parentId",
			rootPId : -1
		},
		key : {
			url : "nourl"
		}

	},
	check : {
		enable : true,
		nocheckInherit : true
	}
};

// 部门结构树
var dept_ztree;
var dept_setting = {
	data : {
		simpleData : {
			enable : true,
			idKey : "deptId",
			pIdKey : "parentId",
			rootPId : -1
		},
		key : {
			url : "nourl"
		}
	}
};

// 数据树
var data_ztree;
var data_setting = {
	data : {
		simpleData : {
			enable : true,
			idKey : "deptId",
			pIdKey : "parentId",
			rootPId : -1
		},
		key : {
			url : "nourl"
		}
	},
	check : {
		enable : true,
		nocheckInherit : true,
		chkboxType : {
			"Y" : "",
			"N" : ""
		}
	}
};

var vm = new Vue({
	el : '#rrapp',
	data : {
		q : {
			familyNo : null,
			deptId : null
		},
		zhidaoyuanPhone:'',
		zhidaoyuanId:'',
		cunId:'',
		showList : true,
		title : null,
		role : {
			deptId : null,
			deptName : null
		},
		shis : [],
		xians : [],
		zhens : [],
		cuns : [],
		zus : [],
		shi : 0,
		xian : 0,
		zhen : 0,
		cun : 0,
		zu : 0,
		blank : [ {
			deptId : 0,
			name : "请选择"
		} ]
	},
	methods : {
		query : function() {
			vm.reload();
		},
		subDetps : function(level, value) {
			$.get(baseURL + "/sys/dept/subDetps/" + value, function(result) {
				vm.q.deptId = value;
				vm.q.level = "zu_id";
				if (level == 'shi') {
					vm.shis = result;
					vm.xians = vm.blank;
					vm.zhens = vm.blank;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
					vm.q.level = "";
				}
				if (level == 'xian') {
					vm.xians = result;
					vm.zhens = vm.blank;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
					vm.q.level = "shi_id";
				}
				if (level == 'zhen') {
					vm.zhens = result;
					vm.cuns = vm.blank;
					vm.zus = vm.blank;
					vm.q.level = "xian_id";
				}
				if (level == 'cun') {
					vm.cuns = result;
					vm.zus = vm.blank;
					vm.q.level = "zhen_id";
				}
				if (level == 'zu') {
					vm.zus = result;
					vm.q.level = "cun_id";
				}
			});
		},
		add : function() {
			vm.showList = false;
			vm.title = "新增";
			vm.role = {
				deptName : null,
				deptId : null
			};
			vm.getMenuTree(null);

			vm.getDept();

			vm.getDataTree();
		},
		update : function(event) {
			
			var familyNo = getSelectedRows();
			if (familyNo == null) {
				return;
			}
			var phone = vm.zhidaoyuanPhone;
			var zdyId = vm.zhidaoyuanId;
			
			confirm('确定要绑定选中的记录？', function() {
				
				alert('操作成功', function(){
					// // vm.reload();
					history.go(-1);
					 });
				for (var i = 0; i < familyNo.length; i++) {

					var p = {
						"familyNo" : familyNo[i],
						"zhidaoyuanPhone" : phone,
						"zhidaoyuanId" : zdyId
					};
					// var ps = familyNo[i];

					console.log(p);

					$.ajax({
						type : "post",
						url : baseURL + "family/industry/bangding",
						contentType : "application/json",
						data : JSON.stringify(p),

						success : function(r) {
							if (r.code == 0) {
								 
							} else {
								//alert(r.msg);
							}
						}
					});
					
				}

			});
			
		},

		del : function() {
			var fptzIds = getSelectedRows();
			if (fptzIds == null) {
				return;
			}
			alert(JSON.stringify(fptzIds));
			
			if(confirm('确定要删除选中的记录？')){
				$.ajax({
					type : "POST",
					url : baseURL + "",
					contentType : "application/json",
					data : JSON.stringify(fptzIds),
					success : function(r) {
						if (r.code == 0) {
//							alert('操作成功', function() {
//								///vm.reload();
//							});
						} else {
							///alert(r.msg);
						}
					}
				});
			}else{
				return false;
			}
			
		},
		getRole : function(fptzId) {
			$.get(baseURL + "sys/role/info/" + fptzId, function(r) {
				vm.role = r.role;

				// 勾选角色所拥有的菜单
				var menuIds = vm.role.menuIdList;
				for (var i = 0; i < menuIds.length; i++) {
					var node = menu_ztree.getNodeByParam("menuId", menuIds[i]);
					menu_ztree.checkNode(node, true, false);
				}

				// 勾选角色所拥有的部门数据权限
				var deptIds = vm.role.deptIdList;
				for (var i = 0; i < deptIds.length; i++) {
					var node = data_ztree.getNodeByParam("deptId", deptIds[i]);
					data_ztree.checkNode(node, true, false);
				}

				vm.getDept();
			});
		},
		saveOrUpdate : function() {
			// 获取选择的菜单
			var nodes = menu_ztree.getCheckedNodes(true);
			var menuIdList = new Array();
			for (var i = 0; i < nodes.length; i++) {
				menuIdList.push(nodes[i].menuId);
			}
			vm.role.menuIdList = menuIdList;

			// 获取选择的数据
			var nodes = data_ztree.getCheckedNodes(true);
			var deptIdList = new Array();
			for (var i = 0; i < nodes.length; i++) {
				deptIdList.push(nodes[i].deptId);
			}
			vm.role.deptIdList = deptIdList;

			var url = vm.role.fptzId == null ? "sys/role/save"
					: "sys/role/update";
			$.ajax({
				type : "POST",
				url : baseURL + url,
				contentType : "application/json",
				data : JSON.stringify(vm.role),
				success : function(r) {
					if (r.code === 0) {
						alert('操作成功', function() {
							vm.reload();
						});
					} else {
						alert(r.msg);
					}
				}
			});
		},
		getMenuTree : function(fptzId) {
			// 加载菜单树
			$.get(baseURL + "sys/menu/list", function(r) {
				menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r);
				// 展开所有节点
				menu_ztree.expandAll(true);

				if (fptzId != null) {
					vm.getRole(fptzId);
				}
			});
		},
		getDataTree : function(fptzId) {
			// 加载菜单树
			$.get(baseURL + "family/master/list", function(r) {
				data_ztree = $.fn.zTree.init($("#dataTree"), data_setting, r);
				// 展开所有节点
				data_ztree.expandAll(true);
			});
		},
		getDept : function() {
			// 加载部门树
			$.get(baseURL + "family/master/list", function(r) {
				dept_ztree = $.fn.zTree.init($("#deptTree"), dept_setting, r);
				var node = dept_ztree.getNodeByParam("deptId", vm.role.deptId);
				if (node != null) {
					dept_ztree.selectNode(node);

					vm.role.deptName = node.name;
				}
			})
		},
		deptTree : function() {
			layer.open({
				type : 1,
				offset : '50px',
				skin : 'layui-layer-molv',
				title : "选择部门",
				area : [ '300px', '450px' ],
				shade : 0,
				shadeClose : false,
				content : jQuery("#deptLayer"),
				btn : [ '确定', '取消' ],
				btn1 : function(index) {
					var node = dept_ztree.getSelectedNodes();
					// 选择上级部门
					vm.role.deptId = node[0].deptId;
					vm.role.deptName = node[0].name;

					layer.close(index);
				}
			});
		},
		reload : function() {
			vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam', 'page');
			$("#jqGrid").jqGrid('setGridParam', {
				postData : {
					'familyNo' : vm.q.familyNo,
					'deptId' : vm.q.deptId,
					"level" : vm.q.level
				},
				page : page
			}).trigger("reloadGrid");
		}
	}
});