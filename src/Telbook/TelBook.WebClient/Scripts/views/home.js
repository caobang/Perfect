$(function () {
    $.util.namespace("home.nav");
    $.util.namespace("home.favo");
    $.util.namespace("home.mainTab");

    var homePageTitle = "主页", homePageHref = null, navMenuList = "#navMenu_list",
        navMenuTree = "#navMenu_Tree", mainTab = "#mainTab", navTab = "#navTab", favoMenuTree = "#favoMenu_Tree",
        mainLayout = "#mainLayout", northPanel = "#northPanel", themeSelector = "#themeSelector",
        westLayout = "#westLayout", westCenterLayout = "#westCenterLayout", westFavoLayout = "#westFavoLayout",
        westSouthPanel = "#westSouthPanel", homePanel = "#homePanel";


    //  按照指定的根节点菜单 id，加载其相应的子菜单树面板数据；该方法定义如下参数：
    //      id: 表示根节点菜单的 id；
    window.home.loadMenu = function (id) {
        $(navMenuList).find("a").attr("disabled", true);
        $.easyui.loading({ locale: westCenterLayout });
        //var root = $.extend({}, $.array.first(window.home.navMenusData, function (val) { return val.id == id; })),
        //    menus = id == "10" ? window.home.docMenus : (id == "11" ? window.home.apiMenus : []);
        //root.children = menus;
        $.post("Home/GetMenuData", { MenuID: id }, function (menus) {
            var t = $(navMenuTree).tree("loadData", menus);
        });

    };

    //  将指定的根节点数据集合数据加载至左侧面板中“导航菜单”的 ul 控件中；该方法定义如下参数：
    //      menus:  为一个 Array 对象；数组中的每一个元素都是一个表示根节点菜单数据的 JSON-Object。
    window.home.loadNavMenus = function () {
        var ul = $(navMenuList).empty();
        $.post("Home/GetNavMenuData", null, function (menus) {
            $.each(menus, function (i, item) {
                var li = $("<li></li>").appendTo(ul);
                var pp = $("<div></div>").addClass("panel-header panel-header-noborder").appendTo(li);
                var a = $("<a></a>").attr({ href: "javascript:void(0);", target: "_self" }).hover(function () {
                    a.addClass("tree-node-selected");
                }, function () {
                    if (!a.hasClass("selected")) { $(this).removeClass("tree-node-selected"); }
                }).click(function () {
                    if (a.is(".tree-node-selected.selected") || a.attr("disabled")) { return; }
                    a.closest("ul").find("a").removeClass("tree-node-selected selected");
                    a.addClass("tree-node-selected selected");
                    window.home.loadMenu(item.id);
                }).appendTo(pp);
                $.data(a[0], "menu-item", item);
                var span = $("<span></span>").addClass("nav-menu").appendTo(a);
                $("<span></span>").addClass("nav-menu-icon" + (item.iconCls ? " " + item.iconCls : "")).text(item.text).appendTo(span);
            });

            var layout = $(westLayout), south = layout.layout("panel", "south"), southOpts = south.panel("options");
            southOpts.minHeight = 5 + Math.min(menus.length, 3) * 27; southOpts.maxHeight = 5 + menus.length * 27;
            layout.layout("resize");

            var selectId = 1;
            var list = $(navMenuList).find("a");
            if (!list.length) { return; }
            var menu = list.filter(function () { var item = $.data(this, "menu-item"); return item && item.id == selectId; }),
                target = menu.length ? menu : list.eq(0);
            target.click();
        });
    };

    window.home.instTreeStatus = function (target) {
        var t = $.util.parseJquery(target), array = t.tree("getRoots");
        $.each(array, function () {
            var cc = t.tree("getChildren", this.target);
            t.tree("expand", this.target);
            $.each(cc, function () { t.tree("collapseAll", this.target); });
        });
    };

    //  初始化 westSouthPanel 位置的“导航菜单”区域子菜单 ul 控件(仅初始化 easyui-tree 对象，不加载数据)。
    window.home.instNavTree = function () {
        var t = $(navMenuTree);
        if (t.isEasyUI("tree")) { return; }
        t.tree({
            animate: true,
            lines: true,
            toggleOnClick: true,
            selectOnContextMenu: true,
            smooth: false,
            showOption: true,
            onClick: function (node) {
                window.home.addModuleTab(node);
            },
            onLoadSuccess: function (node, data) {
                $.util.call(function () { $(navMenuList).find("a").removeAttr("disabled"); });
                window.home.instTreeStatus(this);
                $.easyui.loaded(westCenterLayout);
            },
            contextMenu: [
                {
                    text: "打开/转到", iconCls: "icon-standard-application-add", handler: function (e, node) {
                        window.home.addModuleTab(node);
                    }
                }, "-",
                { text: "添加至个人收藏", iconCls: "icon-standard-feed-add", disabled: function (e, node) { return !t.tree("isLeaf", node.target); }, handler: function (e, node) { window.home.nav.addFavo(node.id); } },
                { text: "重命名", iconCls: "icon-hamburg-pencil", handler: function (e, node) { t.tree("beginEdit", node.target); } }, "-",
                { text: "刷新", iconCls: "icon-cologne-refresh", handler: function (e, node) { window.home.nav.refreshTree(); } }
            ],
            onAfterEdit: function (node) { window.home.nav.rename(node.id, node.text); }
        });
    };

    //  初始化应用程序主界面左侧面板中“导航菜单”的数据，并加载特定的子菜单树数据。
    window.home.instMainMenus = function () {
        window.home.loadNavMenus();
        window.home.instNavTree();

    };



    //  初始化 westSouthPanel 位置“个人收藏”的 ul 控件(仅初始化 easyui-tree 对象，不加载数据)。
    window.home.instFavoTree = function () {
        var t = $(favoMenuTree);
        if (t.isEasyUI("tree")) { return; }
        t.tree({
            animate: true,
            lines: true,
            dnd: true,
            toggleOnClick: true,
            showOption: true,
            onBeforeDrop: function (target, source, point) {
                var node = $(this).tree("getNode", target);
                if (point == "append" || !point) {
                    if (!node || !node.attributes || !node.attributes.folder) { return false; }
                }
            },
            selectOnContextMenu: true,
            onClick: function (node) {
                window.home.addModuleTab(node);
            },
            onLoadSuccess: function (node, data) {
                window.home.instTreeStatus(this);
                $.easyui.loaded(westFavoLayout);
            },
            contextMenu: [
                {
                    text: "打开/转到", iconCls: "icon-standard-application-add", handler: function (e, node) {
                        window.home.addModuleTab(node);
                    }
                }, "-",
                { text: "添加目录", iconCls: "icon-standard-folder-add", handler: function (e, node) { window.home.favo.addFolder(node); } }, "-",
                { text: "从个人收藏删除", iconCls: "icon-standard-feed-delete", handler: function (e, node) { window.home.favo.removeFavo(node.id); } },
                { text: "重命名", iconCls: "icon-hamburg-pencil", handler: function (e, node) { t.tree("beginEdit", node.target); } }, "-",
                { text: "刷新", iconCls: "icon-cologne-refresh", handler: function (e, node) { window.home.favo.refreshTree(); } }
            ],
            onAfterEdit: function (node) { window.home.favo.rename(node.id, node.text); }
        });
    };

    //  将指定的根节点数据集合数据加载至左侧面板中“个人收藏”的 ul 控件中；该方法定义如下参数：
    //      menus:  为一个 Array 对象；数组中的每一个元素都是一个表示根节点菜单数据的 JSON-Object。
    window.home.loadFavoMenus = function () {
        $.easyui.loading({ locale: westFavoLayout });
        $(favoMenuTree).tree("loadData", window.home.navMenusData);
    };

    //  初始化应用程序主界面左侧面板中“个人收藏”的数据。
    window.home.instFavoMenus = function () {
        window.home.instFavoTree();
        window.home.loadFavoMenus();
    };



    window.home.instTimerSpan = function () {
        var timerSpan = $("#timerSpan"), interval = function () { timerSpan.text($.date.toLongDateTimeString(new Date())); };
        interval();
        window.setInterval(interval, 1000);
    };

    window.home.bindToolbarButtonEvent = function () {
        var searchOpts = $("#topSearchbox").searchbox("options"), searcher = searchOpts.searcher;
        searchOpts.searcher = function (value, name) {
            if ($.isFunction(searcher)) { searcher.apply(this, arguments); }
            window.home.search(name, value);
        };
        $("#btnHideNorth").click(function () { window.home.hideNorth(); });
        var btnShow = $("#btnShowNorth").click(function () { window.home.showNorth(); });
        var l = $(mainLayout), north = l.layout("panel", "north"), panel = north.panel("panel"),
            toolbar = $("#toolbar"), topbar = $("#topbar"), top = toolbar.css("top"),
            opts = north.panel("options"), onCollapse = opts.onCollapse, onExpand = opts.onExpand;
        opts.onCollapse = function () {
            if ($.isFunction(onCollapse)) { onCollapse.apply(this, arguments); }
            btnShow.show();
            toolbar.insertBefore(panel).css("top", 0);
        };
        opts.onExpand = function () {
            if ($.isFunction(onExpand)) { onExpand.apply(this, arguments); }
            btnShow.hide();
            toolbar.insertAfter(topbar).css("top", top);
        };

        $(themeSelector).combobox({
            width: 140, editable: false, data: $.easyui.theme.dataSource, valueField: "path", textField: "name",
            value: $.easyui.theme.dataSource[0].path,
            onSelect: function (record) {
                var opts = $(this).combobox("options");
                window.home.setTheme(record[opts.valueField])
            }
        });
    };

    window.home.search = function (value, name) { $.easyui.messager.show($.string.format("您设置的主题为：value: {0}, name: {1}", value, name)); };

    window.home.setTheme = function (theme) {
        $.easyui.theme(true, theme, function (item) {
            var msg = $.string.format("您设置了新的系统主题皮肤为：{0}，{1}。", item.name, item.path);
            $.easyui.messager.show(msg);
        });
    };

    window.home.bindMainTabButtonEvent = function () {
        $("#mainTab_junmpHome").click(function () { window.home.mainTab.jumpHome(); });
        $("#mainTab_closeTab").click(function () { window.home.mainTab.closeCurrentTab(); });
        $("#mainTab_closeOther").click(function () { window.home.mainTab.closeOtherTabs(); });
        $("#mainTab_closeLeft").click(function () { window.home.mainTab.closeLeftTabs(); });
        $("#mainTab_closeRight").click(function () { window.home.mainTab.closeRightTabs(); });
        $("#mainTab_closeAll").click(function () { window.home.mainTab.closeAllTabs(); });
    };

    window.home.bindNavTabButtonEvent = function () {
        $("#navMenu_refresh").click(function () { window.home.refreshNavTab(); });

        $("#navMenu_Favo").click(function () { window.home.nav.addFavo(); });
        $("#navMenu_Rename").click(function () { window.home.nav.rename(); });
        $("#navMenu_expand").click(function () { window.home.nav.expand(); });
        $("#navMenu_collapse").click(function () { window.home.nav.collapse(); });
        $("#navMenu_collapseCurrentAll").click(function () { window.home.nav.expandCurrentAll(); });
        $("#navMenu_expandCurrentAll").click(function () { window.home.nav.collapseCurrentAll(); });
        $("#navMenu_collapseAll").click(function () { window.home.nav.expandAll(); });
        $("#navMenu_expandAll").click(function () { window.home.nav.collapseAll(); });

        $("#favoMenu_Favo").click(function () { window.home.favo.removeFavo(); });
        $("#favoMenu_Rename").click(function () { window.home.favo.rename(); });
        $("#favoMenu_expand").click(function () { window.home.favo.expand(); });
        $("#favoMenu_collapse").click(function () { window.home.favo.collapse(); });
        $("#favoMenu_collapseCurrentAll").click(function () { window.home.favo.expandCurrentAll(); });
        $("#favoMenu_expandCurrentAll").click(function () { window.home.favo.collapseCurrentAll(); });
        $("#favoMenu_collapseAll").click(function () { window.home.favo.expandAll(); });
        $("#favoMenu_expandAll").click(function () { window.home.favo.collapseAll(); });
    };

    window.home.hideNorth = function () { $(mainLayout).layout("collapse", "north"); };

    window.home.showNorth = function () { $(mainLayout).layout("expand", "north"); };

    window.home.addModuleTab = function (node) {
        var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
        if (!opts.href) { return; }
        window.home.mainTab.addModule(opts);
    };

    //  判断指定的选项卡是否存在于当前主页面的选项卡组中；
    //  返回值：返回的值可能是以下几种：
    //      0:  表示不存在于当前选项卡组中；
    //      1:  表示仅 title 值存在于当前选项卡组中；
    //      2:  表示 title 和 href 都存在于当前选项卡组中；
    window.home.mainTab.isExists = function (title, href) {
        var t = $(mainTab), tabs = t.tabs("tabs"), array = $.array.map(tabs, function (val) { return val.panel("options"); }),
            list = $.array.filter(array, function (val) { return val.title == title; }), ret = list.length ? 1 : 0;
        if (ret && $.array.some(list, function (val) { return val.href == href; })) { ret = 2; }
        return ret;
    };

    window.home.mainTab.tabDefaultOption = {
        title: "新建选项卡", href: "", iniframe: true, closable: true, refreshable: true, iconCls: "icon-standard-tab", repeatable: true, selected: true
    };
    window.home.mainTab.parseCreateTabArgs = function (args) {
        var ret = {};
        if (!args || !args.length) {
            $.extend(ret, window.home.mainTab.tabDefaultOption);
        } else if (args.length == 1) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, typeof args[0] == "object" ? args[0] : { href: args[0] });
        } else if (args.length == 2) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, { titel: args[0], href: args[1] });
        } else if (args.length == 3) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2] });
        } else if (args.length == 4) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3] });
        } else if (args.length == 5) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4] });
        } else if (args.length == 6) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4], refreshable: args[5] });
        } else if (args.length >= 7) {
            $.extend(ret, window.home.mainTab.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4], refreshable: args[5], selected: args[6] });
        }
        return ret;
    };

    window.home.mainTab.createTab = function (title, href, iconCls, iniframe, closable, refreshable, selected) {
        var t = $(mainTab), i = 0, opts = window.home.mainTab.parseCreateTabArgs(arguments);
        while (t.tabs("getTab", opts.title + (i ? String(i) : ""))) { i++; }
        t.tabs("add", opts);
    };

    //  添加一个新的模块选项卡；该方法重载方式如下：
    //      function (tabOption)
    //      function (href)
    //      function (title, href)
    //      function (title, href, iconCls)
    //      function (title, href, iconCls, iniframe)
    //      function (title, href, iconCls, iniframe, closable)
    //      function (title, href, iconCls, iniframe, closable, refreshable)
    //      function (title, href, iconCls, iniframe, closable, refreshable, selected)
    window.home.mainTab.addModule = function (title, href, iconCls, iniframe, closable, refreshable, selected) {
        var opts = window.home.mainTab.parseCreateTabArgs(arguments), isExists = window.home.mainTab.isExists(opts.title, opts.href);
        switch (isExists) {
            case 0: window.home.mainTab.createTab(opts); break;
            case 1: window.home.mainTab.createTab(opts); break;
            case 2: window.home.mainTab.jumeTab(opts.title); break;
            default: break;
        }
    };

    window.home.mainTab.jumeTab = function (which) { $(mainTab).tabs("select", which); };

    window.home.mainTab.jumpHome = function () {
        var t = $(mainTab), tabs = t.tabs("tabs"), panel = $.array.first(tabs, function (val) {
            var opts = val.panel("options");
            return opts.title == homePageTitle && opts.href == homePageHref;
        });
        if (panel && panel.length) {
            var index = t.tabs("getTabIndex", panel);
            t.tabs("select", index);
        }
    }

    window.home.mainTab.closeTab = function (which) { $(mainTab).tabs("close", which); };

    window.home.mainTab.closeCurrentTab = function () {
        var t = $(mainTab), index = t.tabs("getSelectedIndex");
        return t.tabs("closeClosable", index);
    };

    window.home.mainTab.closeOtherTabs = function (index) {
        var t = $(mainTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeOtherClosable", index);
    };

    window.home.mainTab.closeLeftTabs = function (index) {
        var t = $(mainTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeLeftClosable", index);
    };

    window.home.mainTab.closeRightTabs = function (index) {
        var t = $(mainTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeRightClosable", index);
    };

    window.home.mainTab.closeAllTabs = function () {
        return $(mainTab).tabs("closeAllClosable");
    };


    window.home.refreshNavTab = function (index) {
        var t = $(navTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        if (index == 0) { window.home.nav.refreshNav(); } else { window.home.favo.refreshTree(); }
    };




    window.home.nav.refreshNav = function () { window.home.instMainMenus(); };

    window.home.nav.refreshTree = function () {
        var menu = $(navMenuList).find("a.tree-node-selected.selected"), item = $.data(menu[0], "menu-item");
        if (item && item.id) { window.home.loadMenu(item.id); }
    };

    window.home.nav.addFavo = function (id) {
        var t = $(navMenuTree), node = arguments.length ? t.tree("find", id) : t.tree("getSelected");
        if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
    };

    window.home.nav.rename = function (id, text) {
        var t = $(navMenuTree), node;
        if (!arguments.length) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
            t.tree("beginEdit", node.target);
        } else { }
    };

    window.home.nav.expand = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expand", node.target);
    };

    window.home.nav.collapse = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapse", node.target);
    };

    window.home.nav.expandCurrentAll = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expandAll", node.target);
    };

    window.home.nav.collapseCurrentAll = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapseAll", node.target);
    };

    window.home.nav.expandAll = function () { $(navMenuTree).tree("expandAll"); };

    window.home.nav.collapseAll = function () { $(navMenuTree).tree("collapseAll"); };


    window.home.favo.refreshTree = function () { window.home.loadFavoMenus() };

    window.home.favo.removeFavo = function (id) {
        var t = $(favoMenuTree), node = arguments.length ? t.tree("find", id) : t.tree("getSelected");
        if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
    };

    window.home.favo.rename = function (id, text) {
        var t = $(favoMenuTree), node;
        if (!arguments.length) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
            t.tree("beginEdit", node.target);
        } else { }
    };

    var folderId = 20;
    window.home.favo.addFolder = function (node) {
        var t = $(favoMenuTree);
        node = node || t.tree("getSelected");
        $.easyui.messager.prompt("请输入添加的目录名称：", function (name) {
            if (name == null || name == undefined) { return; }
            if (String(name).trim() == "") { return $.easyui.messager.show("请输入目录名称！"); }
            if (node) {
                t.tree("insert", { after: node.target, data: { id: folderId++, text: name, iconCls: "icon-hamburg-folder", attributes: { folder: true } } });
            } else {

            }
        });
    }

    window.home.favo.expand = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expand", node.target);
    };

    window.home.favo.collapse = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapse", node.target);
    };

    window.home.favo.expandCurrentAll = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expandAll", node.target);
    };

    window.home.favo.collapseCurrentAll = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapseAll", node.target);
    };

    window.home.favo.expandAll = function () { $(favoMenuTree).tree("expandAll"); };

    window.home.favo.collapseAll = function () { $(favoMenuTree).tree("collapseAll"); };
});