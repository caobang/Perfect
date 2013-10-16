(function ($) {
    if (!$.plugin) { $.extend({ plugin: {} }); }
    ////////////////////////////////////////////////////////////////////////////////////////////////
    /// 添加内置的扩展属性。
    ////////////////////////////////////////////////////////////////////////////////////////////////
    if (!$.plugin.top) { try { if (window.top) { $.plugin.top = window.top; } else { $.plugin.top = window; } } catch (ex) { $.plugin.top = window; } }
    if (!$.plugin.top$) { try { if ($.plugin.top.$) { $.plugin.top$ = $.plugin.top.$; } else { $.plugin.top$ = window.$; } } catch (ex) { $.plugin.top$ = window.$; } }
    if (!$.plugin.messager) { $.plugin.messager = $.plugin.top$.messager; }

    if ($.type($.plugin.messager) != "object") {
        try {
            if (window.top && window.top.$) {
                $.plugin.top = window.top;
            } else { $.plugin.top = window; }
        } catch (ex) { $.plugin.top = window; }
        $.plugin.top$ = $.plugin.top.$;
        $.plugin.messager = $.plugin.top$.messager;
    }



    $.extend({
        getValue: function () { },
        getValues: function () { },
        setValue: function (val) { },
        isFormElement: function () {

        },
        isEasyuiElement: function () { },
        isEasyuiFormElement: function () { }
    });


    //    ////////////////////////////////////////////////
    //    /// 更改 easyui 所有组件的事件处理机制，使得一个动作可以绑定多个事件函数。
    //    /// 事件绑定操作通过每个插件的 bind 来进行。
    //    /// 有严重 bug，不使用
    //    ////////////////////////////////////////////////
    //    var _plugins = $.parser.plugins;
    //    for (var i = 0; i < _plugins.length; i++) {
    //        var plugin = _plugins[i];
    //        var defaults = $.fn[plugin].defaults;
    //        var methods = $.fn[plugin].methods;
    //        $.extend(methods, {
    //            bind: function (jq, param) {
    //                var opts = $.extend({ eventName: null, callback: function () { } }, param);
    //                var events = $(jq)[plugin].call(this, "options").events[param.eventName];
    //                events.push(param.callback);
    //            }
    //        });
    //        defaults.events = {};
    //        var callEvent = function (jq, eventName) {
    //            var opts = $(jq)[plugin].call(this, "options");
    //            var events = opts.events[eventName];
    //            var params = new Array();
    //            for (var index = 2; index < arguments.length; index++) { params.push(arguments[index]); }
    //            var returnValue = true;
    //            for (var index = 0; index < events.length; index++) {
    //                returnValue = (returnValue || events[index].apply(this, params));
    //            }
    //            return returnValue;
    //        };
    //        for (var key in defaults) {
    //            var value = defaults[key];
    //            if (key.startsWith("on") && $.isFunction(value)) {
    //                defaults.events[key] = new Array();
    //                defaults[key] = function () {
    //                    var params = new Array();
    //                    params.push(this);
    //                    params.push(key);
    //                    for (var index = 0; index < arguments.length; index++) {
    //                        params.push(arguments[index]);
    //                    }
    //                    return callEvent.apply(this, params);
    //                };
    //            }
    //        }
    //    }


    $.extend($.plugin, {
        ////////////////////////////////////////////////
        /// 通过指定的 options 参数弹出 easyui-messager-show 格式的消息框。
        /// 参数 options 的数据格式参考 $.messager.defaults 值的格式。
        ////////////////////////////////////////////////
        showMessage: function (options) {
            var _msgShowPosition = {
                topLeft: { right: "", left: 0, top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
                topCenter: { right: "", top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
                topRight: { left: "", right: 0, top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
                centerLeft: { left: 0, right: "", bottom: "" },
                center: { right: "", bottom: "" },
                centerRight: { left: "", right: 0, bottom: "" },
                bottomLeft: { left: 0, right: "", top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop },
                bottomCenter: { right: "", top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop },
                bottomRight: null
            };
            var _msgIconCls = {
                "error": "messager-error",
                "info": "messager-info",
                "question": "messager-question",
                "warning": "messager-warning"
            };
            var defaults = $.extend({}, $.plugin.messager.defaults, { position: "topCenter" });
            defaults.title = "操作提醒";
            defaults.timeout = 3000;
            defaults.showType = "slide";
            if ($.type(options) == "string") { options = { msg: options }; }
            options = $.extend({}, defaults, options);
            options.style = _msgShowPosition[options.position];
            if (window.isEmptyObjectOrNull(options.style)) { options.style = undefined; }
            var iconCls = _msgIconCls[options.iconCls];
            if (window.isEmptyObjectOrNull(iconCls)) { iconCls = "messager-info"; }
            var msg = "<div class='messager-icon " + iconCls + "'></div>" + "<div>" + options.msg + "</div>";
            options.msg = msg;
            $.plugin.messager.show(options);
        }
    });



    ////////////////////////////////////////////////
    /// easyui-panel、easyui-window、easyui-dialog 卸载时回收内存，主要用于layout使用iframe嵌入网页时的内存泄漏问题
    ////////////////////////////////////////////////
    var _defaultPaneOnBeforeDestroy = $.fn.panel.defaults.onBeforeDestroy;
    var _defaultWindowOnBeforeDestroy = $.fn.window.defaults.onBeforeDestroy;
    var _defaultDialogOnBeforeDestroy = $.fn.dialog.defaults.onBeforeDestroy;
    var _onBeforeDestroy = function () {
        $("iframe,frame", this).each(function (index, element) {
            try {
                element.contentWindow.close();
                element.remove();
                if (window.CollectGarbage && $.isFunction(window.CollectGarbage)) { window.CollectGarbage(); }
            } catch (ex) { }
        });
    };
    var _paneOnBeforeDestroy = function () { _defaultPaneOnBeforeDestroy.apply(this, arguments); _onBeforeDestroy.apply(this, arguments); };
    var _windowOnBeforeDestroy = function () { _defaultWindowOnBeforeDestroy.apply(this, arguments); _onBeforeDestroy.apply(this, arguments); };
    var _dialogOnBeforeDestroy = function () { _defaultDialogOnBeforeDestroy.apply(this, arguments); _onBeforeDestroy.apply(this, arguments); };
    $.extend($.fn.panel.defaults, { onBeforeDestroy: _paneOnBeforeDestroy });
    $.extend($.fn.window.defaults, { onBeforeDestroy: _windowOnBeforeDestroy });
    $.extend($.fn.dialog.defaults, { onBeforeDestroy: _dialogOnBeforeDestroy });


    ////////////////////////////////////////////////
    /// 更改 jeasyui 中部分控件的国际化语言显示。
    ////////////////////////////////////////////////
    /// 更改 easyui-panel、easyui-window、easyui-dialog 在通过 ajax 加载页面内容时的提示消息。
    var _loadingMessage = "正在加载，请稍待。。。";
    $.extend($.fn.panel.defaults, { loadingMessage: _loadingMessage });
    $.extend($.fn.window.defaults, { loadingMessage: _loadingMessage });
    $.extend($.fn.dialog.defaults, { loadingMessage: _loadingMessage });
    /// 更改 jeasyui-conbo 的非空验证提醒消息语言。
    $.extend($.fn.combo.defaults, {
        missingMessage: $.fn.validatebox.defaults.missingMessage
    });


    ////////////////////////////////////////////////
    /// 更改 easyui 组件的通用错误提示
    ////////////////////////////////////////////////
    var _genericOnLoadError = function () {
        $.messager.progress("close");
        $.plugin.messager.progress("close");
        var msg = null;
        if (arguments.length > 0) { msg = arguments[0].responseText; } else { msg = "系统出现了一个未指明的错误，如果该问题重复出现，请联系您的系统管理员并反馈该故障。"; }
        $.plugin.messager.alert("错误提醒", msg, "error");
    };
    var _defaultDatagridOnLoadError = $.fn.datagrid.defaults.onLoadError;
    var _defaultTreegridOnLoadError = $.fn.treegrid.defaults.onLoadError;
    var _defaultTreeOnLoadError = $.fn.tree.defaults.onLoadError;
    var _defaultCombogridOnLoadError = $.fn.combogrid.defaults.onLoadError;
    var _defaultComboboxOnLoadError = $.fn.combobox.defaults.onLoadError;
    var _defaultFormOnLoadError = $.fn.form.defaults.onLoadError;
    var _datagridOnLoadError = function () { _defaultDatagridOnLoadError.apply(this, arguments); _genericOnLoadError.apply(this, arguments); };
    var _treegridOnLoadError = function () { _defaultTreegridOnLoadError.apply(this, arguments); _genericOnLoadError.apply(this, arguments); };
    var _treeOnLoadError = function () { _defaultTreeOnLoadError.apply(this, arguments); _genericOnLoadError.apply(this, arguments); };
    var _combogridOnLoadError = function () { _defaultCombogridOnLoadError.apply(this, arguments); _genericOnLoadError.apply(this, arguments); };
    var _comboboxOnLoadError = function () { _defaultComboboxOnLoadError.apply(this, arguments); _genericOnLoadError.apply(this, arguments); };
    var _formOnLoadError = function () { _defaultFormOnLoadError.apply(this, arguments); _genericOnLoadError.apply(this, arguments); };
    $.extend($.fn.datagrid.defaults, { onLoadError: _datagridOnLoadError });
    $.extend($.fn.treegrid.defaults, { onLoadError: _treegridOnLoadError });
    $.extend($.fn.tree.defaults, { onLoadError: _treeOnLoadError });
    $.extend($.fn.combogrid.defaults, { onLoadError: _combogridOnLoadError });
    $.extend($.fn.combobox.defaults, { onLoadError: _comboboxOnLoadError });
    $.extend($.fn.form.defaults, { onLoadError: _formOnLoadError });



    ////////////////////////////////////////////////
    /// 更改 jquery ajax 的部分默认属性和方法。
    ////////////////////////////////////////////////
    $.ajaxSetup({
        type: "post",
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $.plugin.messager.progress("close");
            if ($.plugin.messager != $.messager) { $.messager.progress("close"); }
            var msg = null;
            if (XMLHttpRequest) {
                if (String.isNullOrWhiteSpace(XMLHttpRequest.responseText)) {
                    msg = "系统出现了一个未指明的错误，如果该问题重复出现，请联系您的系统管理员并反馈该故障。"
                } else {
                    msg = XMLHttpRequest.responseText;
                }
            } else {
                msg = "系统出现了一个未指明的错误，如果该问题重复出现，请联系您的系统管理员并反馈该故障。"
            }
            $.plugin.messager.alert("错误提醒", msg, "error");
        }
    });
})(jQuery);