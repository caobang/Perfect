(function ($) {
    if (!$.plugin) { $.extend({ plugin: {} }); }


    ////////////////////////////////////////////////
    /// 该属性表示，当打开新窗口时，如果传入的 url 为空，则使用该值指定的替代 url 地址。
    ////////////////////////////////////////////////
    var _blankPageName = window.resolveUrl("BlankTab.aspx");

    var _open = function (options) {
        var defaults = {
            title: "新建窗口",
            iconCls: "icon-add-menu",
            width: 600,
            height: 360,
            closable: true,
            shadow: true,
            modal: true,
            resizable: true,
            draggable: true,
            maximizable: true,
            minimizable: false,
            collapsible: true
        };
        var _onMove = options.onMove;
        defaults = $.extend({}, $.fn.window.defaults, defaults);
        options = $.extend({}, defaults, options);
        if (window.isEmptyObjectOrNull(options.url)) { options.url = _blankPageName; }
        var divId = "easyuiWindow_" + window.guid().replaceAll("-", "").left(12);
        var frameId = "easyuiWindow_iframe_" + window.guid().replaceAll("-", "").left(12);
        var easyuiWindow = $("<div id='" + divId + "' />");
        var windowOptions = $.extend({}, options);
        var uniqueID = null;
        $.extend(windowOptions, {
            content: "<iframe id='" + frameId + "' style='overflow: hidden;' srcolling='no' width='100%' height='100%' frameborder='0' marginwidth='0px' marginheight='0px' src='" + options.url + "'></iframe>",
            onMove: function (left, top) {
                $.fn.window.defaults.onMove.apply(this, arguments); if ($.type(_onMove) == "function") { _onMove.apply(this, arguments); }
            }
        });
        $(easyuiWindow).window(windowOptions);
        $(easyuiWindow).window("open");
        var result = {
            id: divId,
            easyuiWindow: easyuiWindow,
            window: $(easyuiWindow).find("iframe")[0].contentWindow,
            iframe: $(easyuiWindow).find("iframe"),
            iframeDom: $(easyuiWindow).find("iframe")[0],
            iframeWindow: $(easyuiWindow).find("iframe")[0].contentWindow,
            iframeId: frameId
        };
        window.initElementGuid(result.iframeDom);
        uniqueID = $(result.iframeDom).guid();
        $(easyuiWindow).window("options").onClose = function () {
            options.onClose.apply(this, arguments);
            if (window.top._easyuiWindowHistoryCache) {
                var temps = new Array();
                for (var i = 0; i < window.top._easyuiWindowHistoryCache.length; i++) {
                    if (uniqueID != window.top._easyuiWindowHistoryCache[i].currentId) { temps.push(window.top._easyuiWindowHistoryCache[i]); }
                }
                window.top._easyuiWindowHistoryCache = temps;
            }
            var d1, d2, d3;
            d1 = $(this).parent();
            var opts = $(this).window("options");
            if (opts.shadow) { d2 = d1.next(".window-shadow"); } else { d2 = d1; }
            if (opts.modal) { d3 = d2.next(".window-mask"); } else { d3 = d2; }
            easyuiWindow.find("iframe").attr("src", "");
            d1.remove(); d2.remove(); d3.remove();
        };
        return result;
    };
    var _show = function (options) {
        if ($.type(options) != "object") { options = {}; }
        var easyuiWindow = window.top.$.plugin._sw(options);
        if (!window.top._easyuiWindowHistoryCache) { window.top._easyuiWindowHistoryCache = new Array(); }
        var currentId = $(easyuiWindow.iframe).guid();
        var parentId = $.plugin.getCurrentFrameUniqueID();
        window.top._easyuiWindowHistoryCache.push({ currentId: currentId, parentId: parentId });
        return easyuiWindow;
    };
    var _close = function () {
        var len = arguments.length;
        if (len == 0) {
            var frames = window.top.$("iframe");
            for (var i = 0; i < frames.length; i++) {
                var frame = frames[i]; if (frame.contentWindow === window) { window.top.$(frame).parent().window("close"); }
            }
        } else if (len == 1) {
            var frameId = arguments[0]; window.top.$("#" + frameId).parent().window("close");
        } else {
            var frameId = arguments[0]; var forceClose = arguments[1]; window.top.$("#" + frameId).parent().window("close", forceClose);
        }
    };
    var _getFrameFromFramesByUniqueID = function (frames, uniqueID) {
        var result = null;
        var len = frames.length;
        for (var i = 0; i < len; i++) {
            var frame = frames[i];
            if ($(frame).guid() == uniqueID) {
                result = frame;
                break;
            } else {
                if (frame.contentWindow && frame.contentWindow.$) {
                    var temps = $.merge(frame.contentWindow.$("frame"), frame.contentWindow.$("iframe"));
                    if (temps.length > 0) {
                        result = _getFrameFromFramesByUniqueID(temps, uniqueID);
                    }
                    if (result != null) {
                        break;
                    }
                }
            }
        }
        return result;
    };
    var _parent = function () {
        if (window.isTopMost) { return window; }
        if (window.parent != window.top) { return window.parent; }
        var currentId = $.plugin.getCurrentFrameUniqueID();
        if (window.isEmptyObjectOrNull(currentId)) { return window.parent; }
        if (window.top._easyuiWindowHistoryCache) {
            var cache = window.top._easyuiWindowHistoryCache;
            var len = cache.length;
            for (var i = 0; i < len; i++) {
                var item = cache[i];
                if (currentId == item.currentId) {
                    var parentId = item.parentId;
                    if (!window.isEmptyObjectOrNull(parentId)) {
                        var frames = $.merge(window.top.$("frame"), window.top.$("iframe"));
                        var result = null;
                        result = _getFrameFromFramesByUniqueID(frames, parentId);
                        return (window.isEmptyObjectOrNull(result) ? window.parent : result.contentWindow);
                    } else { return window.parent; }
                }
            }
            return window.parent;
        } else { return window.parent; }
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////
    /// 重定义 easyui-panel、easyui-window、easyui-dialog 的 onMove 事件，使之不能移出父级对象边界。
    ////////////////////////////////////////////////////////////////////////////////////////////////
    var _onPanelMove = $.fn.panel.defaults.onMove;
    var _panelOnMove = function (left, top) {
        _onPanelMove.call(this, left, top);
        var _needLeft = false, _needTop = false;
        var panel = this;
        var opts = $(panel).panel("options");
        if (opts.maximized && opts.autoRestore) {
            if (opts.shadow == true) {
                var sd = $(panel).parent().next(".window-shadow");
                if (sd.length == 0) { sd = $(panel).parent().next().next(".window-shadow") }
                if (sd.length == 0) { sd = $(panel).parent().next().next().next(".window-shadow") }
                if (sd.length > 0) {
                    var point = sd.offset();
                    var absLeft = Math.abs(point.left - left), absTop = Math.abs(point.top - top);
                    if (absLeft > 20 || absTop > 20) { if ($(panel).panel("options").maximized) { $(panel).panel("restore"); return; } }
                } else { if ($(panel).panel("options").maximized) { $(panel).panel("restore"); return; } }
            } else { $(panel).panel("restore"); return; }
        }
        var panelObj = $(panel).panel("panel");
        var parentDom = (panelObj[0].tagName.toLowerCase() == "body" ? panelObj : panelObj.parent());
        var parentOffset = parentDom.offset();
        if (top < parentOffset.top + 2) {
            if (!opts.maximized && opts.maximizable && opts.autoMaximizable) {
                opts.top = 100; $(panel).panel("maximize"); return;
            } else { top = parentOffset.top + 2; _needTop = true; }
        }
        if (left < parentOffset.left + 2) { left = parentOffset.left + 2; _needLeft = true; }
        var width = opts.width;
        var height = opts.height;
        var browserSize = $.plugin.browserSize();
        var size = {};
        if (parentDom.length == 0 || parentDom[0].tagName.toLowerCase() == "body") { size = browserSize; } else {
            size = { width: parentDom.outerWidth(), height: parentDom.outerHeight() };
            if ($.type(size.width) != "number" || size.width == 0) { size.width = browserSize.width; }
            if ($.type(size.height) != "number" || size.height == 0) { size.height = browserSize.height; }
        }
        if (width == "auto") { width = $(panel).parent().outerWidth(); }
        if (height == "auto") { height = $(panel).parent().outerHeight(); }
        if (left + width > size.width) { left = size.width - width - 4; _needLeft = true; }
        if (top + height > size.height) { top = size.height - height - 4; _needTop = true; }
        if (_needLeft || _needTop) {
            var point = {};
            if (_needLeft) { $.extend(point, { left: left }); }
            if (_needTop) { $.extend(point, { top: top }); }
            $(panel).panel("move", point); return;
        }
        if (opts.shadow == true) {
            var fn = function () { $(panel).parent().next(".window-shadow").css({ left: left, top: top }); }
            window.call(fn);
        }
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////
    /// 给 easyui-window 和 easyui-dialog 控件绑定点击标题头部时能自动最大或者最小化，绑定表头的右键点击菜单；
    ////////////////////////////////////////////////////////////////////////////////////////////////
    var _onWindowBeforeOpen = $.fn.window.defaults.onBeforeOpen;
    var _windowOnBeforeOpen = function () {
        var jq = this;
        var _bindOnOpenDbClickTitleEvent = $(jq).data("_bindOnOpenDbClickTitleEvent");
        if (!_bindOnOpenDbClickTitleEvent) {
            $(jq).prev(".window-header").bind({
                dblclick: function () {
                    var options = $(jq).window("options");
                    if (options.maximizable) {
                        if (options.maximized) { $(jq).window("restore"); } else { $(jq).window("maximize"); }
                        if (options.shadow == true) {
                            var fn = function () {
                                $(jq).parent().next(".window-shadow").css({ left: options.left, top: options.top, width: options.width, height: options.height });
                            }
                            window.call(fn);
                        }
                    }
                },
                contextmenu: function (e) {
                    e.preventDefault();
                    var options = $(jq).window("options");
                    var d1 = (!options.maximizable || options.maximized);
                    var d2 = !options.maximized;
                    var d3 = !options.closable;
                    var menuOptions = {
                        width: 140, menus: [
                            { text: "最大化", iconCls: "panel-tool-max", disabled: d1, onclick: function () { if (!this.disabled) { $(jq).window("maximize"); } } },
                            { text: "恢复", iconCls: "panel-tool-restore", disabled: d2, onclick: function () { if (!this.disabled) { $(jq).window("restore"); } } }, "-",
                            { text: "关闭", iconCls: "panel-tool-close", disabled: d3, onclick: function () { if (!this.disabled) { $(jq).window("close"); } } }
                        ]
                    };
                    var menu = $.plugin.createMenu(menuOptions);
                    menu.menu("show", { left: e.pageX, top: e.pageY });
                }
            });
            $(jq).data("_bindOnOpenDbClickTitleEvent", true);
        }
        return _onWindowBeforeOpen.call(this);
    };
    var _panelDefaults = { onMove: _panelOnMove, autoMaximizable: false, autoRestore: true };
    var _windowDefaults = $.extend({}, _panelDefaults, { onBeforeOpen: _windowOnBeforeOpen });
    $.extend($.fn.panel.defaults, _panelDefaults);
    $.extend($.fn.window.defaults, _windowDefaults);
    $.extend($.fn.dialog.defaults, _windowDefaults);



    $.extend($.plugin, {

        _sw: _open,

        ////////////////////////////////////////////////
        /// 按照指定的 options 参数在浏览器顶层 window 弹出 easyui-window；
        /// options 参数的格式为 easyui-window 的 options 参数($.fn.window.defaults)的基础上加上 url 值；
        ///     url表示弹出的 easyui-window 对象装载的页面，为一个绝对路径地址，或者相对于本应用程序根路径的地址。
        /// 该 window 对象中加载的是一个 iframe 页面。
        ////////////////////////////////////////////////
        showWindow: function (options) {
            return _show(options);
        },

        ////////////////////////////////////////////////
        /// 关闭顶部 window 对象中的 easyui-window 窗口。
        ///  该方法可带的参数为 0 个 、 1 个 或者 2 个；
        ///  如果不输入参数，则是关闭装载当前页面的 easyui-window 窗口；
        ///  第 1 个参数，可选，表示需要关闭的 div 窗体中的 iframe 的 id，如果关闭当前窗口，可以不用输入。
        ///  第 2 个参数，在输入第一个参数后，可选，true 或者 false 的布尔值，表示在关闭 div 窗口前是否触发其 onBeforeClose 函数的回调。
        ////////////////////////////////////////////////
        closeWindow: function () {
            _close.apply(this, arguments);
        },

        ////////////////////////////////////////////////
        /// 在任意 iframe/frame 或通过本扩展文件中的 $.plugin.showWindow 方法打开的 easyui-window 中使用
        /// 获取对 父级窗口/frame/iframe/window 的 window 对象引用。
        /// 或者获取打开当前页面所在的 easyui-window 对象的窗口的引用。
        ////////////////////////////////////////////////
        parent: function () {
            return _parent();
        }
    });



    //下面两行代码给 easyui-window 及 easyui-dialog 都添加一个自定义的属性 autoCenter，表示 easyui-window、easyui-dialog 窗口是否随着屏幕大小调整而自动居中
    $.extend($.fn.window.defaults, { autoCenter: true });
    $.extend($.fn.window.dialog, { autoCenter: true });


    $(function () {
        ////////////////////////////////////////////////
        /// 设置当屏幕大小调整时，所有通过 easyui-window 或 easyui-dialog 形式打开的窗口自动居中。
        ////////////////////////////////////////////////
        $(window).resize(function () {
            $(".window-body").each(function (index, element) {
                var opts = $(element).window("options");
                if (opts.draggable == true && opts.autoCenter == true) { $(element).window("center"); }
            });
        });
        ////////////////////////////////////////////////
        /// 在当前打开 modal:true 的 easyui-window 或者 easyui-dialog 时，按 ESC 键关闭顶层的 easyui-window 或者 easyui-dialog 对象。
        ////////////////////////////////////////////////
        $(document).keydown(function (e) {
            if (e.keyCode == 27) {
                $("div.window-mask:last").prevAll("div.panel.window:first").children(".window-body").each(function () {
                    var win = $(this);
                    var fn = function () {
                        var opts = win.window("options");
                        if (opts.closable == true && win.window("header").find(".panel-tool a").attr("disabled") == undefined) {
                            win.window("close");
                        }
                    };
                    window.call(fn);
                });
            }
        });
        ////////////////////////////////////////////////
        /// 点击模式对话框（例如 easyui-messager、easyui-window、easyui-dialog）的背景使窗口闪动
        ////////////////////////////////////////////////
        $(document.body).delegate("div.window-mask:last", "click", function () {
            $(this).prevAll("div.panel.window:first").shine();
        });
    });
})(jQuery);