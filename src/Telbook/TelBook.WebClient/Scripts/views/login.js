
(function ($) {
    $.util.namespace("login");
    window.login.bindControl = function () {
        $("#LoginWin").window({
            title: "用户登录",
            autoVCenter: true,
            autoHCenter: true
        });
        $("#loginForm").form({
            url: "Login/Login",
            onSubmit: function () {
                var success = $("#loginForm").form("validate");
                if (success) {
                    $.easyui.loading({ msg: "正在登录...", locale: "#LoginWin" });
                }
                return success;
            },
            success: function (data) {
                if (data == "OK") {
                    window.location.href = "/Home";
                    return;
                }
                $.easyui.loaded("#LoginWin");
                $.messager.alert(data);
            }
        });
        $("#btnLogin").click(function () {
            $("#loginForm").submit();
        })
        $("#btnReset").click(function () {
            $("#loginForm").form("clear");
        })
        $('#txtUserName').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#txtPassword").focus();
            }
        });
        $('#txtPassword').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $("#loginForm").submit();
            }
        });
        $("#txtUserName").focus();
    }
})(jQuery);