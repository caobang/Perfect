$(function () {
    $.util.namespace("telgroup");
    window.telgroup.bindGrid = function () {
        $("#telGroupGrid").datagrid({
            url: 'TelGroup/GetData',
            border: false,
            fit: true,
            rownumbers: true,
            idField: 'ID',
            queryParams: {
                groupname: function () { return $("#txtGroupName").val(); }
            },
            columns: [[
            { field: 'ck', checkbox: true },
            { field: 'Name', title: '组名', width: 150, sortable: true },
            {
                field: 'opt', title: '操作', width: 80, align: 'center',
                formatter: function (value, rowData, rowIndex) {
                    var editbtn = $("<a></a>").linkbutton({ plain: true, iconCls: "icon-standard-group-edit" }).attr("onclick", 'javascript:window.telgroup.update(\'' + rowData.ID + '\');');
                    var div = $("<div></div>").append(editbtn);
                    return div.html();
                }
            }
            ]],
            toolbar: [{
                id: 'btnadd',
                text: '添加',
                iconCls: 'icon-standard-group-add',
                handler: function () {
                    $.easyui.showDialog({
                        title: "联系人组添加",
                        height: 140,
                        topMost: false,
                        href: "TelGroup/Add",
                        autoVCenter: true,
                        autoHCenter: true,
                        autoCloseOnEsc: true,
                        enableApplyButton: false,
                        onSave: function (dialog) {
                            var success = $(dialog).form("validate");
                            if (!success) {
                                return false;
                            }
                            var group = $(dialog).form('getData');
                            $.extend(group, { UserID: window.telgroup.userID });
                            $.post("TelGroup/AddEntity", group, function (data) {
                                $("#telGroupGrid").datagrid("reload");
                                $.messager.show(data);
                            })
                        }
                    });

                }
            }, '-', {
                id: 'btncut',
                text: '删除',
                iconCls: 'icon-standard-group-delete',
                handler: function () {
                    var ids = [];
                    var rows = $("#telGroupGrid").datagrid('getSelections');
                    if (rows.length == 0) { $.messager.show({ icon: "warning", msg: "请勾选要删除的项" }); }
                    else {
                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].ID);
                        }
                        $.post("TelGroup/DeleteEntities", { IDs: ids.join(',') }, function (data) {
                            $("#telGroupGrid").datagrid("reload");
                            $("#telGroupGrid").datagrid('clearSelections');
                            $.messager.show(data);
                        });
                    }
                }
            }, '-', {
                id: 'btnrefresh',
                text: '刷新',
                iconCls: 'icon-standard-table-refresh',
                handler: function () {
                    $("#telGroupGrid").datagrid("reload");
                }
            }],
            pagination: true,
            sortName: "ID"
        });
    };
    window.telgroup.bindButton = function () {
        $("#btnSearch").click(function () {
            $('#telGroupGrid').datagrid('load', {
                groupname: $("#txtGroupName").val()
            });
        });
    };
    window.telgroup.update = function (ID) {
        $.easyui.showDialog({
            title: "联系人组编辑",
            height: 140,
            topMost: false,
            href: "TelGroup/Update?ID=" + ID,
            autoVCenter: true,
            autoHCenter: true,
            autoCloseOnEsc: true,
            enableApplyButton: false,
            onSave: function (dialog) {
                var success = $(dialog).form("validate");
                if (!success) {
                    return false;
                }
                var group = $(dialog).form('getData');
                $.extend(group, { ID: ID, UserID: window.telgroup.userID });
                $.post("TelGroup/UpdateEntity", group, function (data) {
                    $("#telGroupGrid").datagrid("reload");
                    $.messager.show(data);
                })
            }
        });
    }
});