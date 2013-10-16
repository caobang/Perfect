(function ($) {
    var _defaults = {};
    var _defaultSubmit = $.fn.form.methods.submit;
    /// 允许 easyui-form 的提交方法可以提交非 form 标签的 DOM 对象作为表单（以 ajax 而非 隐藏 iframe 方式提交）。
    var _submit = function (jq, options) {
        $(jq).each(function () {
            var form = $(this);
            if (this.tagName.toLowerCase() == "form") { _defaultSubmit.call(form, form, options); } else {
                var opts = $.extend({}, $.fn.form.defaults, options || {});
                var param = $(form).form("getData");
                if (opts.onSubmit) { if (opts.onSubmit.call(form, param) == false) { return; } }
                if (opts.url) { $.post(opts.url, param, function (data) { if (opts.success) { opts.success(data); } }); }
            }
        });
    };
    var _getData = function (jq) {
        return $(jq).serializeObject();
    };
    var _loadData = function (jq, obj) {
        return jq.each(function () {
            _d(this, obj);
        });
    };



    function _d(_e, _f) {
        if (!$.data(_e, "form")) {
            $.data(_e, "form", { options: $.extend({}, $.fn.form.defaults) });
        }
        var _10 = $.data(_e, "form").options;
        if (typeof _f == "string") {

            var _11 = {};
            if (_10.onBeforeLoad.call(_e, _11) == false) {
                return;
            }
            $.ajax({ url: _f, data: _11, dataType: "json", success: function (_12) {
                _13(_12);
            }, error: function () {
                _10.onLoadError.apply(_e, arguments);
            }
            });
        } else {
            _13(_f);
        };
        function _13(_14) {
            var _15 = $(_e);
            for (var _16 in _14) {
                var val = _14[_16];
                var rr = _17(_16, val);
                if (!rr.length) {
                    var f = _15.find("input[numberboxName=\"" + _16 + "\"]");
                    if (f.length) {
                        f.numberbox("setValue", val);
                    } else {
                        $("input[name=\"" + _16 + "\"]", _15).val(val);
                        var textarea = $("textarea[name=\"" + _16 + "\"]", _15);
                        if (textarea.hasClass("easyui-ckeditor")) {
                            textarea.ckeditor("setValue", unescape(val));
                        }
                        else {
                            textarea.val(val);
                        }
                        $("select[name=\"" + _16 + "\"]", _15).val(val);
                        $("span[name=\"" + _16 + "\"]", _15).text(val);
                        $("input[searchboxname=\"" + _16 + "\"]", _15).searchbox("setValue", val);
                    }
                }
                _18(_16, val);
            }
            _10.onLoadSuccess.call(_e, _14);
            _21(_e);
        };
        function _17(_19, val) {
            var _1a = $(_e);
            var rr = $("input[name=\"" + _19 + "\"][type=radio], input[name=\"" + _19 + "\"][type=checkbox]", _1a);
            $.fn.prop ? rr.prop("checked", false) : rr.attr("checked", false);
            rr.each(function () {
                var f = $(this);
                if (f.val() == String(val)) {
                    $.fn.prop ? f.prop("checked", true) : f.attr("checked", true);
                }
            });
            return rr;
        };
        function _18(_1b, val) {
            var _1c = $(_e);
            var cc = ["combobox", "combotree", "combogrid", "datetimebox", "datebox", "combo"];
            var c = _1c.find("[comboName=\"" + _1b + "\"]");
            if (c.length) {
                for (var i = 0; i < cc.length; i++) {
                    var _1d = cc[i];
                    if (c.hasClass(_1d + "-f")) {
                        if (_1d == "datebox") {
                            val = val.toDate().format();
                        }
                        else if (_1d == "combobox") {
                            if ($.type(val) === "boolean") {
                                val = val == true ? "1" : "0";
                            }
                        }
                        if (c[_1d]("options").multiple) {
                            c[_1d]("setValues", val.split(','));
                        } else {
                            c[_1d]("setValue", val);
                        }
                        return;
                    }
                }
            }
        };
    };
    function _21(_28) {
        if ($.fn.validatebox) {
            var t = $(_28);
            t.find(".validatebox-text:not(:disabled)").validatebox("validate");
            var _29 = t.find(".validatebox-invalid");
            _29.filter(":not(:disabled):first").focus();
            return _29.length == 0;
        }
        return true;
    };
    var _methods = {
        submit: _submit,
        getData: _getData,
        loadData: _loadData,
        data: _loadData,
        load: function (jq, data) {
            return jq.each(function () {
                _d(this, data);
            });
        }
    };
    $.extend($.fn.form.defaults, _defaults);
    $.extend($.fn.form.methods, _methods);







    ///////////////////////////////////////////////////
    /// 扩展 easyui-validatebox 可验证的类型。
    ///////////////////////////////////////////////////
    $.extend($.fn.validatebox.defaults.rules, {
        insertValidate: {
            validator: function (value, param) {
                var url = param[1];         //提交地址
                var dbfield = param[2];     //验证字段
                var va = value;             //验证值
                var pa = {
                    DBField: dbfield,
                    Value: va
                };
                var result = $.plugin.getDataRequestWebService(url, pa);
                if (parseInt($(result).text()) > -1) {
                    return false;
                }
                return true;
            },
            message: '{0}有重复记录'
        },
        updateValidate: {
            validator: function (value, param) {
                var url = param[1];         //提交地址
                var dbfield = param[2];     //验证字段
                var va = value;             //验证值
                var key = param[3];
                var pa = {
                    DBField: dbfield,
                    Value: va
                };
                var result = $.plugin.getDataRequestWebService(url, pa);
                if (parseInt($(result).text()) > -1 && $(result).text() != key) {
                    return false;
                }
                return true;
            },
            message: '{0}有重复记录'
        },
        CheckPwd: {
            validator: function (value) {
                //var accout = window.platform.getCurrentUserInfo();
                return '123' == value;
            },
            message: '密码错误'
        },
        code: {  // 只允许输入英文字母或数字
            validator: function (value) {
                return /^[0-9a-zA-Z]*$/.test(value);
            },
            message: '请输入英文字母或数字'
        },
        name: {
            validator: function (value, param) {
                return /^[\u0391-\uFFE5\w]+$/.test(value);
            },
            message: '只允许汉字、英文字母、数字及下划线。'
        },
        title: {
            validator: function (value, param) {
                return /^[\u0391-\uFFE5\w]+$/.test(value);
            },
            message: '只允许汉字、英文字母、数字及下划线。'
        },
        loginName: {//验证是否为合法的用户名
            validator: function (value) { return value.isUserName(); },
            message: "用户名不合法(字母开头，允许6-16字节，允许字母数字下划线)"
        },
        FullName: {
            validator: function (value, param) {
                return /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/.test(value);
            },
            message: '只允许汉字、英文字母或数字。'
        },
        ///上为新增///////////////////////

        minLength: {//指定字符最小长度
            validator: function (value, param) { return value.length >= param[0]; },
            message: "最少输入 {0} 个字符"
        },
        maxLength: {//指定字符最大长度
            validator: function (value, param) { return value.length <= param[0]; },
            message: "最多输入 {0} 个字符"
        },
        length: {//指定字符长度范围。
            validator: function (value, param) {
                var s = 0, e = 0;
                if (param.length > 0) { s = param[0]; }
                if (param.length > 1) { e = param[1]; }
                var b1 = false, b2 = false;
                if (s > 0) { b1 = value.length <= s; }
                if (e > 0) { b2 = value.length >= e; }
                return b1 && b2;
            },
            message: "内容长度介于 {0} 和 {1} 之间"
        },
        startsWith: {//指定以 xxx 开头
            validator: function (value, param) { return value.startsWidth(param[0]); },
            message: "请以指定的字符 {0} 开头"
        },
        endsWith: {//指定以 xxx 结尾
            validator: function (value) { return value.endsWidth(param[0]); },
            message: "请以指定的字符 {0} 开头"
        },
        ipv4: {//验证 ipv4 格式
            validator: function (value) { return value.isIPv4(); },
            message: "请输入有效的 ip 地址"
        },
        urloripv4: {//验证 url 地址或者 ipv4 格式
            validator: function (value) { return value.isUrlOrIPv4(); },
            message: "请输入有效的 url 地址或者 ip 地址"
        },
        longDate: {//验证长日期格式
            validator: function (value) { return value.isLongDate(); },
            message: "请输入有效的长日期格式内容"
        },
        shortDate: {//验证短日期格式
            validator: function (value) { return value.isShortDate(); },
            message: "请输入有效的短日期格式内容"
        },
        date: {//验证长短日期格式
            validator: function (value) { return value.isDate(); },
            message: "请输入有效的时间日期格式内容"
        },
        mobile: {//验证手机号码格式(中国)
            validator: function (value) { return value.isMobile(); },
            message: "请输入有效的手机号码格式(中国)"
        },
        tel: {//验证是否为合法的电话号码(中国)
            validator: function (value) { return value.isTel(); },
            message: "请输入有效的电话号码格式(中国)"
        },
        telOrMobile: {//验证是否为合法的手机号码或电话号码(中国)
            validator: function (value) { return value.isTelOrMobile(); },
            message: "请输入有效的手机号码格式或者电话号码格式(中国)"
        },
        fax: {//验证是否为合法的传真号码(中国)
            validator: function (value) { return value.isFax(); },
            message: "请输入有效的传真号码格式"
        },
        zipCode: {//验证邮政编码格式(中国)
            validator: function (value) { return value.isZipCode(); },
            message: "请输入有效的邮政编码格式"
        },
        existChinese: {//验证是否含有中文字符
            validator: function (value) { return value.existChines(); },
            message: "此处应该含有输入含有中文的内容"
        },
        chinese: {//验证是否全为中文字符
            validator: function (value) { return value.isChinese(); },
            message: "请输入中文"
        },
        english: {//验证是否全为英文字符
            validator: function (value) { return value.isEnglish(); },
            message: "请输入英文"
        },
        fileName: {//验证是否为合法的文件名
            validator: function (value) { return value.isFileName(); },
            message: "请输入有效的文件名称"
        },
        idCard: {//验证是否为合法的身份证号码(中国)
            validator: function (value) { return value.isIDCard(); },
            message: "请输入有效的身份证号码(中国)"
        },
        integer: {//验证整数格式
            validator: function (value) { return value.isInteger(); },
            message: "请输入有效的整数格式内容"
        },
        rangeInteger: {//验证指定值范围内的整数
            validator: function (value, param) {
                if (!value.isInteger()) { return false; }
                var v = parseInt(value, 10);
                return v >= param[0] && v <= param[1];
            },
            message: "请输入值介于 {0} 至 {1} 之间的数字"
        },
        number: {//验证浮点数格式
            validator: function (value) { return value.isNumeric(); },
            message: "请输入有效的数字格式内容"
        },
        numberic: {//验证指定类型的数字格式
            validator: function (value, param) { return value.isNumeric(param[0]) },
            message: "请输入有效的数字格式内容"
        },
        color: {//验证颜色格式 #xxxxxx
            validator: function (value) { return value.isColor(); },
            message: "请输入有效的颜色格式"
        },
        currency: {//验证货币格式
            validator: function (value) { return value.isCurrency(); },
            message: "请输入有效的货币格式"
        },
        qq: {//验证QQ号码，从10000开始
            validator: function (value) { return value.isQQ(); },
            message: "请输入有效的 QQ 号码"
        },
        msn: {//验证 MSN 账号
            validator: function (value) { return value.isMSN(); },
            message: "请输入有效的 MSN 帐号"
        },
        unnormal: {//验证是否包含空格和非法字符Z
            validator: function (value) { return value.isUnNormal(); },
            message: "输入值不能为空和包含其他非法字符"
        },
        carNo: {//验证车牌号码
            validator: function (value) { return value.isCarNo(); },
            message: "请输入有效的车牌号码"
        },
        carEngineNo: {//验证发动机号码
            validator: function (value) { return value.isCarEngineNo(); },
            message: "请输入有效的发动机号码"
        },
        password: {//验证是否可以作为安全密码字符
            validator: function (value) { return value.isSafePassword(); },
            message: "请输入有效的密码(密码由字母和数字组成，至少6位)"
        },
        equals: {//验证两个字符是否相同
            validator: function (value, param) {
                if ($(param[0]).val() != "" && value != "") { return $(param[0]).val() == value; } else { return true; }
            },
            message: "两次输入的内容不一致"
        }
    });






})(jQuery);