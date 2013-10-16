(function () {
    (function () {
        var modual = "jquery.desktop.js";
        var css = "desktop.css";
        var path = null;
        $("script").each(function () {
            if (this.src != null) {
                var pos = this.src.indexOf(modual);
                if (pos > -1) { path = this.src.substring(0, pos); }
            }
        });
        window.loadCss(path + css);
    })();





})();