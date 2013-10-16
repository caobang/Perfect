////////////////////////////////////////////////
/// IE6 / IE7 / IE8(兼容模式下) 不支持 JSON。
/// 判断浏览器是否为 MSIE 且版本低于 IE9，如果是，则引入 json2.js 文件使浏览器支持 JSON 对象。
/// 该文件的执行依赖于 util.js
////////////////////////////////////////////////
(function () {
    if (window.browser.msie) {
        var version = window.browser.version;
        if (!window.isEmptyObjectOrNull(version)) {
            version = parseInt(version.toString().trim().split(".")[0], 10);
            if (version < 9) {
                window.loadJs(window.resolveUrl("./Resources/Plugins/JSON-js-master/json2.js"));       
            }
        }
    }
})();