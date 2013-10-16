/**
* jQuery EasyUI
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jEasyUI.Plugins.Desktop
* 二次开发 陈建伟
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*
* 引用插件：
*   util.js
*/
(function () {
    (function () {
        var modual = "jquery.deskapp.js";
        var css = "deskapp.css";
        var path = null;
        $("script").each(function () {
            if (this.src != null) {
                var pos = this.src.indexOf(modual);
                if (pos > -1) { path = this.src.substring(0, pos); }
            }
        });
        window.loadCss(path + css);

        if (!$.fn.deskitem) { window.loadJs(path + "depends/jquery.deskitem.js"); }
    })();



    var _init = function (target) {
        var state = $.data(target, "deskapp");
        var opts = state.options;
        var t = $(target);
        _initTarget();
        t.layout(opts);
        if (!state._initialized) {
            _initDesktop();
            state._initialized = true;
        }
        function _initTarget() {
            var childs = [];
            t.children("div").each(function () {
                var opt = $.extend({ region: undefined, split: undefined }, $.fn.panel.defaults, $.parser.parseOptions(this));
                childs.push({ target: this, options: opt });
            });
            if (getChild("center") == null) {
                $("<div></div>").attr("data-options", "region: 'center', border: false").appendTo(t);
            }
            if (getChild("south") == null) {
                $("<div></div>").attr("data-options", "region: 'south', border: false, split: true").css({
                    height: opts.taskbarHeight,
                    "border-top-width": 1
                }).appendTo(t);
            }
            function getChild(region) {
                var child = null;
                for (var i = 0; i < childs.length; i++) { var c = childs[i]; if (c.options.region == region) { child = c; } }
                return child;
            }
        }
        function _initDesktop() {
            t.addClass("deskapp");
            t.find(".layout-panel-south:first").css("border-top-width", "0px");
        }
    };

    $.fn.deskapp = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.deskapp.methods[options];
            if (method) {
                return method.call(this, this, param);
            } else {
                return this.layout(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "deskapp");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "deskapp", {
                    options: $.extend({}, $.fn.deskapp.defaults, $.fn.deskapp.parseOptions(this), options)
                });
            }
            _init(this);
        });
    };

    $.fn.deskapp.parseOptions = function (target) {
        var keys = [];
        for (var k in $.fn.deskapp.defaults) { keys.push(k); }
        return $.extend({}, $.fn.layout.parseOptions(target), $.parser.parseOptions(target, keys));
    };

    $.fn.deskapp.methods = {};

    $.fn.deskapp.defaults = $.extend({}, $.fn.layout.defaults, {
        taskbarPosition: "bottom",
        taskbarHeight: 40
    });

    $.parser.plugins.push("deskapp");

})();