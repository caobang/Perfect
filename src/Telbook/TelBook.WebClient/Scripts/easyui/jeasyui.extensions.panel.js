(function ($) {

    var noSetting = function (value) {
        return !$.isNumeric(value);
    };
    var _onResize = $.fn.panel.defaults.onResize;
    var _paneOnResize = function (width, height) {
        var target = this;
        var panel = $(target);
        if (panel.panel("inlayout") == false) {
            _onResize.call(target, width, height);
            var opts = panel.panel("options");
            var needResizeWidth = false, needResizeHeight = false;
            if (!noSetting(opts.maxWidth)) { if (width > opts.maxWidth) { width = opts.maxWidth; needResizeWidth = true; } }
            if (!noSetting(opts.minWidth)) { if (width < opts.minWidth) { width = opts.minWidth; needResizeWidth = true; } }
            if (!noSetting(opts.maxHeight)) { if (height > opts.maxHeight) { height = opts.maxHeight; needResizeHeight = true; } }
            if (!noSetting(opts.minHeight)) { if (height < opts.minHeight) { height = opts.minHeight; needResizeHeight = true; } }
            if (needResizeWidth || needResizeHeight) {
                var size = {};
                if (needResizeWidth) { $.extend(size, { width: width }); }
                if (needResizeHeight) { $.extend(size, { height: height }); }
                panel.panel("resize", size);
            }
        }
    };

    var _inlayout = function (target) {
        return $(target).panel("body").hasClass("layout-body");
    };

    var _defaults = {
        //表示 easyui-panel 面板的最小宽度。
        minWidth: 10,

        //表示 easyui-panel 面板的最大宽度。
        maxWidth: 10000,

        //表示 easyui-panel 面板的最小高度。
        minHeight: 10,

        //表示 easyui-panel 面板的最大高度。
        maxHeight: 10000,

        //重新定义的 onResize 事件。用于扩展四个新增属性 minWidth、maxWidth、minHeight、maxHeight 的功能。
        onResize: _paneOnResize
    };
    var _methods = {
        inlayout: function (jq) { return _inlayout(jq[0]); }
    };


    $.extend($.fn.panel.defaults, _defaults);
    $.extend($.fn.panel.methods, _methods);
})(jQuery);