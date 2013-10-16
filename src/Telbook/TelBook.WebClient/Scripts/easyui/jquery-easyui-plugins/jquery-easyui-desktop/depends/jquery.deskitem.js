/**
* 桌面图标项目
* 依赖于 jeasyui.draggable 和 jeasyui.droppable
*/
(function () {
    (function () {
        var modual = "jquery.deskitem.js";
        var css = "deskitem.css";
        var path = null;
        $("script").each(function () {
            if (this.src != null) {
                var pos = this.src.indexOf(modual);
                if (pos > -1) { path = this.src.substring(0, pos); }
            }
        });
        window.loadCss(path + css);
    })();


    $.fn.deskitem = function (options, param) {
        if (typeof options == "string") {
            return $.fn.deskitem.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "deskitem");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "deskitem", {
                    options: $.extend({}, $.fn.deskitem.defaults, $.fn.deskitem.parseOptions(this), options)
                });
            }
            //_init(this);
        });
    };

    $.fn.deskitem.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target));
    };

    $.fn.deskitem.methods = {};

    $.fn.deskitem.defaults = {};

    $.parser.plugins.push("deskitem");
})();