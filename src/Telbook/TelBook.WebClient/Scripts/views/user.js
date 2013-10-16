$(function () {
    $.util.namespace("user");
    window.user.bindGrid = function () {
        $("#userGrid").datagrid({
            url: 'User/GetData',
            border: false,
            fit: true,
            rownumbers: true,
            idField: 'ID',
            queryParams: {
                username: function () { return $("#txtUserName").val(); }
            },
            columns: [[
            { field: 'ck', checkbox: true },
            { field: 'UserName', title: '用户名', width: 150,sortable:true },
            { field: 'Name', title: '姓名', width: 150, sortable: true },
            { field: 'RoleName', title: '角色', width: 150},
            { field: 'LastLoginDate', title: '最后登录时间', width: 150, sortable: true },
            {
                field: 'opt', title: '操作', width: 80, align: 'center',
                formatter: function (value, rowData, rowIndex) {
                    var editbtn = $("<a></a>").linkbutton({ plain: true, iconCls: "icon-standard-user-edit" }).attr("onclick", 'javascript:window.user.update(\'' + rowData.ID + '\');');
                    var div = $("<div></div>").append(editbtn);
                    return div.html();
                }
            }
            ]],
            toolbar: [{
                id: 'btnadd',
                text: '添加',
                iconCls: 'icon-standard-user-add',
                handler: function () {
                    $.easyui.showDialog({
                        title: "用户添加",
                        height: 140,
                        topMost: false,
                        href: "User/Add",
                        autoVCenter: true,
                        autoHCenter: true,
                        autoCloseOnEsc: true,
                        enableApplyButton: false,
                        onSave: function (dialog) {
                            var success = $(dialog).form("validate");
                            if (!success) {
                                return false;
                            }
                            var user = $(dialog).form('getData');
                            $.post("User/AddEntity", user, function (data) {
                                $("#userGrid").datagrid("reload");
                                $.messager.show(data);
                            })
                        }
                    });

                }
            }, '-', {
                id: 'btncut',
                text: '删除',
                iconCls: 'icon-standard-user-delete',
                handler: function () {
                    var ids = [];
                    var rows = $("#userGrid").datagrid('getSelections');
                    if (rows.length == 0) { $.messager.show({ icon: "warning", msg: "请勾选要删除的项" }); }
                    else {
                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].ID);
                        }
                        $.post("User/DeleteEntities", { IDs: ids.join(',') }, function (data) {
                            $("#userGrid").datagrid("reload");
                            $("#userGrid").datagrid('clearSelections');
                            $.messager.show(data);
                        });
                    }
                }
            }, '-', {
                id: 'btnrefresh',
                text: '刷新',
                iconCls: 'icon-standard-table-refresh',
                handler: function () {
                    $("#userGrid").datagrid("reload");
                }
            }],
            pagination: true,
            sortName: "ID"
        });
    };
    window.user.bindButton = function () {
        $("#btnSearch").click(function () {
            $('#userGrid').datagrid('load', {
                username: $("#txtUserName").val()
            });
        });
    };
    window.user.update = function (ID) {
        $.easyui.showDialog({
            title: "用户编辑",
            height: 140,
            topMost: false,
            href: "User/Update?ID="+ID,
            autoVCenter: true,
            autoHCenter: true,
            autoCloseOnEsc: true,
            enableApplyButton: false,
            onSave: function (dialog) {
                var success = $(dialog).form("validate");
                if (!success) {
                    return false;
                }
                var user = $(dialog).form('getData');
                $.extend(user, { ID: ID });
                $.post("User/UpdateEntity", user, function (data) {
                    $("#userGrid").datagrid("reload");
                    $.messager.show(data);
                })
            }
        });
    }
});