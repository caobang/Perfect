////////////////////////////////////////////////
////    基于ckeditor的easyui插件扩展
////    最近更新：2013-05-21
///////////////////////////////////////////////
(function ($) {

    var _init = function (target, opts) {
        var editor = CKEDITOR.replace(target, opts);
        return { editor: editor };
    };
    var _setValue = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        editor.setData(value);
    };
    var _getValue = function (target) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.getData();
    };
    var _insertText = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.insertText(value);
    };
    var _insertHtml = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.insertHtml(value);
    };
    var _focus = function (target) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.focus();
    };
    var _checkDirty = function (target) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.checkDirty();
    };
    var _destroy = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        editor.destroy();
    };
    var _execCommand = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.execCommand(value);
    };
    var _setReadOnly = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.setReadOnly(value);
    };
    var _setUiColor = function (target, value) {
        var editor = $.data(target, "ckeditor").editor;
        return editor.setUiColor(value);
    };
    var _isEmpty = function (target) {
        return _getValue(target).isNullOrWhiteSpace();
    };

    $.fn.ckeditor = function (options, params) {
        if (typeof options == "string") {
            return $.fn.ckeditor.methods[options](this, params);
        }
        options = options || {};
        return this.each(function () {
            var data = $.data(this, "ckeditor");
            if (data) {
                $.extend(data.options, options);
            } else {
                var opts = $.extend({}, $.fn.ckeditor.parseOptions(this), options);
                var ck = _init(this, opts);
                $.data(this, "ckeditor", { options: opts, editor: ck.editor });
            };
        });
    };
    $.fn.ckeditor.methods = {
        options: function (jq) {
            return $.data(jq[0], "ckeditor").options;
        },
        editor: function (jq) {
            return $.data(jq[0], "ckeditor").editor;
        },
        setValue: function (jq, value) {
            return jq.each(function () {
                _setValue(this, value);
            });
        },
        getValue: function (jq, value) {
            return _getValue(jq[0]);
        },
        insertText: function (jq, value) {
            return jq.each(function () {
                _insertText(this, value);
            });
        },
        insertHtml: function (jq, value) {
            return jq.each(function () {
                _insertHtml(this, value);
            });
        },
        clear: function (jq) {
            return jq.each(function () {
                _setValue(this, "");
            });
        },
        focus: function (jq) {
            return _focus(jq[0]);
        },
        checkDirty: function (jq) {
            return _checkDirty(jq[0]);
        },
        destroy: function (jq) {
            return jq.each(function () {
                _destroy(this);
            });
        },
        execCommand: function (jq, value) {
            return jq.each(function () {
                _execCommand(this, value);
            });
        },
        setReadOnly: function (jq, value) {
            return jq.each(function () {
                _setReadOnly(this, value);
            });
        },
        setUiColor: function (jq, value) {
            return jq.each(function () {
                _setUiColor(this, value);
            });
        },
        isEmpty: function (jq) {
            return _isEmpty(jq[0]);
        }

    };

    $.fn.ckeditor.parseOptions = function (target) {
        var jq = $(target);
        return $.extend({}, $.parser.parseOptions(target, ["width", "height", "toolbar", "uiColor", { toolbarCanCollapse: "boolean"}]));

    };

    $.parser.plugins.push('ckeditor');

    //    CKEDITOR.on('instanceReady', function (ev) {
    //        var editor = ev.editor;
    //        var target = editor.element.$;
    //        var ckeditor = $(target).next().find("iframe");
    //        var opts = $.data(target, "ckeditor").options;
    //        ckeditor.validatebox(opts);
    //    });

})(jQuery);