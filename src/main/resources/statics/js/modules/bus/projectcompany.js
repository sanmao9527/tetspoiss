function editDetail(xianId,companyId,projectId) {
    window.location.href = "familyselect.html?xianAndCom=" + xianId+","+companyId+","+projectId;
}

function cuoshi(xianId,companyId,projectId) {
    window.location.href = "indistryhelp.html?xianAndCom=" + xianId+","+companyId+","+projectId;
}
function  rs(companyid,companyName){
	
	vm.ccid= companyid;
	vm.ccname = companyName;
	
	
	vm.vo.companyName = vm.ccname;
	vm.vo.companyId = vm.ccid;
	
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
    var projects = decodeURI($.getUrlParam('projectId'));
    var pro ;
    var projectId;
    if(projects !=null){
    	pro = projects.split(",");
    	 vm.xianId = pro[1];
    	 projectId =pro[0];
    	 vm.projectName = pro[2];
    }
  
   
    var par = 'projectCompany/list';
    if (projectId != null) {
    	 vm.projectId = pro[0];
        par = 'projectCompany/list?projectId=' + projectId+"&xianId="+vm.xianId;
    }
    $("#jqGrid").jqGrid({
        url: baseURL + par,
        datatype: "json",
        colModel: [
            {label: 'ID', name: 'id', index: 'id', width: 80, key: true},
            {label: '项目名称', name: 'projectName', index: 'projectName', width: 180},
            {label: '经济组织ID', name: 'companyId', index: 'company_id', width: 120},
            {label: '项目ID', name: 'projectId', index: 'project_id', width: 120},

            {label: '县市区Id', name: 'xianId', index: 'xian_id', width: 80},
            {label: '县市区', name: 'xianName', index: 'xian_Name', width: 80},
            {label: '经济组织名称', name: 'companyName', index: 'company_Name', width: 120},
            {label: '项目资金', name: 'price', index: 'price', width: 80},
            {label: '项目状态', name: 'state', index: 'state', formatter: stateFormat, width: 100},
            {
                label: '操作', name: '', index: 'operate', width: 200, align: 'center',
                formatter: function (cellvalue, options, rowObject) {
                    var detail ="&nbsp;&nbsp;<button type='button'  onclick=\"cuoshi('" + rowObject.xianId +","+ rowObject.companyId+","+ rowObject.projectId + "')\">帮扶措施</button>";
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

var options = [
  { text: '请选择', value: '' },
  { text: '重点项目', value: '0' },
  { text: '一般项目', value: '1' }
];

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
        ccid:'',
        ccname:'',
        projectName:'',
		levelOptions: [],
        moneySource:''
    },
    created(){
    	
    	this.levelOptions = options;
    	this.vo.projectLevel = this.levelOptions[0].value;
    },
    methods: {
        query: function () {
            vm.reload();
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
            vm.vo.xianId = vm.xianId;
            vm.vo.projectName = vm.projectName;
            vm.vo.id = null;
           
        },
        chooseCompany:function(projectId){
        	
        	
        	 window.open( "companyselect.html?projectId=" + projectId);
        	
        	//vm.vo.companyId =1;
        	
        	 vm.vo.companyName =vm.vo.companyName;
        	 vm.vo.companyId =vm.vo.companyId;
        	// vm.vo.companyId =vm.ccid;
        
        	alert(vm.vo.companyId);
        	 
        },
        update: function (event) {
            var id = getSelectedRow();
            if (id == null) {
                return;
            }
        
            vm.showList = false;
            vm.title = "修改";
          
           
            vm.getInfo(id);
            vm.vo.xianId = vm.xianId;
            
        },
        saveOrUpdate: function (event) {
            var url = vm.vo.id == null ? "projectCompany/save" : "projectCompany/update";
            vm.vo.moneySource = vm.moneySource;
            vm.vo.projectLevel = 1;

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
                vm.moneySource = vm.vo.moneySource;
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
