import $ from 'jquery';
import { isShowTitle, backHandle } from './common';

$(function () {
  (function () {
    isShowTitle(); // 是否显示title bar
    backHandle(); // 注册返回按钮事件
  })();
});