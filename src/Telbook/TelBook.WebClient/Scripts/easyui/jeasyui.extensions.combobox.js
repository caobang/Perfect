////////////////////////////////////////////////////////////////////////////////////////////////
/// 扩展 easyui-combobox，使其在原功能基础上增加如下功能或者属性：
///
////////////////////////////////////////////////////////////////////////////////////////////////
(function ($) {

    var _loader = function (param, success, error) {
        var opts = $(this).combobox("options");
        if (!opts.loadExtensions) {
            opts.paramCache = $.extend({}, $.plugin.parseObjectFuncMap(opts.queryParams), param);
            opts.loadExtensions = true;
        }
        if (!opts.url) {
            return false;
        }
        var queryParams = $.extend({}, opts.paramCache, param);
        var ajaxOptions = {
            type: opts.method,
            url: opts.url,
            data: queryParams,
            dataType: "json",
            success: function (data) {
                var jsonData = $.plugin.parseSOADataToJSON(data);
                success(jsonData);
            },
            error: function () {
                error.apply(this, arguments);
            }
        };
        if (opts.isWebService == true) {
            $.extend(ajaxOptions, {
                data: JSON.stringify(queryParams),
                contentType: "application/json; charset=utf-8"
            });
        }
        $.ajax(ajaxOptions);
    };
    var _load = function (jq, param) {
        jq.each(function () {
            var opts = $(this).combobox("options");
            var url = opts.url;
            opts.paramCache = $.plugin.parseObjectFuncMap(param);
            $(this).combobox("reload", url);
        });
    };

    var _defaults = {
        editable: false,
        panelHeight: 'auto',
        queryParams: null,
        isWebService: true,
        loader: _loader
    };
    var _methods = {
        load: _load
    };

    /////////////////////////////////////////////
    /// 给 easyui-combobox 添加自定义的扩展属性和方法。
    /////////////////////////////////////////////
    $.extend($.fn.combobox.defaults, _defaults);
    $.extend($.fn.combobox.methods, _methods);


})(jQuery);