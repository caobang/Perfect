(function ($) {

    if (!$.plugin) { $.extend({ plugin: {} }); }


    var _windowDefaults = {
        title: "请选择...",
        iconCls: "icon-select",
        width: 700,
        height: 410,
        closable: true,
        shadow: true,
        modal: true,
        resizable: true,
        draggable: true,
        maximizable: true,
        minimizable: false,
        collapsible: true
    };

    var _getDataGridSelectorWindowOptions = function (options) {
        var windowOptions = {};
        for (var key in options) {
            if (key == "title" || key == "iconCls" || key == "width" || key == "height" || key == "resizable" || key == "collapsible" || key == "draggable") {
                windowOptions[key] = options[key];
            }
        }
        windowOptions = $.extend({}, $.fn.window.defaults, _windowDefaults, windowOptions);
        return windowOptions;
    };
    var _getDataGridSelectorDataGridOptions = function (options) {
        return $.extend({}, $.fn.datagrid.defaults, options, {
            noheader: true,
            fit: true,
            border: false,
            striped: true,
            checkOnSelect: true
        });
    };
    var _getSingleDataGridSelectorCustomOptions = function (options) {
        var customOptions = {
            onBeforeClose: function () { },
            onEnterClick: function () { },
            onCancelClick: function () { },
            selected: null
        };
        for (var key in options) {
            if (key == "onBeforeClose" || key == "onEnterClick" || key == "onCancelClick" || key == "selected") {
                customOptions[key] = options[key];
            }
        }
        return customOptions;
    };

    var _showSingleDataGridSelector = function (options) {
        var windowOptions = _getDataGridSelectorWindowOptions(options);
        var datagridOptions = _getDataGridSelectorDataGridOptions(options);
        var customOptions = _getSingleDataGridSelectorCustomOptions(options);

        var easyuiWindowId = "easyuiWindow" + window.guid().replaceAll("-", "").left(16);
        var easyuiWindow = $("<div />").attr("id", easyuiWindowId);

        var content = $("<div />").addClass("easyui-layout").attr("data-options", "fit: true");

        var layoutSouth = $("<div />").attr("data-options", "region:'south', border: true").addClass("calendar-header").css({
            "text-align": "right",
            "padding": "5px",
            "border-left-width": "0px",
            "border-right-width": "0px",
            "border-bottom-width": "0px",
            "height": "auto",
            "overflow": "hidden"
        });
        var btnEnter = $("<a />").addClass("easyui-linkbutton").text("确定").attr({
            "data-options": "iconCls:'icon-ok', disabled: true",
            "href": "javascript:void(0);"
        });
        var btnCancel = $("<a />").addClass("easyui-linkbutton").text("取消").attr({
            "data-options": "iconCls:'icon-cancel', disabled: true",
            "href": "javascript:void(0);"
        }).css("margin-left", "10px");
        $(layoutSouth).append(btnEnter).append(btnCancel);

        var layoutCenter = $("<div />").attr("data-options", "region:'center',border:false").css({
            "padding": "0px",
            "background": "#fff"
        });
        var datagridId = "datagrid_" + window.guid().replaceAll("-", "");
        var datagrid = $("<table />").attr("id", datagridId);
        $(layoutCenter).append(datagrid);

        var onSelect = function (datagrid, rowData) {
            var idField = $(datagrid).datagrid("options").idField;
            var idValue = rowData[idField];
            if (datagridOptions.singleSelect) {
                customOptions.selected = idValue;
                return;
            }
            if ($.type(customOptions.selected) == "array") {
                if (!customOptions.selected.contains(idValue)) {
                    customOptions.selected.push(idValue);
                }
            }
        };
        var onUnselect = function (datagrid, rowData) {
            var idField = $(datagrid).datagrid("options").idField;
            var idValue = rowData[idField];
            if ($.type(customOptions.selected == "string")) {
                customOptions.selected = "";
            } else {
                customOptions.selected = customOptions.selected.remove(idValue);
            }
        };
        $.extend(datagridOptions, {
            onLoadSuccess: function () {
                $(btnEnter).linkbutton("enable");
                $(btnCancel).linkbutton("enable");
                $(easyuiWindow).prev().find(".panel-tool a").removeAttr("disabled");
                if (!window.isEmptyObjectOrNull(customOptions.selected)) {
                    if ($.type(customOptions.selected) == "string") {
                        $(this).datagrid("selectRecord", customOptions.selected);
                        return;
                    }
                    if ($.type(customOptions.selected) == "array") {
                        var len = customOptions.selected.length;
                        for (var i = 0; i < len; i++) {
                            $(this).datagrid("selectRecord", customOptions.selected[i]);
                        }
                    }
                }
            },
            onSelect: function (rowIndex, rowData) {
                onSelect(this, rowData);
            },
            onSelectAll: function (rows) {
                for (var i = 0; i < rows.length; i++) {
                    onSelect(this, rows[i]);
                }
            },
            onUnselect: function (rowIndex, rowData) {
                onUnselect(this, rowData);
            },
            onUnselectAll: function (rows) {
                for (var i = 0; i < rows.length; i++) {
                    onUnselect(this, rows[i]);
                }
            }
        });
        $(datagrid).datagrid(datagridOptions);

        $(content).append(layoutCenter).append(layoutSouth);
        var _onOpen = windowOptions.onOpen;
        var _onBeforeClose = windowOptions.onBeforeClose;
        var _onClose = windowOptions.onClose;
        $.extend(windowOptions, {
            content: content,
            onOpen: function () {
                $(this).prev().find(".panel-tool a").attr("disabled", "disabled");
                _onOpen.call(this);
            },
            onBeforeClose: function () {
                var selections = $(datagrid).datagrid("getSelections");
                if (customOptions.onBeforeClose.call(this, datagrid, selections) == false) { return false; }
                if (_onBeforeClose.call(this) == false) { return false; }
                return true;
            },
            onClose: function () {
                _onClose.apply(this, arguments);
                $(this).window("destroy");
            }
        });
        $(easyuiWindow).window(windowOptions);

        $(btnEnter).click(function () {
            if ($(this).linkbutton("options").disabled == true) { return; }
            var selections = $(datagrid).datagrid("getSelections");
            if (customOptions.onEnterClick(datagrid, selections) == false) {
                return;
            }
            $(easyuiWindow).window("close");
        });
        $(btnCancel).click(function () {
            if ($(this).linkbutton("options").disabled == true) { return; }
            var selections = $(datagrid).datagrid("getSelections");
            if (customOptions.onCancelClick(datagrid, selections) == false) {
                return;
            }
            $(easyuiWindow).window("close");
        });
        $(easyuiWindow).window("open");
        var toolbar = null;
        if (!window.isEmptyObjectOrNull(datagridOptions.toolbar)) {
            toolbar = $(easyuiWindow, ".datagrid-toolbar");
        }
        return { easyuiWindow: easyuiWindow, datagrid: datagrid, enterButton: btnEnter, cancelButton: btnCancel, toolbar: toolbar };
    };



























    var _getDoubleDataGridSelectorDataGridOptions1 = function (options) {
        var opts = _getDataGridSelectorDataGridOptions(options);
        $.extend(opts, {
            singleSelect: false,
            remotePaging: false,
            noheader: false,
            title: "待选择项",
            iconCls: null,
            toolbar: null
        });
        return opts;
    };
    var _getDoubleDataGridSelectorDataGridOptions2 = function (options) {
        var result = _getDoubleDataGridSelectorDataGridOptions1(options);
        $.extend(result, {
            url: null,
            queryParams: {},
            remoteSort: false,
            pagination: false,
            noheader: false,
            title: "已经选择项",
            iconCls: null
        });
        return result;
    };

    var _showDoubleDataGridSelector = function (options) {
        var windowOptions = _getDataGridSelectorWindowOptions(options);
        var datagridOptions1 = _getDoubleDataGridSelectorDataGridOptions1(options);
        var datagridOptions2 = _getDoubleDataGridSelectorDataGridOptions2(options);
        var customOptions = _getSingleDataGridSelectorCustomOptions(options);
        $.extend(customOptions, {
            centerWidth: 60,
            toolbar: options.toolbar
        });

        var easyuiWindowId = "dselector_" + window.guid().replaceAll("-", "").left(16);
        var datagridId1 = "datagrid1_" + window.guid().replaceAll("-", "").left(16);
        var datagridId2 = "datagrid2_" + window.guid().replaceAll("-", "").left(16);
        var gridWidth = (windowOptions.width - customOptions.centerWidth) / 2;

        var easyuiWindow = $("<div />").attr("id", easyuiWindowId);
        var content = $("<div />").addClass("easyui-layout").attr("data-options", "fit: true");

        var layoutSouth = $("<div />").attr("data-options", "region:'south',border:false").css({
            "text-align": "right",
            "padding": "5px",
            "border-top": "1px solid #8DB2E3",
            "background-color": "#E0ECFF"
        });
        var btnEnter = $("<a />").addClass("easyui-linkbutton").text("确定").attr({
            "data-options": "iconCls: 'icon-ok', disabled: true",
            "href": "javascript:void(0);"
        });
        var btnCancel = $("<a />").addClass("easyui-linkbutton").text("取消").attr({
            "data-options": "iconCls: 'icon-cancel', disabled: true",
            "href": "javascript:void(0);"
        }).css("margin-left", "10px");
        $(layoutSouth).append(btnEnter).append(btnCancel);

        var layoutNorth = null;
        if (!window.isEmptyObjectOrNull(customOptions.toolbar)) {
            var toolbar = $("<div/>").addClass("dialog-toolbar").append($(customOptions.toolbar)).css({
                "padding-left": "10px",
                "background-color": "#efefef"
            });
            var panelHeight = $(toolbar).height();
            if (panelHeight < 35) { panelHeight = 35; }
            layoutNorth = $("<div />").attr({
                "data-options": "region:'north',border: false"
            }).css({
                "height": panelHeight + "px",
                "overflow": "hidden",
                "background-color": "#efefef",
                "border-bottom-width": "1px"
            });
            $(layoutNorth).append(toolbar);
        }
        var layoutWest = $("<div />").attr({
            "data-options": "region:'west',border: false"
        }).css({ "width": gridWidth + "px" });
        var layoutCenter = $("<div />").attr({
            "data-options": "region:'center',border: false"
        }).css({
            "text-align": "center",
            "padding-top": "60px",
            "border-left-width": "1px",
            "border-right-width": "1px",
            "background-color": "#efefef"
        });
        var layoutEast = $("<div />").attr({
            "data-options": "region:'east',border: false"
        }).css({ "width": gridWidth + "px" });

        var datagrid1 = $("<table />").attr("id", datagrid1);
        var datagrid2 = $("<table />").attr("id", datagrid2);

        $(layoutWest).append(datagrid1);
        $(layoutEast).append(datagrid2);

        var select = function (rowData) {
            var idField = $(datagrid2).datagrid("options").idField;
            var idValue = (window.isEmptyObjectOrNull(idField) ? rowData : rowData[idField]);
            var exists = $(datagrid2).datagrid("getRowIndex", idValue) > -1;
            if (rowData && !window.isEmptyObjectOrNull(rowData) && !exists) {
                $(datagrid2).datagrid("appendRow", rowData);
                //                var index = $(datagrid1).datagrid("getRowIndex", rowData);
                //                $(datagrid1).datagrid("deleteRow", index);
            }
        };
        var unselect = function (rowData) {
            if (rowData && !window.isEmptyObjectOrNull(rowData)) {
                var idField = $(datagrid2).datagrid("options").idField;
                var idValue = (window.isEmptyObjectOrNull(idField) ? rowData : rowData[idField]);
                var index = $(datagrid2).datagrid("getRowIndex", idValue);
                if (index > -1) {
                    $(datagrid2).datagrid("deleteRow", index);
                }
                //            if ($(datagrid1).datagrid("getRowIndex", rowData) < 0) {
                //                $(datagrid1).datagrid("appendRow", rowData);
                //            }
            }
        };
        var getRow = function (rows, idField, idValue) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i][idField] == idValue) {
                    return rows[i];
                }
            }
            return null;
        };

        $.extend(datagridOptions1, {
            onLoadSuccess: function (data) {
                $(btnEnter).linkbutton("enable");
                $(btnCancel).linkbutton("enable");
                $(easyuiWindow).prev().find(".panel-tool a").removeAttr("disabled");
                var opts = $(this).datagrid("options");
                if (!opts._onLoadSuccess) {
                    if (!window.isEmptyObjectOrNull(customOptions.selected)) {
                        var opts = $(this).datagrid("options");
                        var idField = opts.idField;
                        var rows = opts.cacheData;
                        var temps = new Array();
                        var len = 0;
                        if (rows && rows.rows && rows.rows.length) {
                            len = rows.rows.length;
                        }
                        for (var i = 0; i < len; i++) {
                            temps.push(rows.rows[i]);
                        }
                        if ($.type(customOptions.selected) == "string") {
                            var row = getRow(temps, idField, customOptions.selected);
                            if (!window.isEmptyObjectOrNull(row)) {
                                select(row);
                            }
                            return;
                        }
                        if ($.type(customOptions.selected) == "array") {
                            len = customOptions.selected.length;
                            for (var i = 0; i < len; i++) {
                                var row = getRow(temps, idField, customOptions.selected[i]);
                                if (!window.isEmptyObjectOrNull(row)) {
                                    select(row);
                                }
                            }
                        }
                    }
                    opts._onLoadSuccess = true;
                }
            },
            onDblClickRow: function (rowIndex, rowData) {
                select(rowData);
            }
        });
        $.extend(datagridOptions2, {
            onDblClickRow: function (rowIndex, rowData) {
                unselect(rowData);
            }
        });

        $(datagrid1).datagrid(datagridOptions1);
        $(datagrid2).datagrid(datagridOptions2);
        if (datagridOptions1.pagination) { $(datagrid1).datagrid("getPager").pagination({ displayMsg: "" }); }
        if (datagridOptions2.pagination) { $(datagrid2).datagrid("getPager").pagination({ displayMsg: "" }); }

        var br1 = $("<br />");
        var br2 = $("<br />");
        var br3 = $("<br />");
        var btn1 = $("<a />").addClass("easyui-linkbutton").attr("data-options", "iconCls: 'icon-pagination-last', plain: true").attr("title", "选择全部");
        var btn2 = $("<a />").addClass("easyui-linkbutton").attr("data-options", "iconCls: 'icon-pagination-next', plain: true").attr("title", "选择勾选部分");
        var btn3 = $("<a />").addClass("easyui-linkbutton").attr("data-options", "iconCls: 'icon-pagination-prev', plain: true").attr("title", "取消勾选部分");
        var btn4 = $("<a />").addClass("easyui-linkbutton").attr("data-options", "iconCls: 'icon-pagination-first', plain: true").attr("title", "取消全部");

        $(btn1).click(function () {
            var selections = $(datagrid1).datagrid("getRows");
            if ($.type(selections) == "array") {
                var temps = new Array();
                for (var i = 0; i < selections.length; i++) {
                    temps.push(selections[i]);
                }
                selections = temps;
                for (var i = 0; i < selections.length; i++) {
                    select(selections[i]);
                }
            }
            $(datagrid1).datagrid("unselectAll");
        });
        $(btn2).click(function () {
            var selections = $(datagrid1).datagrid("getSelections");
            if ($.type(selections) == "array") {
                var temps = new Array();
                for (var i = 0; i < selections.length; i++) {
                    temps.push(selections[i]);
                }
                selections = temps;
                for (var i = 0; i < selections.length; i++) {
                    select(selections[i]);
                }
            }
            $(datagrid1).datagrid("unselectAll");
        });
        $(btn3).click(function () {
            var selections = $(datagrid2).datagrid("getSelections");
            if ($.type(selections) == "array") {
                var temps = new Array();
                for (var i = 0; i < selections.length; i++) {
                    temps.push(selections[i]);
                }
                selections = temps;
                for (var i = 0; i < selections.length; i++) {
                    unselect(selections[i]);
                }
            }
            $(datagrid2).datagrid("unselectAll");
        })
        $(btn4).click(function () {
            while ($(datagrid2).datagrid("getRows").length > 0) {
                unselect($(datagrid2).datagrid("getRows")[0]);
            }
            $(datagrid2).datagrid("unselectAll");
        })
        $(layoutCenter).append(btn1).append(br1).append(btn2).append(br2).append(btn3).append(br3).append(btn4);

        $(content).append(layoutNorth).append(layoutWest).append(layoutCenter).append(layoutEast).append(layoutSouth);
        var _onOpen = windowOptions.onOpen;
        var _onBeforeClose = windowOptions.onBeforeClose;
        var _onClose = windowOptions.onClose;
        $.extend(windowOptions, {
            content: content,
            onOpen: function () {
                $(this).prev().find(".panel-tool a").attr("disabled", "disabled");
                _onOpen.call(this);
            },
            onBeforeClose: function () {
                var selections = $(datagrid2).datagrid("getRows");
                if (customOptions.onBeforeClose.call(this, datagrid1, datagrid2, selections) == false) { return false; }
                if (_onBeforeClose.call(this) == false) { return false; }
                return true;
            },
            onClose: function () {
                _onClose.apply(this, arguments);
                $(this).window("destroy");
            }
        });
        $(easyuiWindow).window(windowOptions);
        $(btnEnter).click(function () {
            if ($(this).linkbutton("options").disabled == true) { return; }
            var selections = $(datagrid2).datagrid("getRows");
            if (customOptions.onEnterClick(datagrid1, datagrid2, selections) == false) {
                return;
            }
            $(easyuiWindow).window("close");
        });
        $(btnCancel).click(function () {
            if ($(this).linkbutton("options").disabled == true) { return; }
            var selections = $(datagrid2).datagrid("getRows");
            if (customOptions.onCancelClick(datagrid1, datagrid2, selections) == false) {
                return;
            }
            $(easyuiWindow).window("close");
        });
        $(easyuiWindow).window("open");
        $(easyuiWindow).window("options").onResize = function (width, height) {
            var needResize = false;
            if (width < 720) { width = 720; needResize = true; }
            if (height < 440) { height = 440; needResize = true; }
            if (needResize) { $(this).window("resize", { width: width, height: height }); return; }
            var panelWidth = (width - customOptions.centerWidth) / 2;
            $(layoutWest).panel("resize", { width: panelWidth });
            $(layoutEast).panel("resize", { width: panelWidth });
        };
        var toolbar = null;
        if (!window.isEmptyObjectOrNull(customOptions.toolbar)) {
            toolbar = $(layoutNorth, ".dialog-toolbar");
        }
        return { easyuiWindow: easyuiWindow, datagrid1: datagrid1, datagrid2: datagrid2, enterButton: btnEnter, cancelButton: btnCancel, toolbar: toolbar };
    };







    $.extend($.plugin, {

        _ssdgs: function (options) {
            return _showSingleDataGridSelector(options);
        },

        showSingleDataGridSelector: function (options) {
            return window.top.$.plugin._ssdgs(options);
        },

        _sddgs: function (options) {
            return _showDoubleDataGridSelector(options);
        },

        showDoubleDataGridSelector: function (options) {
            return window.top.$.plugin._sddgs(options);
        }
    });


})(jQuery);



