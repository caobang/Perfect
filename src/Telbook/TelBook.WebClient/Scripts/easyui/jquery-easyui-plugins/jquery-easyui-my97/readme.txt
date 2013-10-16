/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* My97 DatePicker 4.8 Beta3
* Copyright (c) 2010 My97 All Rights Reserved.
* http://www.my97.net/dp/license.asp
*
* jEasyUI.Plugins.My97DatePicker 1.2.1 beta
* 二次开发 陈建伟(流云)
* 最近更新：2013-05-22
* Copyright 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/

插件说明：
1，概述：为弥补 jeasyui-datebox 插件本身的诸多功能(例如对日期输入限制、双日期面板等方面)的不足，故编写此插件。
该插件基于 jQuery EasyUI 1.3.2 以及 My97 DatePicker 4.8 Beta3 实现，其相关知识产权分属各自作者所有。

2，文件目录说明：
├─jquery-easyui-my97      插件根目录
    ├─目录lang            My97DatePicker 插件的语言文件目录，你可以根据需要清理或添加语言文件。
    ├─目录skin            My97DatePicker 插件的皮肤文件目录，你可以根据需要清理或添加皮肤文件。
    │
    ├  calendar.js         My97DatePicker 插件的语言和皮肤配置文件，无需引入。
    ├  WdatePicker.js      My97DatePicker 插件的主程序文件，无需引入；同一页面中该文件不能多个共存，即使是不同目录。
    ├  util.js             这是一个由本插件作者开发的通用 javascript 函数库，提供一些 js 工具函数；需先于 "jquery.my97.js" 引入该文件；同一页面中该文件不能多个共存，即使是不同目录。
    ├  jquery.my97.js      本插件主程序文件，在调用的地方需使用该文件，同一页面中该文件不能多个共存。
    ├  changelog.txt       本插件的更新日志。
    ├  readme.txt          本说明文件。

3，引用方式：
    A，在需要使用该插件的页面引入 jeasyui 的相关基本库文件，例如 "easyui.css" 和 "jquery.easyui.min.js"；
    B，引入 "util.js" 文件；
    C，引入 "jquery.my97.js" 文件，

4，注意：
    A，请勿修改本文件夹下任何文件的名称，请勿删除本文件夹下任何文件；



======================================================
API 文档：
1，DEMO：
    HTML 代码段：
    <input id="my97" class="easyui-my97" type="text" data-options="required: true, value: '2001-01-01'" />
    JavaScript 代码段：
    $("#my97").my97({ required: true, value: "2001-01-01" });

2，属性：继承于 jeasyui-combo 以及 My97 DatePicker 4.8 Beta3 本身的所有非静态属性；
    关于 My97 DatePicker 4.8 Beta3 本身的所有非静态属性，参考 http://www.my97.net/dp/demo/resource/3.asp

3，方法：继承于 jeasyui-combo，但是不支持 "panel" 方法；

4，事件：继承于 jeasyui-combo 1.3.2 和 My97 DatePicker 4.8 Beta3 中的所有事件。

关于 jeasyui-combo 相关API，参见：http://www.jeasyui.com/documentation/index.php
