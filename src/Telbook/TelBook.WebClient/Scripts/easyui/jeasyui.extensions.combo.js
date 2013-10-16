////////////////////////////////////////////////////////////////////////////////////////////////
/// 扩展 easyui-combo，使其在原功能基础上增加如下功能或者属性：
/// 1，点击 input 输入框时自动 showPanel。
/// 2，允许 combo 以及它的继承控件(jeasyui-datebox 除外)修改图标：增加 iconCls 属性，以及 setIcon 方法。
////////////////////////////////////////////////////////////////////////////////////////////////
(function ($) {
    var _init = function (target) {
        var t = $(target);
        var opts = t.combo("options");
        if (!opts._initialized) {
            t.combo("textbox").click(function () {
                t.combo("showPanel");
            });
            if (opts.iconCls != null) {
                t.combo("setIcon", opts.iconCls);
            }
            opts._initialized = true;
        }
    };

    var _setIcon = function (target, iconCls) {
        var t = $(target);
        t.combo("textbox").parent().find(".combo-arrow").addClass(iconCls);
        t.combo("options").iconCls = iconCls;
    };

    var _combo = $.fn.combo;
    $.fn.combo = function (options, param) {
        var t = typeof options;
        var d = _combo.apply(this, arguments);
        if (t != "string") { this.each(function () { _init(this); }); }
        return d;
    };

    $.fn.combo.parseOptions = _combo.parseOptions;
    $.fn.combo.defaults = _combo.defaults;
    $.fn.combo.methods = _combo.methods;


    var _defaults = {
        iconCls: null
    };
    var _methods = {
        setIcon: function (jq, iconCls) {
            jq.each(function () {
                _setIcon(this, iconCls);
            });
        },
        setRequired: function (jq, required) {
            jq.each(function () {
                var t = $(this);
                t.combo("textbox").validatebox("options").required = required;
                t.combo("options").required = required;
            });
        }
    };

    $.extend($.fn.combo.defaults, _defaults);
    $.extend($.fn.combo.methods, _methods);

})(jQuery);