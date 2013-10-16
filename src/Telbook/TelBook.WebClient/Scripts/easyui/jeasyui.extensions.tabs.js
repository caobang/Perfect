////////////////////////////////////////////////////////////////////////////////////////////////
/// 扩展 easyui-tabs，使其在原功能基础上增加如下属性、功能或者方法：
/// 1、添加默认的鼠标单击选项卡头右键菜单，该菜单涵盖如下条目：
///     关闭选项卡
///     关闭其他选项卡
///     刷新选项卡
///     关闭左侧选项卡
///     关闭右侧选项卡
///     关闭所有选项卡
///     重复选项卡
/// 2、所有的选项卡添加如下自定义属性：
///     refreshable: 该属性表示选项卡是否启用刷新按钮；
///     iniframe: 该属性表示该选项卡是通过 iframe 方式加载还是通过 ajax 方式加载（注意，此属性只有在调用 easyui-tabs 的 add 方法动态添加选项卡时方能生效，对于通过 html 代码预先定义的 tab 无效）；
/// 3、对于可关闭的选项卡，快速双击选项卡标题可以将其关闭。
/// 4、。。。
////////////////////////////////////////////////////////////////////////////////////////////////
(function ($) {


    //初始化 easyui-tabs 控件对象 tabs-header 位置和 tabs-panels 之间的空白分割线。
    var _initTabsSplitLine = function (jq) {
        var opts = $(jq).tabs("options");
        if (opts.splitline == true) {
            var tabPosition = opts.tabPosition;
            if (String.isNullOrWhiteSpace(tabPosition)) { tabPosition = "top"; }
            tabPosition = tabPosition.trim();
            if (tabPosition != "top" && tabPosition != "bottom" && tabPosition != "left" && tabPosition != "right") { tabPosition = "top"; }
            $(".tabs-panels:first", jq).css("padding-" + tabPosition, "2px").children().children().css("border-" + tabPosition + "-width", "1px");
        }
    };

    //判断选项卡数组中是否存在可关闭的选项卡
    var _hasClosable = function (tabArray) {
        var result = false;
        for (var i = 0; i < tabArray.length; i++) {
            var opts = tabArray[i].panel("options");
            if (opts.closable) { return true; }
        }
        return result;
    };

    //以弹出的 easyui-dialog 方式显示 easyui-tab panel 对象的各项属性
    var _showTabPanelHref = function (jq, index) {
        var opts = $(jq).tabs("getTab", index).panel("options");
        var _content = $("<table />").css({ "padding": "10px", "width": "100%" });
        for (var key in opts) {
            _content.append("<tr><td align='right'>" + key + ":</td><td>" + String(opts[key]) + "</td></tr>");
        }
        var dialog = $.plugin.showDialog({
            title: "显示选显卡 \"" + opts.title + "\" 的 options",
            width: 600,
            height: 300,
            autoCenter: false,
            content: _content,
            enableSaveButton: false,
            enableApplyButton: false
        });
        var tabsHeader = $(".tabs-header .tabs-wrap ul.tabs li", jq);
        var pos = $(tabsHeader[index]).offset();
        $.extend(pos, { top: pos.top + 10, left: pos.left + 10 });
        $(dialog.dialog).panel("move", pos);
    };

    //打开一个创建选项卡页面的模式对话框
    var _createOpenTabDialog = function (jq, which) {
        var _content = $("<table />").attr({
            "width": "95%",
            "height": "100%"
        });
        _content.append("<tr><td width='24%' align='right'>选项卡标题：</td><td><input id='txtTitle' type='text' style='width: 100%;'/></td></tr>");
        _content.append("<tr><td width='24%' align='right'>路径(href)：</td><td><input id='txtHref' type='text' style='width: 100%;'/></td></tr>");
        _content.append("<tr><td width='24%' align='right'></td><td align='right'>"
            + "<input id='ckIniframe' type='checkbox' /><label for='ckIniframe'>是否嵌至 IFRAME(浏览器内部窗体) 中</label>"
            + "</td></tr>");
        var _onOpen = function (dialog) {
            var opts = $(jq).tabs("options");
            var title = $("#txtTitle", dialog).val();
            if (String.isNullOrWhiteSpace(title)) {
                var i = 1;
                while (!window.isEmptyObjectOrNull($(jq).tabs("getTab", "新建选项卡" + i))) { i++; }
                title = "新建选项卡" + i;
            }
            var href = $("#txtHref", dialog).val();
            if (String.isNullOrWhiteSpace(href)) { href = opts.defaultHref; }
            href = window.resolveUrl(href);
            var iniframe = false;
            $("#ckIniframe", dialog).each(function () { iniframe = this.checked; });
            window.addTab({ title: title, href: href, iconCls: "icon-tab", iniframe: iniframe });
            $(dialog).dialog("close");
        };
        var dialogOptions = {
            title: "新建选项卡 - 设置参数",
            width: 400,
            height: 165,
            maximizable: false,
            resizable: false,
            autoCenter: false,
            enableSaveButton: false,
            applyButtonText: "打开",
            onApply: _onOpen,
            content: _content
        };
        var dialog = $.plugin.showDialog(dialogOptions);
        var index = $(jq).tabs("getTabIndex", which);
        var tabsHeader = $(".tabs-header .tabs-wrap ul.tabs li", jq);
        var pos = $(tabsHeader[index]).offset();
        $.extend(pos, { top: pos.top + 10, left: pos.left + 10 });
        $(dialog.dialog).panel("move", pos);
        //        var opts = $(jq).tabs("options");
        //        var i = 1;
        //        while (!window.isEmptyObjectOrNull($(jq).tabs("getTab", "新建选项卡" + i))) { i++; }
        //        $(jq).tabs("add", { title: "新建选项卡" + i, href: opts.defaultHref, iconCls: "icon-tab", closable: true, selected: true });
    };

    var _onContextMenu = $.fn.tabs.defaults.onContextMenu;
    var _defaults = {
        //.tabs-header 和 .tabs-panels 之间是否存在空白分割线
        splitline: true,

        onCloseOthers: function (title, index) { },
        onCloseLeft: function (title, index) { },
        onCloseRight: function (title, index) { },
        onCloseAll: function () { },
        onCloseOthersClosable: function (title, index) { },
        onCloseLeftClosable: function (title, index) { },
        onCloseRightClosable: function (title, index) { },
        onCloseAllClosable: function () { },
        onCloseClosable: function () { },

        onBeforeCloseOthers: function (title, index) { },
        onBeforeCloseLeft: function (title, index) { },
        onBeforeCloseRight: function (title, index) { },
        onBeforeCloseAll: function () { },
        onBeforeCloseOthersClosable: function (title, index) { },
        onBeforeCloseLeftClosable: function (title, index) { },
        onBeforeCloseRightClosable: function (title, index) { },
        onBeforeCloseAllClosable: function () { },
        onBeforeCloseClosable: function () { },


        //是否启用点击选项卡头的右键菜单。
        enableConextMenu: true,

        //点击选项卡头的右键菜单是否含刷新按钮。
        enableRefreshContextMenu: true,

        //点击选项卡头的右键菜单是否含重复选项卡按钮。
        enableRepeatContextMenu: false,

        //点击选项卡头的右键菜单是否含新建选项卡按钮
        enableNewTabContextMenu: false,

        //新建选项卡默认是否启用刷新按钮功能。
        defaultEnableRefresh: false,

        //新建选项卡默认是否加载在 iframe 中。
        defaultInIframe: false,

        //新建选项卡默认打开的页面url地址。
        defaultHref: null,

        //添加刷新选项卡事件，调用 refresh 方法触发该事件
        onRefresh: function (title, index) { },

        //重新定义的右键点击选项卡头事件，以显示右键菜单。
        onContextMenu: function (e, title, index) {
            _onContextMenu.call(this, e, title, index);
            var tabs = this;
            var tabsOpts = $(tabs).tabs("options");
            if (tabsOpts.enableConextMenu) {
                e.preventDefault();
                var tab = $(tabs).tabs("getTab", index);
                var others = $(tabs).tabs("getOtherTabs", index);
                var leftTabs = $(tabs).tabs("getLeftTabs", index);
                var rightTabs = $(tabs).tabs("getRightTabs", index);
                var allTabs = $(tabs).tabs("tabs", index);
                var opts = tab.panel("options");
                var menuOptions = { width: 140, menus: new Array() };
                var md0 = false;
                var md1 = !opts.closable;
                var md2 = (others.length < 1 || !_hasClosable(others));
                var md3 = !$(tabs).tabs("isSelected", index);
                var md4 = (leftTabs.length < 1 || !_hasClosable(leftTabs));
                var md5 = (rightTabs.length < 1 || !_hasClosable(rightTabs));
                var md6 = (allTabs.length < 1 || !_hasClosable(allTabs));
                var md7 = false;
                var md8 = !opts.closable;
                var mm0 = { text: "显示选项卡的 options", iconCls: "icon-tab", disabled: md0, onclick: function () { _showTabPanelHref(tabs, index); } };
                var mm1 = { text: "关闭选项卡", iconCls: "icon-close", disabled: md1, onclick: function () { $(tabs).tabs("closeClosable", index); } };
                var mm2 = { text: "关闭其他选项卡", iconCls: "icon-close-all", disabled: md2, onclick: function () { $(tabs).tabs("closeOthersClosable", index); } };
                var mm3 = { text: "刷新选项卡", iconCls: "icon-refresh", disabled: md3, onclick: function () { $(tabs).tabs("refresh", index); } };
                var mm4 = { text: "关闭左侧选项卡", iconCls: "icon-close-left", disabled: md4, onclick: function () { $(tabs).tabs("closeLeftClosable", index); } };
                var mm5 = { text: "关闭右侧选项卡", iconCls: "icon-close-right", disabled: md5, onclick: function () { $(tabs).tabs("closeRightClosable", index); } };
                var mm6 = { text: "关闭所有选项卡", iconCls: "icon-cancel", disabled: md6, onclick: function () { $(tabs).tabs("closeAllClosable", index); } };
                var mm7 = { text: "新建选项卡", iconCls: "icon-tab-add", disabled: md7, onclick: function () { $(tabs).tabs("newTab", index); } };
                var mm8 = { text: "重复选项卡", iconCls: "icon-repeat", disabled: md8, onclick: function () { $(tabs).tabs("repeat", index); } };
                menuOptions.menus.push(mm0);
                menuOptions.menus.push("-");
                menuOptions.menus.push(mm1);
                menuOptions.menus.push(mm2);
                if (tabsOpts.enableRefreshContextMenu) { menuOptions.menus.push("-"); menuOptions.menus.push(mm3); }
                menuOptions.menus.push("-");
                menuOptions.menus.push(mm4);
                menuOptions.menus.push(mm5);
                menuOptions.menus.push(mm6);
                if (tabsOpts.enableRepeatContextMenu) {
                    menuOptions.menus.push("-");
                    if (tabsOpts.enableNewTabContextMenu) { menuOptions.menus.push(mm7); }
                    menuOptions.menus.push(mm8);
                }
                var menu = $.plugin.createMenu(menuOptions);
                menu.menu("show", { left: e.pageX, top: e.pageY });
            }
        }
    };

    var _getTabIndex = $.fn.tabs.methods.getTabIndex;
    var _enableTab = $.fn.tabs.methods.enableTab;
    var _disableTab = $.fn.tabs.methods.disableTab;
    var _tabAdd = $.fn.tabs.methods.add;
    var _tabUpdate = $.fn.tabs.methods.update;
    var _methods = {
        isSelected: function (jq, which) {
            var selected = $(jq).tabs("getSelected");
            var tab = ($.type(which) == "object" ? which : $(jq).tabs("getTab", which));
            return selected == tab;
        },
        getTabIndex: function (jq, tab) {
            if ($.isNumeric(tab) || $.type(tab) == "string") { tab = $(jq).tabs("getTab", tab); }
            return _getTabIndex.call(this, jq, tab);
        },
        enableTab: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var index = tabs.tabs("getTabIndex", which);
                var header = tabs.find(".tabs-header .tabs-wrap ul.tabs li");
                if (header.length > index) { header.find("a").removeAttr("disabled"); }
                _enableTab.call(tabs, tabs, which);
            });
        },
        disableTab: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var index = tabs.tabs("getTabIndex", which);
                var header = tabs.find(".tabs-header .tabs-wrap ul.tabs li");
                if (header.length > index) { header.find("a").attr("disabled", "true"); }
                _disableTab.call(tabs, tabs, which);
            });
        },
        add: function (jq, options) {
            jq.each(function () {
                var tabs = $(this);
                var tabsOpts = tabs.tabs("options");
                var opts = $.extend({}, { iniframe: tabsOpts.defaultInIframe, refreshable: tabsOpts.defaultEnableRefresh }, options);
                var hrefBak = opts.href, contentBak = opts.content;
                if (opts.iniframe == true) {
                    opts.href = null;
                    var id = tabs.attr("id") + "_tabIframe_" + window.guid().replaceAll("-", "");
                    opts.content = "<iframe id='" + id + "' name='" + id + "' frameborder='0' width='100%' height='100%' marginwidth='0px' marginheight='0px' scrolling='auto' src='" + hrefBak + "' ></iframe>";
                }
                _tabAdd.call(tabs, tabs, opts);
                var tabsLength = tabs.tabs("tabs").length;
                var index = (tabsLength > 0 ? tabsLength - 1 : 0);
                $.extend(tabs.tabs("getTab", index).panel("options"), { href: hrefBak, content: contentBak });
            });
        },
        update: function (jq, param) {
            jq.each(function () {
                var tabs = $(this);
                var tabsOpts = tabs.tabs("options");
                var index = tabs.tabs("getTabIndex", param.tab);
                var options = param.options
                var opts = $.extend({ iniframe: tabsOpts.defaultInIframe, refreshable: tabsOpts.defaultEnableRefresh }, options);
                var toolsBak = opts.tools;
                var hrefBak = opts.href, contentBak = opts.content;
                var _tabRefreshButton = { iconCls: "icon-mini-refresh" };
                if (opts.refreshable == true) {
                    if ($.type(opts.tools) == "array") { opts.tools = opts.tools.concat(_tabRefreshButton); } else { opts.tools = [_tabRefreshButton]; };
                }
                if (opts.iniframe == true) {
                    opts.href = null;
                    var id = tabs.attr("id") + "_tabIframe_" + window.guid().replaceAll("-", "");
                    opts.content = "<iframe id='" + id + "' name='" + id + "' frameborder='0' width='100%' height='100%' marginwidth='0px' marginheight='0px' scrolling='auto' src='" + hrefBak + "' ></iframe>";
                }
                if ((!String.isNullOrWhiteSpace(hrefBak) || !String.isNullOrWhiteSpace(contentBak)) && !opts.iniframe) {
                    $.plugin.messager.progress({ title: "操作提醒", msg: "正在加载...", interval: 100 });
                }
                var _onLoad = opts.onLoad;
                var onLoad = function () {
                    _onLoad.apply(this, arguments);
                    var fn = function () { $.plugin.messager.progress("close"); };
                    window.call(fn);
                    $(this).panel("options").onLoad = _onLoad;
                };
                opts.onLoad = onLoad;
                _tabUpdate.call(tabs, tabs, { tab: param.tab, options: opts });
                $.extend(tabs.tabs("getTab", index).panel("options"), { tools: toolsBak, href: hrefBak, content: contentBak });

                if (!tabsOpts.isDelegateTitleDbClickEvet) {
                    var wrap = tabs.children(".tabs-header").children(".tabs-wrap");
                    //                    wrap.delegate(".tabs li .tabs-inner", "dblclick", function (e) {
                    //                        var title = $(e.srcElement).text();
                    //                        var fn = function () { tabs.tabs("closeClosable", title); };
                    //                        window.call(fn);
                    //                    });
                    wrap.delegate(".tabs li .tabs-p-tool .icon-mini-refresh", "click", function (e) {
                        var title = $(e.srcElement).parent().prevAll(".tabs-inner:first").children("span").text();
                        var tab = tabs.tabs("getTab", title);
                        var index = tabs.tabs("getTabIndex", tab);
                        tabs.tabs("refresh", index);
                    });
                    tabsOpts.isDelegateTitleDbClickEvet = true;
                }
                _initTabsSplitLine(jq);
            });
        },
        newTab: function (jq, which) {
            jq.each(function () { _createOpenTabDialog($(this), which); });
        },
        repeat: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var tab = tabs.tabs("getTab", which);
                var tabOpts = tab.panel("options");
                var i = 1;
                while (!window.isEmptyObjectOrNull(tabs.tabs("getTab", tabOpts.title + i))) { i++; }
                var opts = $.extend({}, tabOpts, { title: tabOpts.title + i, selected: true, closable: true });
                tabs.tabs("add", opts);
            });
        },
        refresh: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var tab = tabs.tabs("getTab", which);
                var index = tabs.tabs("getTabIndex", tab);
                var opts = tab.panel("options");
                if (String.isNullOrWhiteSpace(opts.href) && String.isNullOrWhiteSpace(opts.content)) { return; }
                tabs.tabs("update", { tab: tab, options: opts });
                tabs.tabs("options").onRefresh.call(tabs, opts.title, index);
            });
        },
        getAllClosableTabs: function (jq) {
            var tabs = $(jq).tabs("tabs");
            var temps = new Array();
            for (var i = 0; i < tabs.length; i++) {
                var temp = tabs[i];
                if (temp.panel("options").closable) { temps.push(temp); }
            }
            return temps;
        },
        getOtherTabs: function (jq, which) {
            var tab = $(jq).tabs("getTab", which);
            var tabs = $(jq).tabs("tabs");
            var temps = new Array();
            for (var i = 0; i < tabs.length; i++) {
                var temp = tabs[i];
                if (tab != temp) { temps.push(temp); }
            }
            return temps;
        },
        getOtherClosableTabs: function (jq, which) {
            var tabs = $(jq).tabs("getOtherTabs", which);
            var temps = new Array();
            for (var i = 0; i < tabs.length; i++) {
                var temp = tabs[i];
                if (temp.panel("options").closable) { temps.push(temp); }
            }
            return temps;
        },
        getLeftTabs: function (jq, which) {
            var tab = $(jq).tabs("getTab", which);
            var index = $(jq).tabs("getTabIndex", tab);
            var temps = new Array();
            for (var i = 0; i < index; i++) {
                temps.push($(jq).tabs("getTab", i));
            }
            return temps;
        },
        getLeftClosableTabs: function (jq, which) {
            var tabs = $(jq).tabs("getLeftTabs", which);
            var temps = new Array();
            for (var i = 0; i < tabs.length; i++) {
                var temp = tabs[i];
                if (temp.panel("options").closable) { temps.push(temp); }
            }
            return temps;
        },
        getRightTabs: function (jq, which) {
            var tab = $(jq).tabs("getTab", which);
            var index = $(jq).tabs("getTabIndex", tab);
            var temps = new Array();
            var len = $(jq).tabs("tabs").length;
            for (var i = index + 1; i < len; i++) {
                temps.push($(jq).tabs("getTab", i));
            }
            return temps;
        },
        getRightClosableTabs: function (jq, which) {
            var tabs = $(jq).tabs("getRightTabs", which);
            var temps = new Array();
            for (var i = 0; i < tabs.length; i++) {
                var temp = tabs[i];
                if (temp.panel("options").closable) { temps.push(temp); }
            }
            return temps;
        },
        closeClosable: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseClosable.call(tabs, title, index) == false) { return; }
                    if (tab.panel("options").closable == true) { tabs.tabs("close", which); }
                    opts.onCloseClosable.call(tabs, title, index);
                }
            });
        },
        closeOthers: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseOthers.call(tabs, title, index) == false) { return; }
                    var array = tabs.tabs("getOtherTabs", index);
                    var temps = $.merge([], array);
                    for (var i = 0; i < temps.length; i++) {
                        index = tabs.tabs("getTabIndex", temps[i]);
                        tabs.tabs("close", index);
                    }
                    opts.onCloseOthers.call(tabs, title, index);
                }
            });
        },
        closeOthersClosable: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseOthersClosable.call(tabs, title, index) == false) { return; }
                    var array = tabs.tabs("getOtherTabs", index);
                    var temps = $.merge([], array);
                    for (var i = 0; i < temps.length; i++) {
                        index = tabs.tabs("getTabIndex", temps[i]);
                        tabs.tabs("closeClosable", index);
                    }
                    opts.onCloseOthersClosable.call(tabs, title, index);
                }
            });
        },
        closeAll: function (jq) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                if (opts.onBeforeCloseAll.call(tabs) == false) { return; }
                var array = tabs.tabs("tabs");
                var temps = $.merge([], array);
                for (var i = 0; i < temps.length; i++) {
                    index = tabs.tabs("getTabIndex", temps[i]);
                    tabs.tabs("close", index);
                }
                opts.onCloseAll.call(tabs);
            });
        },
        closeAllClosable: function (jq) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                if (opts.onBeforeCloseAllClosable.call(tabs) == false) { return; }
                var array = tabs.tabs("tabs");
                var temps = $.merge([], array);
                for (var i = 0; i < temps.length; i++) {
                    index = tabs.tabs("getTabIndex", temps[i]);
                    tabs.tabs("closeClosable", index);
                }
                opts.onCloseAllClosable.call(tabs);
            });
        },
        closeLeft: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseLeft.call(tabs, title, index) == false) { return; }
                    var array = tabs.tabs("getLeftTabs", index);
                    var temps = $.merge([], array);
                    for (var i = 0; i < temps.length; i++) {
                        index = tabs.tabs("getTabIndex", temps[i]);
                        tabs.tabs("close", index);
                    }
                    opts.onCloseLeft.call(tabs, title, index);
                }
            });
        },
        closeLeftClosable: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseLeftClosable.call(tabs, title, index) == false) { return; }
                    var array = tabs.tabs("getLeftTabs", index);
                    var temps = $.merge([], array);
                    for (var i = 0; i < temps.length; i++) {
                        index = tabs.tabs("getTabIndex", temps[i]);
                        tabs.tabs("closeClosable", index);
                    }
                    opts.onCloseLeftClosable.call(tabs, title, index);
                }
            });
        },
        closeRight: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseRight.call(tabs, title, index) == false) { return; }
                    var array = tabs.tabs("getRightTabs", index);
                    var temps = $.merge([], array);
                    for (var i = 0; i < temps.length; i++) {
                        index = tabs.tabs("getTabIndex", temps[i]);
                        tabs.tabs("close", index);
                    }
                    opts.onCloseRight.call(tabs, title, index);
                }
            });
        },
        closeRightClosable: function (jq, which) {
            jq.each(function () {
                var tabs = $(this);
                var opts = tabs.tabs("options");
                var tab = tabs.tabs("getTab", which);
                if (tab != null) {
                    var title = tab.panel("options").title;
                    var index = tabs.tabs("getTabIndex", tab);
                    if (opts.onBeforeCloseRightClosable.call(tabs, title, index) == false) { return; }
                    var array = tabs.tabs("getRightTabs", index);
                    var temps = $.merge([], array);
                    for (var i = 0; i < temps.length; i++) {
                        index = tabs.tabs("getTabIndex", temps[i]);
                        tabs.tabs("closeClosable", index);
                    }
                    opts.onCloseRightClosable.call(tabs, title, index);
                }
            });
        }
    };



    $.extend($.fn.tabs.defaults, _defaults);
    $.extend($.fn.tabs.methods, _methods);
})(jQuery);