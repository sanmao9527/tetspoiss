function editDetail(projectid,xianId,projectName) {
    window.location.href = "../bus/projectcompany.html?projectId=" + encodeURI(encodeURI(projectid+","+xianId+","+projectName));
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
  
   
    
    vm.projectId = projectId;
  
    var par = 'projectdesc/list';
    if (projectId != null) {
        par = 'projectdesc/list?projectId=' + projectId;
    }
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
            {label: 'id', name: 'id', index: 'id', width: 80, key: true},
            {label: '项目名称', name: 'projectName', index: 'projectName', width: 180},
            {label: '项目资金', name: 'price', index: 'price', width: 80},
            {label: '市', name: 'deptShiName', index: 'deptShiName', width: 80},
            {label: '县', name: 'deptXianName', index: 'deptXianName', width: 80},
            {label: '县ID', name: 'rowObject', index: 'deptXianId', hidden: true},
            {label: '执行单位', name: 'executeUnit', index: 'executeUnit', width: 80},
            {label: '财政支持环节与内容', name: 'content', index: 'content', width: 120},
            {label: '项目描述', name: 'description', index: 'description', width: 180},
            {label: '项目状态', name: 'stateName',  index: 'stateName', width: 100},
            {
                label: '操作', name: '', index: 'operate', width: 150, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail = "<button  onclick='post_project(\"" + rowObject.projectId + "\")''>下发</button>";
                    detail += "&nbsp;&nbsp;<button  onclick='editDetail(\"" + rowObject.projectId +","+rowObject.deptXianId+","+rowObject.projectName+ "\")''>绑定经济组织</button>";
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
        vo: {},
        shis: [],
        xians: [],
        shi: 0,
        xian: 0,
        projectId: null
    },
    methods: {
        query: function () {
            vm.reload();
        },
        subDetps: function (level, value) {
            if (!value){
                return;
            }
            $.get(baseURL + "/sys/dept/subDetps/" + value, function (result) {
                if (level == 'shi') {
                    vm.shis = result;
                    vm.xians = vm.blank;
                }
                if (level == 'xian') {
                    vm.xians = result;
                }
            });
        },
        add: function (event) {
            vm.showList = false;
            vm.title = "新增";
            var id = vm.projectId;

            if (id == null) {
                return;
            }
           
            vm.vo={};
            vm.vo.projectId =id;
            vm.vo.id = null;
            vm.subDetps('shi', 0);
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
        	
            var url = vm.vo.id == null ? "projectdesc/save" : "projectdesc/update";
            vm.vo.deptShiId = vm.shi;
            vm.vo.deptXianId = vm.xian;
//            vm.vo.deptShiName = vm.shis.find(item => item.deptId === vm.shi)['name'];
//            vm.vo.deptXianName = vm.xians.find(item => item.deptId === vm.xian)['name'];
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
            $.get(baseURL + "projectdesc/info/" + id, function (r) {
                vm.vo = r.vo;
                vm.shi=r.vo.deptShiId;
                vm.xian=r.vo.deptXianId;

                vm.shis=r.sels.shis;
                vm.xians=r.sels.xians;
                
                // $.get(baseURL + "sys/dept/allDetps/" + vm.shi+"/0", function (r) {
                //     vm.shis=r.vo.shis;
                //     vm.xians=r.vo.xians;
                // });
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