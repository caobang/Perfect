$(function () {
    $.util.namespace("tel");
    window.tel.bindGrid = function () {
        $("#telGrid").datagrid({
            url: 'Tel/GetData',
            border: false,
            fit: true,
            rownumbers: true,
            idField: 'ID',
            queryParams: {
                groupID: window.tel.groupID,
                name: function () { return $("#txtName").val(); }
            },
            columns: [[
            { field: 'ck', checkbox: true },
            { field: 'Name', title: '姓名', width: 150, sortable: true },
            { field: 'Sex', title: '性别', width: 150, sortable: true },
            { field: 'TelPhone', title: '电话', width: 150, sortable: true },
            { field: 'Address', title: '地址', width: 150, sortable: true },
            { field: 'GroupName', title: '所属组名', width: 150, sortable: true },
            {
                field: 'opt', title: '操作', width: 80, align: 'center',
                formatter: function (value, rowData, rowIndex) {
                    var editbtn = $("<a></a>").linkbutton({ plain: true, iconCls: "icon-standard-user-edit" }).attr("onclick", 'javascript:window.tel.update(\'' + rowData.ID + '\');');
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
                        title: "联系人添加",
                        height: 170,
                        topMost: false,
                        href: "Tel/Add",
                        autoVCenter: true,
                        autoHCenter: true,
                        autoCloseOnEsc: true,
                        enableApplyButton: false,
                        onSave: function (dialog) {
                            var success = $(dialog).form("validate");
                            if (!success) {
                                return false;
                            }
                            var tel = $(dialog).form('getData');
                            $.post("Tel/AddEntity", tel, function (data) {
                                $("#telGrid").datagrid("reload");
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
                    var rows = $("#telGrid").datagrid('getSelections');
                    if (rows.length == 0) { $.messager.show({ icon: "warning", msg: "请勾选要删除的项" }); }
                    else {
                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].ID);
                        }
                        $.post("Tel/DeleteEntities", { IDs: ids.join(',') }, function (data) {
                            $("#telGrid").datagrid("reload");
                            $("#telGrid").datagrid('clearSelections');
                            $.messager.show(data);
                        });
                    }
                }
            }, '-', {
                id: 'btnrefresh',
                text: '刷新',
                iconCls: 'icon-standard-table-refresh',
                handler: function () {
                    $("#telGrid").datagrid("reload");
                }
            }],
            pagination: true,
            sortName: "ID"
        });
    };
    window.tel.bindButton = function () {
        $("#btnSearch").click(function () {
            $('#telGrid').datagrid('load', {
                name: $("#txtName").val()
            });
        });
    };
    window.tel.update = function (ID) {
        $.easyui.showDialog({
            title: "联系人编辑",
            height: 170,
            topMost: false,
            href: "Tel/Update?ID=" + ID,
            autoVCenter: true,
            autoHCenter: true,
            autoCloseOnEsc: true,
            enableApplyButton: false,
            onSave: function (dialog) {
                var success = $(dialog).form("validate");
                if (!success) {
                    return false;
                }
                var tel = $(dialog).form('getData');
                $.extend(tel, { ID: ID });
                $.post("Tel/UpdateEntity", tel, function (data) {
                    $("#telGrid").datagrid("reload");
                    $.messager.show(data);
                })
            }
        });
    }
});