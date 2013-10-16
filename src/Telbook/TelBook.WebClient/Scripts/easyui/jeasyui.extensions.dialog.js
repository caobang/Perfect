(function ($) {
    if (!$.plugin) { $.extend({ plugin: {} }); }

    ////////////////////////////////////////////////
    /// 该属性表示，当打开新窗口时，如果传入的 url 为空，则使用该值指定的替代 url 地址。
    ////////////////////////////////////////////////
    var _blankPageName = window.resolveUrl("BlankTab.aspx");

    var _nullFunc = function (dialog) { };
    var _showDialog = function (options) {
        var defaults = {
            title: "新建对话框",
            iconCls: "icon-add-menu",
            width: 600,
            height: 360,
            modal: true,
            collapsible: true,
            maximizable: true,
            closable: true,
            draggable: true,
            resizable: true,
            shadow: true,
            minimizable: false,
            //是否在iframe加载远程 href 页面数据
            iniframe: false,
            //是否启用保存按钮，保存按钮点击后会关闭模式对话框
            enableSaveButton: true,
            //是否启用应用按钮
            enableApplyButton: true,
            //是否启用关闭按钮
            enableCloseButton: true,
            //点击保存按钮触发的事件，如果该事件范围 false，则点击保存后窗口不关闭。
            onSave: _nullFunc,
            //点击应用按钮触发的事件
            onApply: _nullFunc,
            //关闭窗口时应触发的事件，easyui-dialog本身就有
            onClose: _nullFunc,
            //保存按钮的文字内容
            saveButtonText: "保存",
            //应用按钮的文字内容
            applyButtonText: "应用",
            //关闭按钮的文字内容
            closeButtonText: "关闭",
            saveButtonIconCls: "icon-save",
            applyButtonIconCls: "icon-ok",
            closeButtonIconCls: "icon-close"
        };
        var opts = $.extend({}, $.fn.dialog.defaults, defaults, options);
        if (String.isNullOrWhiteSpace(opts.href) && String.isNullOrWhiteSpace(opts.content)) { opts.href = _blankPageName; }
        if (window.isEmptyObjectOrNull(opts.onApply) || opts.onApply == _nullFunc) { opts.onApply = opts.onSave; }

        var id = "easyui_dialog_" + window.guid().replaceAll("-", "").left(12);
        var frmId = "easyui_dialog_iframe" + window.guid().replaceAll("-", "").left(12);
        var dialog = $("<div />").attr("id", id);
        var hrefBak = opts.href;
        var contentBak = opts.content;
        opts.href = null;
        if (opts.iniframe == true) {
            opts.content = "<iframe id='" + frmId + "' name='" + frmId + "' frameborder='0' width='100%' height='100%' marginwidth='0px' marginheight='0px' scrolling='auto' src='" + hrefBak + "' ></iframe>";
        }
        var _onClose = opts.onClose;
        opts.onClose = function () {
            _onClose.call(this, dialog);
            $.fn.dialog.defaults.onClose.apply(this, arguments);
            $(this).dialog("destroy");
        };

        if (window.isEmptyObjectOrNull(opts.toolbar)) { opts.toolbar = new Array(); }
        if ($.isArray(opts.toolbar)) {
            $.each(opts.toolbar, function () {
                var handler = this.handler;
                if ($.isFunction(handler)) { this.handler = function () { handler.call(dialog, dialog); }; }
            });
            if (opts.toolbar.length == 0) { opts.toolbar = null; }
        }

        var buttons = new Array();
        if (opts.enableSaveButton == true) {
            var btnSave = { text: opts.saveButtonText, iconCls: opts.saveButtonIconCls,
                handler: function (dia) { if (opts.onSave.call(dia, dia) == false) { return; } dia.dialog("close"); }
            };
            buttons.push(btnSave);
        }
        if (opts.enableApplyButton == true) {
            var btnApply = { text: opts.applyButtonText, iconCls: opts.applyButtonIconCls,
                handler: function (dia) { opts.onApply.call(dia, dia); }
            };
            buttons.push(btnApply);
        }
        if (opts.enableCloseButton == true) {
            var btnClose = { text: opts.closeButtonText, iconCls: opts.closeButtonIconCls,
                handler: function (dia) { dia.dialog("close"); }
            };
            buttons.push(btnClose);
        }
        if (window.isEmptyObjectOrNull(opts.buttons) || !$.isArray(opts.buttons)) { opts.buttons = new Array(); }
        opts.buttons = opts.buttons.concat(buttons);
        $.each(opts.buttons, function () {
            var handler = this.handler;
            if ($.isFunction(handler)) { this.handler = function () { handler.call(dialog, dialog); }; }
        });
        if (opts.buttons.length == 0) { opts.buttons = null; }

        dialog.dialog(opts);
        opts = dialog.dialog("options");
        $.extend(opts, { href: hrefBak, content: contentBak });
        $(".dialog-button", dialog).each(function () {
            var color = dialog.css("border-bottom-color");
            $(this).addClass("calendar-header").css({ "height": "auto", "border-top-color": color });
        });
        dialog.dialog("open");

        if (opts.iniframe == false) {
            if (!String.isNullOrWhiteSpace(opts.href)) {
                $(dialog).dialog("header").find(".panel-tool a").attr("disabled", "disabled");
                //$(".dialog-toolbar a", dialog).linkbutton("disable");
                $(".dialog-button a", dialog).linkbutton("disable");
                var _onLoad = opts.onLoad;
                opts.onLoad = function () {
                    _onLoad.apply(this, arguments);
                    var dia = this;
                    var fn = function () {
                        $(dia).dialog("header").find(".panel-tool a").removeAttr("disabled");
                        //$(".dialog-toolbar a", dialog).linkbutton("enable");
                        $(".dialog-button a", dialog).linkbutton("enable");
                    };
                    window.call(fn);
                };
            }
            var fn = function () { dialog.dialog("refresh", hrefBak); };
            window.call(fn);
        }

        var result = { id: id, dialog: dialog, iframe: dialog.find("#" + frmId), iframeId: frmId, iniframe: opts.iniframe };
        return result;
    };


    $.extend($.plugin, {
        _sd: _showDialog,

        ////////////////////////////////////////////////
        /// 按照指定的 options 参数在浏览器顶层 window 弹出 easyui-dialog
        /// 参数 options 在 easyui-dialog 默认参数列表的基础上添加了如下自定义参数：
        ///     iniframe: 表示远程页面是否通过 iframe 方式加载
        ///     enableSaveButton: 是否启用保存按钮，保存按钮点击后会关闭模式对话框
        ///     enableApplyButton: 是否启用应用按钮
        ///     enableCloseButton: 是否启用关闭按钮
        ///     onSave: 点击保存按钮触发的事件，如果该事件范围 false，则点击保存后窗口不关闭。
        ///     onApply: 点击应用按钮触发的事件
        ///     onClose: 关闭窗口时应触发的事件，easyui-dialog本身就有
        ///     saveButtonText: 保存按钮的文字内容
        ///     applyButtonText: 应用按钮的文字内容
        ///     closeButtonText: 关闭按钮的文字内容
        ///     saveButtonIconCls: 保存按钮的图标，默认为："icon-save",
        ///     applyButtonIconCls: 应用按钮的图标，默认为："icon-ok",
        ///     closeButtonIconCls: 关闭按钮的图标，默认为："icon-close"
        ////////////////////////////////////////////////
        showDialog: function (options) {
            return window.top.$.plugin._sd(options);
        }
    });










})(jQuery);