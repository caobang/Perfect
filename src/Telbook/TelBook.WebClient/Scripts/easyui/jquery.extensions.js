////////////////////////////////////////////////////////////////////////////////////////////////
/// jquery 的功能扩展。
////////////////////////////////////////////////////////////////////////////////////////////////
(function ($) {
    if (!$.plugin) { $.extend({ plugin: {} }); }
    if (!$.plugin.top) { try { if (window.top) { $.plugin.top = window.top; } else { $.plugin.top = window; } } catch (ex) { $.plugin.top = window; } }
    if (!$.plugin.top$) { try { if ($.plugin.top.$) { $.plugin.top$ = $.plugin.top.$; } else { $.plugin.top$ = window.$; } } catch (ex) { $.plugin.top$ = window.$; } }


    ////////////////////////////////////////////////
    /// 该属性表示是否启用浏览器自动给所有 DOM 元素增加唯一标识符的功能。
    ////////////////////////////////////////////////
    var _initUniqueID = false;
    if (_initUniqueID == true) {
        var _uniqueIdName = "uniqueID";
        ////////////////////////////////////////////////
        /// 判断 HTML DOM 对象是否具有 uniqueID 属性。
        ////////////////////////////////////////////////
        window.hasUniqueID = function (element) {
            if (element && element.getAttribute) {
                return !String.isNullOrWhiteSpace(element.getAttribute(_uniqueIdName));
            } else {
                return true;
            }
        };

        ////////////////////////////////////////////////
        /// 给 HTML DOM 对象设置一个新的 GUID 值。
        ////////////////////////////////////////////////
        window.setElementGuid = function (element, id) {
            if (!id || String.isNullOrWhiteSpace(id)) {
                id = element.tagName + "_" + window.guid().replaceAll("-", "");
            }
            if (element.setAttribute) {
                element.setAttribute(_uniqueIdName, id);
            }
        };

        ////////////////////////////////////////////////
        /// 初始化 HTML DOM 对象的 GUID 值。
        ////////////////////////////////////////////////
        window.initElementGuid = function (element) {
            if (!window.hasUniqueID(element)) {
                window.setElementGuid(element);
            }
        };

        ////////////////////////////////////////////////
        /// 获取 HTML DOM 对象的 GUID 值。
        ////////////////////////////////////////////////
        window.getElementGuid = function (element) {
            return element.getAttribute(_uniqueIdName);
        };


        ////////////////////////////////////////////////
        /// 重写 document.createElement 方法，使之在创建 dom 对象的同时还给对象添加一个唯一标识符 uniqueID。
        ////////////////////////////////////////////////
        var _createElement = document.createElement;
        document.createElement = function (tagName) {
            var element = _createElement.apply(this, arguments);
            window.initElementGuid(element);
            return element;
        };

        ////////////////////////////////////////////////
        /// 重写 document.createDocumentFragment 方法，使之在创建文档碎片并向文档碎片添加子节点时向子节点添加一个唯一标识符 uniqueID。
        ////////////////////////////////////////////////
        var _createDocumentFragment = document.createDocumentFragment;
        document.createDocumentFragment = function () {
            var documentFragment = _createDocumentFragment.apply(this, arguments);
            var _appendChild = documentFragment.appendChild;
            documentFragment.appendChild = function (child) {
                $("*", child).each(function () { window.initElementGuid(this); });
                return _appendChild.apply(this, arguments);
            };
            return documentFragment;
        };

        ////////////////////////////////////////////////
        /// 绑定页面加载事件。
        ////////////////////////////////////////////////
        $(function () {

            ////////////////////////////////////////////////
            /// 如果当前页面所在的 iframe/frame 对象没有唯一标识符，则给其赋值一个。
            ////////////////////////////////////////////////
            window.initElementGuid($.plugin.currentFrame);

            ////////////////////////////////////////////////
            /// 给所有页面 DOM 对象设置 uniqueID 属性。
            ////////////////////////////////////////////////
            $("*").each(function (index, element) {
                window.initElementGuid(element);
            });
        })
    }



    var _guid = function () {
        if (arguments.length == 0) {
            return (this.length > 0 ? window.getElementGuid(this[0]) : null);
        }
        var guid = arguments[0];
        if (this.length > 0) {
            if (this.length > 1) { guid = null; }
            this.each(function (index, element) {
                window.setElementGuid(element, guid);
            });
        }
    };


    $.extend({
        ////////////////////////////////////////////////
        /// 在当前页面追加指定的文本块内容 div，该方法主要用于调试页面，类似于 window.alert 或者 Firefox 浏览器的 console.log() 方法
        ////////////////////////////////////////////////
        print: function (message) {
            $(function () {
                var results = $("div#results");
                if (results.length == 0) { results = $("<div />").attr("id", "results").appendTo(document.body); }
                $("<span />").text(String(message)).appendTo(results);
            });
        }
    });



    $.fn.extend({

        ///序列化标签内所有表单元素的值为一个 JSON 对象。
        serializeObject: function () {
            var obj = {};
            var array = $("*", this).serializeArray();
            $.each(array, function () {
                if (obj[this.name]) {
                    if (String.isNullOrWhiteSpace(obj[this.name])) {
                        obj[this.name] = this.value;
                    }
                } else {
                    obj[this.name] = this.value;
                }
            });
            return obj;
        },

        ////////////////////////////////////////////////
        /// 判断当前选择器选中的元素是否存在焦点。
        ////////////////////////////////////////////////
        isFocus: function () {
            var result = false;
            $(this).each(function (index, element) {
                try {
                    if (result == $(element).attr("id") == document.activeElement.id) {
                        result = true;
                        return false;
                    }
                } catch (exception) { }
            });
            return result;
        },

        ////////////////////////////////////////////////
        /// 获取或设置当前选择器所匹配到的第一个 DOM 对象的唯一标识符值，如果当前选择器没有匹配到对象，则返回 null。
        ////////////////////////////////////////////////
        guid: function () {
            return _guid.apply(this, arguments);
        },

        scrollWidth: function () {
            return $(this).attr("scrollWidth");
        },

        scrollHeight: function () {
            return $(this).attr("scrollHeight");
        },

        scrollTopPercent: function () {
            var height = $(this).height();
            if (height <= 0) { height = 1 };
            return $(this).scrollTop() / height;
        },

        scrollLeftPercent: function () {
            var width = $(this).width();
            if (width <= 0) { width = 1 };
            return $(this).scrollLeft() / width;
        },


        ////////////////////////////////////////////////
        /// 使元素闪动
        ////////////////////////////////////////////////
        shine: function (delay, times) {
            this.each(function () {
                if (delay == undefined || delay <= 40 || !$.isNumeric(delay)) { delay = 100; }
                if (times == undefined || times <= 4 || !$.isNumeric(times)) { times = 10; }
                var element = this;
                var a = function () { $(element).addClass("shine"); };
                var b = function () { $(element).removeClass("shine"); };
                var run = function () {
                    window.call(a);
                    window.call(b, delay / 2);
                    times--;
                    if (times > 0) { window.call(run, delay); }
                };
                window.call(run);
            });
        }
    });







    var _getCurrentFrame = function () {
        var frame = null;
        if (!window.isTopMost) {
            var frames = $.merge(window.parent.$("iframe"), window.parent.$("frame"));
            frame = _getCurrentFrameFromFrames(frames);
        }
        return frame;
    };
    var _getCurrentFrameFromFrames = function (frames) {
        var frame = null;
        for (var i = 0; i < frames.length; i++) {
            var element = frames[i];
            if (element.contentWindow === window) {
                frame = element;
                break;
            } else {
                if (element.contentWindow && element.contentWindow.$) {
                    var temps = $.merge(element.contentWindow.$("iframe"), element.contentWindow.$("frame"));
                    if (temps.length > 0) {
                        frame = _getCurrentFrameFromFrames(temps);
                    }
                    if (frame != null) {
                        break;
                    }
                }
            }
        }
        return frame;
    };
    var _getCurrentFrameId = function () {
        var frame = _getCurrentFrame();
        if (!window.isEmptyObjectOrNull(frame)) {
            return frame.id;
        }
        return null;
    };
    var _getCurrentFrameUniqueID = function () {
        var frame = _getCurrentFrame();
        if (!window.isEmptyObjectOrNull(frame)) {
            return $(frame).guid();
        }
        return null;
    };

    $.extend($.plugin, {

        ////////////////////////////////////////////////
        /// 获取当前页面所在的 iframe/frame 窗体对象。
        ////////////////////////////////////////////////
        currentFrame: _getCurrentFrame(),

        ////////////////////////////////////////////////
        /// 获取当前页面所在的 iframe/frame 窗体对象的 id。
        ////////////////////////////////////////////////
        currentFrameId: _getCurrentFrameId(),

        ////////////////////////////////////////////////
        /// 获取当前页面所在的 iframe/frame 窗体对象的 唯一标识符 uniqueID 的值。
        ////////////////////////////////////////////////
        getCurrentFrameUniqueID: function () {
            return _getCurrentFrameUniqueID();
        },

        ////////////////////////////////////////////////
        /// 获取焦点所在的对象。
        ////////////////////////////////////////////////
        focusElement: function () {
            return $(document.activeElement);
        },

        ////////////////////////////////////////////////
        /// 返回当前浏览器窗口的实际可视区域尺寸，包含窗口的上下和左右滚动条的宽度。
        /// 该方法返回的数据是一个格式为 { width: 100, height: 50 } 的 json 对象。
        ////////////////////////////////////////////////
        browserSize: function () {
            var width = window.browser.msie ? $(document.documentElement).outerWidth() : $(window).width();
            var height = window.browser.msie ? $(document.documentElement).outerHeight() : $(window).height();
            return { width: width, height: height };
        },

        ////////////////////////////////////////////////
        /// 解析函数的运行值并返回。
        /// 该方法有三个参数：
        ///     func：需要解析的函数，可以是一个值，也可以是函数；如果是函数，则该方法返回该函数的运行值；
        ///     params：表示需要传入函数 func 的参数，建议是一个数组，也可以是一个非数组对象，该参数可选；
        ///     call：表示传入函数 func 包内的 this 引用对象，该参数可选。
        ////////////////////////////////////////////////
        parseFunction: function (func, params, call) {
            var value = func;
            if ($.type(func) == "function") {
                if (params && $.type(params) == "array") {
                    value = func.apply(call, params);
                } else {
                    value = func.call(call, params);
                }
            }
            return value;
        },

        ////////////////////////////////////////////////
        /// 解析键值对中的键值格式为 keyName: function 的 JSON 格式对象的函数运算值并返回解析后的数据。
        ///     参数 data 表示需要解析的 JSON 格式对象，不能为数组。
        ////////////////////////////////////////////////
        parseObjectFuncMap: function (data) {
            var result = {};
            if (window.isEmptyObjectOrNull(data) || $.type(data) == "array") {
                data = {};
            }
            for (var key in data) {
                result[key] = $.plugin.parseFunction(data[key]);
            }
            return result;
        },

        ////////////////////////////////////////////////
        /// 将通过 SOA(例如 ASP.NET 一般处理程序 或者 WebService) 方式返回的数据转换成 JSON 格式数据。
        ////////////////////////////////////////////////
        parseSOADataToJSON: function (data) {
            if (!data) { return null; }
            var result = null;
            var dataType = $.type(data);
            if (dataType == "object" || dataType == "array") {
                if (data.d) {
                    var dType = $.type(data.d);
                    if (dType == "object" || dType == "array") {
                        result = data.d;
                    } else {
                        result = $.plugin.parseSOADataToJSON(data.d);
                    }
                } else if (data.text) {
                    var dType = $.type(data.text);
                    if (dType == "object" || dType == "array") {
                        result = data.text;
                    } else {
                        result = $.plugin.parseSOADataToJSON(data.text);
                    }
                } else if (data.xmlVersion || data.__proto__) {
                    var text = $(data).text();
                    result = text ? $.parseJSON(text) : null;
                } else { result = data; }
            } else { result = ($.type(data) == "string" ? $.parseJSON(data) : $.parseJSON($(data).text())); }
            return result;
        },

        ////////////////////////////////////////////////
        /// 对本地数据进行分页处理，并返回分页后的数据集合；该方法有三个参数：
        ///     data：表示要进行本地分页处理的原始数据，为一个数组类型集合；
        ///     pageNumber：表示需要提取的页面数据页码，int 类型数字，从 1 开始计数，默认为 1；
        ///     pageSize：表示需要提取的页面数据的页尺寸，int 类型数字，默认为 10；
        /// 该方法的返回值为一个 JSON 格式的数据，里面还有如下几个属性：
        ///     data：表示分页处理后的页面数据，数组类型的数据集合；
        ///     pageNumber：表示页码，int类型数字，从 1 开始计数；
        ///     pageSize：表示分页页面尺寸大小，int类型数字，默认为 10；
        ///     rowCount：表示原始数据的总行数，int类型数字；
        ///     pageCount：表示分页处理后的页面数量，int类型数字；
        ////////////////////////////////////////////////
        pagingData: function (data, pageNumber, pageSize) {
            if ($.type(pageNumber) != "number" || pageNumber < 1) { pageNumber = 1; }
            if (!pageSize) { pageSize = 10; }
            if ($.type(pageSize) != "number" || pageSize < 1) { pageSize = 1; }
            var result = { data: [], pageNumber: pageNumber, pageSize: pageSize, rowCount: 0, pageCount: 0 };
            if ($.type(data) != "array") {
                return result;
            }
            var rowCount = data.length;
            var pageCount = parseInt(Math.ceil(parseFloat(rowCount) / pageSize), 10);
            result.rowCount = rowCount;
            result.pageCount = pageCount;

            var begin = (pageNumber - 1) * pageSize;
            var end = pageNumber * pageSize - 1;
            var rows = new Array();
            for (var i = begin; i <= end && i < rowCount; i++) {
                rows.push(data[i]);
            }
            result.data = rows;
            return result;
        },


        ////////////////////////////////////////////////
        /// 根据传入的 url 地址和参数请求webservice并返回默认格式数据，一般情况下返回的为 xml 格式数据。
        /// 该方法为 $.ajax 方法的快捷调用，采用 post 方式提交，并且 async 属性设置为 false。
        /// 如果需要更加丰富的 ajax 调用，请用 $.ajax 方法。
        ////////////////////////////////////////////////
        getDataRequestWebService: function (url, parameters) {
            var result = null;
            if ($.isEmptyObject(parameters)) {
                parameters = {};
            }
            $.ajax({
                url: window.resolveUrl(url),
                type: "post",
                data: parameters,
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    throw XMLHttpRequest.responseText;
                },
                success: function (data, textStatus, jqXHR) {
                    result = data;
                }
            });
            return result;
        },


        ////////////////////////////////////////////////
        /// 根据传入的 url 地址和参数请求webservice并返回 json 格式数据。
        /// 该方法依赖调用 $.getDataRequestWebService 方法来实现。
        ////////////////////////////////////////////////
        getJsonDataRequestWebService: function (url, parameters) {
            var result = {};
            var data = $.plugin.getDataRequestWebService(url, parameters);
            var text = $(data).text();
            if (window.isEmptyObjectOrNull(text)) {
                result = {};
            } else {
                result = $.parseJSON(text);
            }
            return result;
        },


        ////////////////////////////////////////////////
        /// 根据传入的 url 地址和参数请求webservice并返回 布尔类型 格式数据。
        /// 该方法依赖调用 $.getDataRequestWebService 方法来实现。
        ////////////////////////////////////////////////
        getBooleanDataRequestWebService: function (url, parameters) {
            var result = false;
            var data = $.plugin.getDataRequestWebService(url, parameters);
            var text = $(data).text();
            result = (text.toLowerCase() == "true");
            return result;
        }
    });
})(jQuery);


