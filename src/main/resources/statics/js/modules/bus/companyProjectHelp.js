function editDetail(xianId,companyId,projectId) {
    window.location.href = "familyselect.html?xianAndCom=" + xianId+","+companyId+","+projectId;
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
    var projectId = $.getUrlParam('projectId');
    var par = 'projectCompany/list';
    if (projectId != null) {
    	 vm.projectId = projectId;
        par = 'projectCompany/list?projectId=' + projectId;
    }
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
            {label: 'ID', name: 'id', index: 'id', width: 80, key: true},
            {label: '项目名称', name: 'projectName', index: 'projectName', width: 180},
            {label: '项目ID', name: 'projectId', index: 'project_Id', hidden:true},
            {label: '项目资金', name: 'price', index: 'price', width: 80},
            {label: '经济组织ID', name: 'companyId', index: 'company_id', hidden:true},
            {label: '经济组织名称', name: 'companyName', index: 'company_Name', width: 80},
            {label: '县市区ID', name: 'xianId', index: 'xian_id', hidden: true},
            {label: '县市区', name: 'xianName', index: 'xian_Name', width: 180},
            {label: '项目状态', name: 'state', index: 'state', formatter: stateFormat, width: 100},
            {
                label: '操作', name: '', index: 'operate', width: 150, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail = "";
                    detail += "&nbsp;&nbsp;<button type='button'  onclick=\"editDetail('" + rowObject.xianId +","+ rowObject.companyId+","+ rowObject.projectId + "')\">绑定贫困户</button>";
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
            // 隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });

    function stateFormat(cellvalue, options, rowObject) {
        if (cellvalue == 0) {
            return "等待下发";
        }
        if (cellvalue == 1) {
            return "已下发";
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
        vo: {}
    },
    beforeRouteLeave(to, from, next) {
    	alert(to.name);
    	 if (to.name == 'Two') {
    	  to.query.temp = this.selVal;
    	 }
    	 next();
    },
    methods: {
        query: function () {
            vm.reload();
        },
        mounted() {
        	 if (this.$route.query.temp) {
        	  this.temp = this.$route.query.temp;
        	 }
        },
        add: function () {
        	  
            vm.showList = false;
            vm.title = "新增";
            var id = vm.projectId;
            
          
            if (id == null) {
                return;
            }
        
            vm.vo={};
            
            vm.vo.projectId =id;
            vm.vo.id = null;
           
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
            alert("555"+id);
            vm.showList = false;
            vm.title = "修改";

            vm.getInfo(id)
        },
        saveOrUpdate: function (event) {
            var url = vm.vo.id == null ? "projectCompany/save" : "projectCompany/update";

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
        getInfo: function (id) {
            $.get(baseURL + "projectCompany/info/" + id, function (r) {
                vm.vo = r.vo;
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