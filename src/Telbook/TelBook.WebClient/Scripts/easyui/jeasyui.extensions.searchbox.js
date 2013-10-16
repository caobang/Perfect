(function ($) {
    var _init = function (target) {
        var t = $(target);
        var opts = t.searchbox("options");
        if (opts._initialized != true) {
            if (opts.iconCls != null) {
                t.searchbox("setIcon", opts.iconCls);
            }
            opts._initialized = true;
        }
    };

    var _setIcon = function (target, iconCls) {
        var t = $(target);
        t.searchbox("textbox").parent().find(".searchbox-button").addClass(iconCls);
        t.searchbox("options").iconCls = iconCls;
    };

    var _searchbox = $.fn.searchbox;
    $.fn.searchbox = function (options, param) {
        var t = typeof options;
        var d = _searchbox.apply(this, arguments);
        if (t != "string") { this.each(function () { _init(this); }); }
        return d;
    };
    $.fn.searchbox.parseOptions = _searchbox.parseOptions;
    $.fn.searchbox.defaults = _searchbox.defaults;
    $.fn.searchbox.methods = _searchbox.methods;


    var _defauls = {
        iconCls: null
    };
    var _methods = {
        setIcon: function (jq, iconCls) {
            jq.each(function () {
                _setIcon(this, iconCls);
            });
        }
    };

    $.extend($.fn.searchbox.defaults, _defauls);
    $.extend($.fn.searchbox.methods, _methods);
})(jQuery);