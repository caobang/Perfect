////////////////////////////////////////////////////////////////////////////////////////////////
/// 扩展 easyui-tree，使其在原功能基础上增加如下功能或者属性：
///     1、点击带有子节点的行，自动展开或者折叠子节点；该功能通过自定义属性 autoToggle 控制；该功能不会破坏 easyui-tree 原生的 onClick 事件；
///         属性 autoToggle 默认为 true；
///     2、添加点击节点的默认右键菜单，包括：
///         A、“展开当前节点、折叠当前节点、展开当前节点所有子节点、折叠当前节点所有子节点”，该功能通过自定义属性 toggleMenu 控制；
///         备注：属性 toggleMenu 可以为一个布尔值，也可以为一个 JSON 格式的对象；如果为布尔值，则表示全部启用或者禁用可移动的右键菜单，默认为 true；
///             如果为 JSON 对象，则其可以包含如下四个属性：
///             expand:         布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“展开当前”菜单；
///             expandAll:      布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“展开当前及所有子节点”菜单；
///             collapse:       布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“折叠当前”菜单；
///             collapseAll:    布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“折叠当前及所有子节点”菜单；
///             submenu:        表示展开/折叠菜单是否以子菜单方式呈现，默认为 true；
///             上面四个参数，如果参数的值为函数，则函数的签名为 function(e, tree, node)。
///             上述的展开和折叠节点的菜单操作，能够自动触发easyui-tree的相应关于展开和折叠节点的事件。
///         B、“上移、下移、上移一级、下移一级”，该功能通过自定义属性 moveMenu 控制，功能会触发 easyui-tree 的自带事件 onDrop；
///         备注：属性 moveMenu 可以为一个布尔值，也可以为一个 JSON 格式的对象；如果为布尔值，则表示全部启用或者禁用 可移动 的右键菜单，默认为 false；
///             如果为 JSON 对象，则其可以包含如下四个属性：
///             up:             布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移”菜单；
///             upLevel:        布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“上移一级”菜单；
///             down:           布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移”菜单；
///             downLevel:      布尔类型的值，也可是一个返回布尔值的函数，表示是否显示“下移一级”菜单；
///             submenu:        表示移动菜单是否以子菜单方式呈现，默认为 true；
///             上面四个参数，如果参数的值为函数，则函数的签名为 function(e, tree, node)。
///     3、允许添加自定义的右键菜单属性 nodeContextMenus，该属性为一个数组对象，数组中的每一个元素都是如下格式的 JSON 对象：
///         id:         表示菜单的 id，该值可以为一个字符串，也可以是一个返回id值的函数，如果是函数，函数格式如 function(e, tree, node){ ... }，该函数内的 this 指向 easyui-tree-node 本身；
///         text:       表示菜单的显示标题，该值可以为一个字符串，也可以是一个返回字符串值的函数，如果是函数，函数格式如 function(e, tree, node){ ... }，该函数内的 this 指向 easyui-tree-node 本身；
///         iconCls:    表示菜单的显示图标，该值可以为一个字符串，也可以是一个返回字符串值的函数，如果是函数，函数格式如 function(e, tree, node){ ... }，该函数内的 this 指向 easyui-tree-node 本身；
///         disabled:   表示菜单是否禁用，该值可以为一个布尔值，也可以是一个返回布尔值的函数，如果是函数，函数格式如 function(e, tree, node){ ... }，该函数内的 this 指向 easyui-tree-node 本身；
///         handler:    表示菜单点击的响应事件，该值为一个函数，格式如 function(e, tree, node){ ... }，该函数内的 this 指向菜单本身；
///         children: 表示该菜单的子级菜单，为一个数组对象，数组中每一个元素和当前父级元素的格式相同；
///         备注：以上所有的函数中，参数 e 代表鼠标右键事件对象，参数 tree 表示 easyui-tree 的 jquery 对象，参数 node 表示 easyui-tree-node 的 jquery 对象，属性 nodeContextMenus 默认为 null。
///     4、添加如下的几个自定义方法
///         A、judgeNode，该方法用于判断两个节点的关系，返回一个string值，该返回的string值可能的值为：
///             "parent", 表示第一个节点是第二个节点的父节点；
///             "child", 表示第一个节点是第二个节点的子节点；
///             "samelevel", 表示第一个节点和第二个节点是平级节点；
///             "unrelated", 表示第一个节点和第二个节点既不是父子级关系，也不是平级节点；它们可能分别位于两个不同的父节点下；
///             该方法的参数为 param，是一个 JSON 对象，该JSON对象有两个属性 target1、target2 分别表示两个节点；
///         B、isChild，判断 节点1 是否为 节点2 的子节点，该方法的参数为 param，是一个 JSON 对象，该JSON对象有两个属性 target1、target2 分别表示两个节点；
///         C、isParent，判断 节点1 是否为 节点2 的父节点，该方法的参数为 param，是一个 JSON 对象，该JSON对象有两个属性 target1、target2 分别表示两个节点；
///         D、isSameLevel，判断 节点1 和 节点2 是否为同级别节点，该方法的参数为 param，是一个 JSON 对象，该JSON对象有两个属性 target1、target2 分别表示两个节点；
///         E、nextNode，返回指定节点的同级别下一个节点，如果没有下一个节点，则返回 null；该方法参数为 target；
///         F、prevNode，返回指定节点的同级别上一个节点，如果没有上一个节点，则返回 null；该方法参数为 target；
///         G、getNearChildren，该方法签名为 function(target)，返回指定节点的第一级子节点数组集合，如果该节点没有子节点，则返回一个空数组；
///         H、getNearNodes，获取指定节点的同级节点集合（含当前节点在内），传入的节点有误则返回 null；该方法签名为 function(target)；
///         I、move，该方法接收如下参数三个参数：
///             source: 表示要移动的 easyui-tree-node 对象；
///             target: 表示移动的目标位置的 easyui-tree-node 对象；
///             point:  为一个字符串值的枚举，可选的值包括：
///                 append， 表示追加为目标节点的子节点
///                 top，    表示移动到目标节点的上面位置
///                 bottom， 表示移动到目标节点的下面位置
///             该方法会触发 easyui-tree 的自带事件 onDrop；
///         J、load(未完整实现逻辑)，该方法接收的参数 param，表示传入远程数据源 url 的查询参数，为一个 JSON 格式的对象，对象中键值对的值可以是一个直接可用的值，也可以是一个具有返回值的回调函数。
///     5、添加自定义事件 onBeforeMove，该事件为一个签名为 function(target, source, point)的函数；
///         该自定义事件的函数参数和 easyui-tree 的 onDrop 参数格式一样，该事件函数的 this 指向 easyui-tree 对象本身；
///         当通过 move 方法移动 tree-node，或者通过 moveMenu 菜单点击移动 tree-node 前，将会触发该事件。
///         如果该事件函数返回 false，则停止 move 方法或者停止通过 moveMenu 菜单点击的动作执行；
///     6、更改 easyui-tree 的原生属性 lines 的默认值为 true
///     7、增加了自定义属性 queryParams，该参数的格式为一个 JSON 格式对象，对象中的每一个键值对的值可以是一个实际的值，也可以是一个有返回值的函数。
///     8、增加了自定义属性 isWebService，该参数为一个布尔类型的值，用于指明远程请求的 url 数据源是否为 ASP.NET WebService 格式，默认为 true。
////////////////////////////////////////////////////////////////////////////////////////////////
(function ($) {


    var _loader = function (param, success, error) {
        var opts = $(this).tree("options");
        if (!opts.loadExtensions) {
            _bindAutoToggle(this, opts);
            _bindContextMenus(this, opts);
            opts.paramCache = $.extend({}, $.plugin.parseObjectFuncMap(opts.queryParams), param);
            opts.loadExtensions = true;
        }
        if (String.isNullOrWhiteSpace(opts.url)) { return false; }
        var queryParams = $.extend({}, opts.paramCache, param);
        var ajaxOptions = {
            type: opts.method,
            url: opts.url,
            data: queryParams,
            dataType: "json",
            success: function (data) {
                var jsonData = $.plugin.parseSOADataToJSON(data);
                success(jsonData);
            },
            error: function () { error.apply(this, arguments); }
        };
        if (opts.isWebService == true) {
            $.extend(ajaxOptions, {
                data: JSON.stringify(queryParams),
                contentType: "application/json; charset=utf-8"
            });
        }
        $.ajax(ajaxOptions);
    };

    var _bindAutoToggle = function (jq, opts) {
        if (opts.autoToggle == true) {
            var onClick = opts.onClick;
            var toggle = function (node) {
                if ($(jq).tree("isLeaf", node.target) == true) {
                    $(jq).tree("toggle", node.target);
                }
            };
            opts.onClick = function (node) {
                $(jq).tree("toggle", node.target);
                onClick.call(jq, node);
            };
        }
    };
    var _bindContextMenus = function (jq, opts) {
        var onContextMenu = opts.onContextMenu;
        opts.onContextMenu = function (e, node) {
            var toggleMenu = { collapse: true, collapseAll: true, expand: true, expandAll: true, submenu: true };
            if ($.type(opts.toggleMenu) == "boolean") {
                toggleMenu = { collapse: opts.toggleMenu, collapseAll: opts.toggleMenu, expand: opts.toggleMenu, expandAll: opts.toggleMenu, submenu: true };
            } else { $.extend(toggleMenu, opts.toggleMenu); }

            var moveMenu = { up: false, upLevel: false, down: false, downLevel: false, submenu: true };
            if ($.type(opts.moveMenu) == "boolean") {
                moveMenu = { up: opts.moveMenu, upLevel: opts.moveMenu, down: opts.moveMenu, downLevel: opts.moveMenu, submenu: true };
            } else { $.extend(moveMenu, opts.moveMenu); }

            onContextMenu.call(jq, e, node);
            var menusOptions = _getContextMenusOptions(jq, e, node, toggleMenu, moveMenu, opts.nodeContextMenus);
            var menu = $.plugin.createMenu(menusOptions);
            menu.menu("show", {
                left: e.pageX,
                top: e.pageY
            });
            if ($.type(menusOptions.menus) == "array" && menusOptions.menus.length > 0) {
                e.preventDefault();
            }
        };
    };
    var _getContextMenusOptions = function (jq, e, node, toggleMenu, moveMenu, nodeContextMenus) {
        var menuId = $(jq).attr("id") + "_contextmenu_" + window.guid().replaceAll("-", "").left(8);
        var options = {
            id: menuId,
            width: $(jq).tree("options").nodeContextMenusWidth,
            menus: new Array()
        };
        var customMenusOptions = _getCustomMenusOptions(jq, e, node, nodeContextMenus, menuId);
        var toggleMenuOptions = _getToggleMenusOptions(jq, e, node, toggleMenu, menuId, nodeContextMenus);
        var moveMenusOptions = _getMoveMenusOptions(jq, e, node, moveMenu, menuId);
        options.menus = options.menus.concat(customMenusOptions);
        if (customMenusOptions.length > 0) { options.menus.push("-"); }
        options.menus = options.menus.concat(toggleMenuOptions);
        options.menus.push("-");
        options.menus = options.menus.concat(moveMenusOptions);
        return options;
    };
    var _getCustomMenusOptions = function (jq, e, node, nodeContextMenus, menuId) {
        var menus = new Array();
        if ($.type(nodeContextMenus) == "array") {
            for (var i = 0; i < nodeContextMenus.length; i++) {
                var item = _parseContextMenusOptions(jq, e, node, nodeContextMenus[i], menuId);
                menus.push(item);
            }
        }
        return menus;
    };
    var _getToggleMenusOptions = function (jq, e, node, toggleMenu, menuId, nodeContextMenus) {
        var d1 = !toggleMenu.expand;
        var d2 = !toggleMenu.expandAll;
        var d3 = !toggleMenu.collapse;
        var d4 = !toggleMenu.collapseAll;
        var mm1 = { text: "展开", iconCls: "", disabled: d1, handler: function (e, tree, node) { $(tree).tree("expand", node.target); } };
        var mm2 = { text: "展开所有", iconCls: "icon-tree-collapse", disabled: d2, handler: function (e, tree, node) { $(tree).tree("expandAll"); } }; ;
        var mm3 = { text: "折叠", iconCls: "", disabled: d3, handler: function (e, tree, node) { $(tree).tree("collapse", node.target); } };
        var mm4 = { text: "折叠所有", iconCls: "icon-tree-expand", disabled: d4, handler: function (e, tree, node) { $(tree).tree("collapseAll"); } };
        if (!toggleMenu.submenu) {
            var menu = new Array();
            menu.push(_parseContextMenusOptions(jq, e, node, mm1, menuId));
            menu.push(_parseContextMenusOptions(jq, e, node, mm2, menuId));
            menu.push(_parseContextMenusOptions(jq, e, node, mm3, menuId));
            menu.push(_parseContextMenusOptions(jq, e, node, mm4, menuId));
            return menu;
        }
        var options = {
            id: menuId + "_movemenu_" + window.guid().replaceAll("-", "").left(8),
            text: "展开/折叠菜单",
            iconCls: "icon-tree-state",
            disabled: (!toggleMenu.collapse && !toggleMenu.collapseAll && !toggleMenu.expand && !toggleMenu.expandAll),
            children: new Array()
        };
        options.children.push(mm1);
        options.children.push(mm2);
        options.children.push("-");
        options.children.push(mm3);
        options.children.push(mm4);
        var item = _parseContextMenusOptions(jq, e, node, options, menuId);
        return item;
    };
    var _getMoveMenusOptions = function (jq, e, node, moveMenu, menuId) {
        var d1 = !moveMenu.up;
        var d2 = !moveMenu.upLevel;
        var d3 = !moveMenu.down;
        var d4 = !moveMenu.downLevel;
        var moveUp = function (tree, node) {
            var source = node.target;
            var target = $(tree).tree("prevNode", source);
            if (!window.isEmptyObjectOrNull(target)) {
                $(tree).tree("move", { source: source, target: target.target, point: "top" });
            }
        };
        var moveUpLevel = function (tree, node) {
            var source = node.target;
            var target = $(tree).tree("getParent", source);
            if (!window.isEmptyObjectOrNull(target)) {
                $(tree).tree("move", { source: source, target: target.target, point: "bottom" });
            }
        };
        var moveDown = function (tree, node) {
            var source = node.target;
            var target = $(tree).tree("nextNode", source);
            if (!window.isEmptyObjectOrNull(target)) {
                $(tree).tree("move", { source: source, target: target.target, point: "bottom" });
            }
        };
        var moveDownLevel = function (tree, node) {
            var source = node.target;
            var target = $(tree).tree("prevNode", source);
            if (!window.isEmptyObjectOrNull(target)) {
                $(tree).tree("move", { source: source, target: target.target, point: "append" });
            }
        };
        var mm1 = { text: "上移", iconCls: "icon-move-up", disabled: d1, handler: function (e, tree, node) { moveUp(tree, node); } };
        var mm2 = { text: "上移一级", iconCls: "icon-move-uplevel", disabled: d2, handler: function (e, tree, node) { moveUpLevel(tree, node); } };
        var mm3 = { text: "下移", iconCls: "icon-move-down", disabled: d3, handler: function (e, tree, node) { moveDown(tree, node); } };
        var mm4 = { text: "下移一级", iconCls: "icon-move-downlevel", disabled: d4, handler: function (e, tree, node) { moveDownLevel(tree, node); } };
        if (!moveMenu.submenu) {
            var menu = new Array();
            menu.push(_parseContextMenusOptions(jq, e, node, mm1, menuId));
            menu.push(_parseContextMenusOptions(jq, e, node, mm2, menuId));
            menu.push(_parseContextMenusOptions(jq, e, node, mm3, menuId));
            menu.push(_parseContextMenusOptions(jq, e, node, mm4, menuId));
            return menu;
        }
        var options = {
            id: menuId + "_movemenu_" + window.guid().replaceAll("-", "").left(8),
            text: "移动菜单",
            iconCls: "icon-move",
            disabled: (!moveMenu.up && !moveMenu.upLevel && !moveMenu.down && !moveMenu.downLevel),
            children: new Array()
        };
        options.children.push(mm1);
        options.children.push(mm2);
        options.children.push("-");
        options.children.push(mm3);
        options.children.push(mm4);
        var item = _parseContextMenusOptions(jq, e, node, options, menuId);
        return item;
    };
    var _parseContextMenusOptions = function (jq, e, node, item, menuId) {
        if ($.type(item) == "string" && item.trim() == "-") { return item.trim(); }
        var defaults = {
            id: null,
            text: null,
            iconCls: null,
            disabled: false,
            handler: function (e, tree, node) { },
            children: []
        };
        if ($.type(item) != "object") { item = {}; }
        item = $.extend({}, defaults, item);
        var menuItem = {
            id: ($.isFunction(item.id) ? item.id(e, jq, node) : item.id),
            text: ($.isFunction(item.text) ? item.text(e, jq, node) : item.text),
            iconCls: ($.isFunction(item.iconCls) ? item.iconCls(e, jq, node) : item.iconCls),
            disabled: ($.isFunction(item.disabled) ? item.disabled(e, jq, node) : item.disabled),
            onclick: function () { item.handler.call(item, e, jq, node); },
            children: {
                width: $(jq).tree("options").nodeContextMenusWidth,
                menus: new Array()
            }
        };
        if (String.isNullOrWhiteSpace(menuItem.id)) { menuItem.id = menuId + "_" + window.guid().replaceAll("-", "").left(8) }
        if (item.children.length > 0) {
            for (var i = 0; i < item.children.length; i++) {
                var childrenMenu = _parseContextMenusOptions(jq, e, node, item.children[i]);
                menuItem.children.menus.push(childrenMenu);
            }
        }
        return menuItem;
    };

    var _move2Append = function (jq, param) {
        var source = param.source;
        var target = param.target;
        if ($(jq).tree("judgeNode", { target1: source, target2: target }) == "parent") { return; }
        source = $(jq).tree("pop", source);
        $(jq).tree("append", {
            parent: target,
            data: [
                source
            ]
        });
        $(jq).tree("options").onDrop.call(jq, target, source, "append");
    };
    var _move2Top = function (jq, param) {
        var source = param.source;
        var target = param.target;
        if ($(jq).tree("judgeNode", { target1: source, target2: target }) == "parent") { return; }
        source = $(jq).tree("pop", source);
        $(jq).tree("insert", {
            before: target,
            data: source
        });
        $(jq).tree("options").onDrop.call(jq, target, source, "top");
    };
    var _move2Bottom = function (jq, param) {
        var source = param.source;
        var target = param.target;
        if ($(jq).tree("judgeNode", { target1: source, target2: target }) == "parent") { return; }
        source = $(jq).tree("pop", source);
        $(jq).tree("insert", {
            after: target,
            data: source
        });
        $(jq).tree("options").onDrop.call(jq, target, source, "bottom");
    };



    var _defaults = {
        autoToggle: true,
        toggleMenu: true,
        moveMenu: false,
        nodeContextMenus: null,
        nodeContextMenusWidth: 140,
        onBeforeMove: function (target, source, point) { },
        queryParams: null,
        isWebService: true,
        animate: true,
        lines: true,
        loader: _loader
    };
    var _methods = {
        judgeNode: function (jq, param) {
            if ($(jq).tree("isChild", param) == true) { return "child"; }
            if ($(jq).tree("isParent", param) == true) { return "parent"; }
            if ($(jq).tree("isSameLevel", param) == true) { return "samelevel"; }
            return "unrelated";
        },
        isChild: function (jq, param) {
            var target1 = param.target1, target2 = param.target2;
            var children = $(jq).tree("getChildren", target2);
            var node = $(jq).tree("getNode", target1);
            if (window.isEmptyObjectOrNull(node)) { return false; }
            for (var i = 0; i < children.length; i++) {
                if (children[i].target == node.target) { return true; }
            }
            return false;
        },
        isParent: function (jq, param) {
            var target1 = param.target1, target2 = param.target2;
            var children = $(jq).tree("getChildren", target1);
            var node = $(jq).tree("getNode", target2);
            if (window.isEmptyObjectOrNull(node)) { return false; }
            for (var i = 0; i < children.length; i++) {
                if (children[i].target == node.target) { return true; }
            }
            return false;
        },
        isSameLevel: function (jq, param) {
            var target1 = param.target1, target2 = param.target2;
            var p1 = $(jq).tree("getParent", target1);
            var p2 = $(jq).tree("getParent", target2);
            if (window.isEmptyObjectOrNull(p1) || window.isEmptyObjectOrNull(p2)) { return false; }
            return p1.target == p2.target;
        },
        nextNode: function (jq, target) {
            var node = $(jq).tree("getNode", target);
            if (window.isEmptyObjectOrNull(node)) { return null; }
            var nodes = $(jq).tree("getNearNodes", target);
            if (nodes.length < 2) { return null; }
            var index = 0;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].target == node.target) {
                    index = i + 1;
                    break;
                }
            }
            if (index < nodes.length) {
                return nodes[index];
            }
            return null;
        },
        prevNode: function (jq, target) {
            var node = $(jq).tree("getNode", target);
            if (window.isEmptyObjectOrNull(node)) { return null; }
            var nodes = $(jq).tree("getNearNodes", target);
            if (nodes.length < 2) { return null; }
            var index = 0;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].target == node.target) {
                    index = i - 1;
                    break;
                }
            }
            if (index > -1) {
                return nodes[index];
            }
            return null;
        },
        getNearNodes: function (jq, target) {
            var p = $(jq).tree("getParent", target);
            if (window.isEmptyObjectOrNull(p)) { return $(jq).tree("getRoots"); }

            return $(jq).tree("getNearChildren", p.target);
        },
        getNearChildren: function (jq, target) {
            var children = $(jq).tree("getChildren", target);
            target = $(jq).tree("getNode", target).target;
            if (children.length > 0) {
                var temps = new Array();
                var len = children.length;
                for (var i = 0; i < len; i++) {
                    var tag = children[i];
                    var p = $(jq).tree("getParent", tag.target);
                    if (p.target == target) { temps.push(tag); }
                }
                children = temps;
            }
            return children;
        },
        move: function (jq, param) {
            if (!param || !param.source || !param.target || !param.point) { return; }
            if (String.isNullOrWhiteSpace(param.point) || (param.point != "append" && param.point != "top" && param.point != "bottom")) { return; }
            if (param.source == param.target) {
                return;
            }
            var nodeSource = $(jq).tree("getNode", param.source);
            var nodeTarget = $(jq).tree("getNode", param.target);
            if (window.isEmptyObjectOrNull(nodeSource) || window.isEmptyObjectOrNull(nodeTarget) || nodeSource.target == nodeTarget.target) {
                return;
            }
            var onBeforeMove = $(jq).tree("options").onBeforeMove;
            if (onBeforeMove.call(jq, nodeTarget.target, nodeSource, param.point) == false) { return; }
            switch (param.point) {
                case "append":
                    _move2Append(jq, param);
                    break;
                case "top":
                    _move2Top(jq, param);
                    break;
                case "bottom":
                    _move2Bottom(jq, param);
                    break;
                default: break;
            }
        },
        load: function (jq, param) {
            jq.each(function () {
                var tree = $(this);
                var opts = tree.tree("options");
                opts.paramCache = $.plugin.parseObjectFuncMap(param);
                tree.tree("reload");
            });
        }
    };


    /////////////////////////////////////////////
    /// 给 easyui-tree 添加自定义的扩展属性和方法。
    /// 并更改 easyui-tree 的原生属性 lines 的默认值为 true
    /////////////////////////////////////////////
    $.extend($.fn.tree.defaults, _defaults);
    $.extend($.fn.tree.methods, _methods);


})(jQuery);