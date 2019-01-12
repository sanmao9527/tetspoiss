function editDetail(projectid,projectName) {
    window.location.href = "projectdesc.html?projectId=" + encodeURI(encodeURI(projectid+","+projectName));
}

$(function () {
    (function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
    })(jQuery);
    var projectLevel = $.getUrlParam('projectLevel');
    var par = 'project/list';
    if (projectLevel != null) {
        par = 'project/list?projectLevel=' + projectLevel;
    }
    par = 'project/list?projectLevel=0';
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
            {label: '项目ID', name: 'id', index: 'id', width: 80, key: true},
            {label: '项目名称', name: 'projectName', index: 'projectName', width: 180},
            {label: '项目资金', name: 'price', index: 'price', width: 80},
            {label: '公文号', name: 'bumphNo', index: 'bumphNo', width: 80},
            {label: '项目描述', name: 'description', index: 'description', width: 180},
            {label: '项目状态', name: 'state', index: 'state',  width: 100,formatter:stateFormat},
            {
                label: '操作', name: '', index: 'operate', width: 150, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail = "<button  onclick='post_project(\"" + rowObject.id + "\")''>下发</button>";
                    detail += "&nbsp;&nbsp;<button type='button'  onclick=\"editDetail('" + rowObject.id+ ","+rowObject.projectName+"')\">编辑详情</button>";
                    return detail;
                }
            }
        ],
        viewrecords: true,
        height: 385,
        rowNum: 10,
        rowList: [10, 30, 50],
        rownumbers: true,
        rownumWidth: 25,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order"
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    function stateFormat(cellvalue, options, rowObject) {
        if (cellvalue == 0) {
            return "初始";
        } else if (cellvalue == 1) {
            return "县级处理";
        }else if (cellvalue == 2) {
            return "高级处理";
        }else if (cellvalue == 3) {
            return "流程完成";
        }else if (cellvalue == 4) {
            return "结束";
        }
    }
});

var vm = new Vue({
    el: '#rrapp',
    data: {
        init: false,
        q: {
            projectName: null
        },
        showList: true,
        title: null,
        vo: {},
        state: ''
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function () {
            vm.showList = false;
            vm.title = "新增";
            vm.vo = {};
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            var url = vm.vo.id == null ? "project/save" : "project/update";

            vm.vo.state = vm.state;
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.vo),
                success: function (r) {
                    if (r.code === 0) {
                        alert('操作成功', function (index) {
                            vm.reload();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        dele: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
          
            vm.title = "删除";
            confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "project/delete/"+id,
                    contentType: "application/json",
				  
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
        getInfo: function (id) {
            $.get(baseURL + "project/info/" + id, function (r) {
                vm.vo = r.vo;
                vm.state = vm.vo.state;
            });
        },
        reload: function (event) {
            // alert(typeof(vm.shi))

            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam', 'page');
            $("#jqGrid").jqGrid('setGridParam', {
                postData: {'name': vm.q.projectName},
                page: page
            }).trigger("reloadGrid");
        }
    }
});