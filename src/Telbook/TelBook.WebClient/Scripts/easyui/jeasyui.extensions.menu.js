(function ($) {
    if (!$.plugin) { $.extend({ plugin: {} }); }


    var _createMenu = function (options) {
        options = $.extend({}, { autoDispose: true }, options);
        var name = "menu_" + window.guid().replaceAll("-", "");
        var menu = _createMenuDomObject(options, name);
        var onHide = options.onHide;
        options.onHide = function () {
            var m = this;
            if ($.isFunction(onHide)) { onHide.apply(m, arguments); }
            if (options.autoDispose == true) { window.call(function () { $(m).menu("destroy"); }); }
        };
        $(menu).menu(options);
        return menu;
    };
    var _createMenuDomObject = function (options, name) {
        var id = "menu_" + window.guid().replaceAll("-", "").left(12);
        var defaults = $.extend({}, $.fn.menu.defaults, { id: null, width: 120, menus: [] })
        var menuOptions = $.extend({}, defaults, options);
        if (window.isEmptyObjectOrNull(menuOptions.id)) { menuOptions.id = id; }
        if ($.type(menuOptions.menus) != "array") { menuOptions.menus = []; }
        if ($.type(menuOptions.width) != "number" || menuOptions.width < 120) { menuOptions.width = 120 }
        if (menuOptions.width > 400) { menuOptions.width = 400; }
        var menu = $("<div />").attr({ name: name, id: menuOptions.id });
        menu.addClass("easyui-menu").css("width", menuOptions.width).appendTo("body");
        if (menuOptions.menus.length == 0) { $(menu).append("<div data-options='disabled: true' >当前无菜单项</div>"); return menu; }
        var len = menuOptions.menus.length;
        for (var i = 0; i < len; i++) {
            var item = menuOptions.menus[i];
            if (window.isEmptyObjectOrNull(item)) { continue; }
            _appendItemDomToMenu(menu, item, name);
        }
        return menu;
    };
    var _appendItemDomToMenu = function (menu, item, name) {
        if ($.type(item) == "string" && item.trim() == "-") { $("<div class='menu-sep'/>").attr("name", name).appendTo(menu); return; }
        var id = $(menu).attr("id") + "_" + window.guid().replaceAll("-", "").left(8);
        var defaults = { id: null, text: null, iconCls: null, href: null, disabled: false, onclick: function () { }, children: null };
        var options = $.extend({}, defaults, item);
        if (window.isEmptyObjectOrNull(options.id)) { options.id = id; }
        if (!window.isEmptyObjectOrNull(options.children) && $.type(options.children.menus) == "array" && options.children.menus.length > 0) {
            var menuItem = $("<div />").attr("id", options.id).attr("name", name);
            if (!options.disabled) {
                $(menuItem).click(function () { options.onclick.apply(options, arguments); });
                if (!window.isEmptyObjectOrNull(options.href)) { menuItem.attr({ href: options.href, target: "_blank" }); }
            }
            menuItem.attr({ iconCls: options.iconCls, disabled: options.disabled });
            $("<span />").text(options.text).appendTo(menuItem);
            var childrenOptions = options.children;
            if (window.isEmptyObjectOrNull(childrenOptions.id)) {
                childrenOptions.id = $(menu).attr("id") + "_" + window.guid().replaceAll("-", "").left(8);
            }
            var childrenMenu = _createMenuDomObject(childrenOptions, name);
            menuItem.append(childrenMenu);
            $(menu).append(menuItem);
        } else {
            var menuItem = $("<div />").attr("id", options.id).attr("name", name).text(options.text);
            if (!options.disabled) {
                $(menuItem).click(function () { options.onclick.apply(options, arguments); });
                if (!window.isEmptyObjectOrNull(options.href)) { menuItem.attr({ href: options.href, target: "_blank" }); }
            }
            menuItem.attr({ iconCls: options.iconCls, disabled: options.disabled });
            $(menu).append(menuItem);
        }
    };
    var _appendItemToMenu = function (menu, itemOptions) {
        if ($.type(itemOptions) == "string" && itemOptions.trim() == "-") { $(menu).append("<div class='menu-sep'/>"); return; }
        var menuId = $(menu).attr("id") + "_" + window.guid().replaceAll("-", "").left(8);
        var defaults = { parent: null, id: null, text: null, iconCls: null, href: null, disabled: false, onclick: null };
        if ($.type(itemOptions) != "object") { itemOptions = {}; }
        itemOptions = $.extend({}, defaults, itemOptions);
        if (window.isEmptyObjectOrNull(itemOptions.id)) { itemOptions.id = menuId; }
        var itemEl = $("#" + itemOptions.id);
        if (itemEl.length > 0) { $(menu).menu("removeItem", itemEl); }
        if (window.isEmptyObjectOrNull(itemOptions.parent)) {
            $(menu).menu("appendItem", itemOptions);
        } else {
            itemOptions.parent = null; $(menu).menu("appendItem", itemOptions);
        }
    }

    $.extend($.plugin, {
        ////////////////////////////////////////////////
        /// 添加菜单项至指定的菜单组件末尾。该方法有两个参数：
        /// menu: 目标菜单对象的 jquery 选择器、jquery对象或者其 dom 对象；
        /// itemOptions: 新添加菜单的属性值，该参数为一个 JSON 格式对象，其属性继承于 easyui-menu 的 menu-item。
        ////////////////////////////////////////////////
        appendItemToMenu: function (menu, itemOptions) {
            _appendItemToMenu(menu, itemOptions);
        },


        ////////////////////////////////////////////////
        /// 根据指定的属性创建 easyui-menu 对象；
        /// 该方法的参数 options（属性和事件）继承 $.fn.menu.defaults（参见 easyui-menu 的属性和事件），并且在该参数的基础上扩展了如下属性：
        ///     id: 表示该菜单对象的 id 属性值，为一个 string对象；
        ///         如果该值 null，则会为其自动分配一个 id，自动分配的 id 为随机的；
        ///     width: 表示该菜单对象的宽度值像素，为一个 int 数字；
        ///         该属性默认值为 120，并且如果您设置的值小于 120，则自动取值 120；
        ///     autoDispose: 表示该菜单对象是否在触发隐藏后自动释放 dom 资源，默认为 true；
        ///     menus: 该属性为一个数组对象，数组中每个元素都是一个 JSON 对象；
        ///             该 JSON 对象的属性继承于 easyui-menu 的 menu-item 属性，并且在此基础上增加了如下属性：
        ///         children：该属性表示该菜单的子节点菜单，这是一个 JSON 对象；该 JSON 对象的数据格式和该方法的 options 参数格式一样。
        ////////////////////////////////////////////////
        createMenu: function (options) {
            return _createMenu(options);
        }
    });

})(jQuery);