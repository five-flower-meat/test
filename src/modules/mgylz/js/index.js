import $ from 'jquery';
// import IosDialog from '../../../common/js/ios-dialog';
import API from './api';
import { isShowTitle, backHandle } from './common';
import utils from '../../../common/js/utils';
import offline from '../../../common/js/offline';

$(function () {
  const sign = $('.sign-btn .word');
  const boardContent = $('.board-conent');
  const boardTitleWord = $('.board-title__word');
  const token = utils.GetQueryString('token');
  const isTitle = utils.GetQueryString('isTitle');

  (function () {
    offline('mgylz');
    isShowTitle(); // 是否显示title bar
    backHandle(); // 注册返回按钮事件

    // 判断是否登录
    API.loginJudge({
      redirectUrl: window.location.href,
      token,
    },
    {
      unRedirect: true,
      isNotLoading: true,
      isNotShowDialog: true,
    }).then(() => {
      getPrizeList();
    });
  })();

  // 点击签到
  sign.click(function () {
    API.clickSign().then(res => {
      utils.Toast('签到成功');
      setTimeout(() => {
        location.href = utils.addQueryString('./lotty.html', 'isTitle', isTitle);
      }, 2000);
    });
  });

  function getPrizeList() {
    // 奖品list
    API.getPrizeList(null, {
      unRedirect: true,
      isNotLoading: true,
      isNotShowDialog: true,
    }).then(res => {
      // 活动已结束
      if (res.return_code === '401') {
        return false;
      } else if (res.isActive === 0) {
        signDisabled('活动已结束');
      } else if (res.signTotal === 2) {
        signDisabled('两次签到已完成');
      } else if (res.signToday === 1) {
        signDisabled('今日已完成签到');
      } else {
        // 可抽奖
      }
      prizeListHtml(res ? res.winningList : [], res.signTotal);
    });
  }

  function signDisabled(val) {
    sign.html(val);
    sign.addClass('completed');
    sign.unbind('click');
  }

  function prizeListHtml(list = [], signTotal) {
    let html = '';
    const htmlFill = val => {
      return `
      <li class="board-item">
      ${val.prizeType}<span>${val.winningTime}</span>
      </li>
      `;
    };
    // 如果已经有签到信息
    if (Number(signTotal) > 0) {
      if (list.length) {
        list.forEach(val => {
          html += htmlFill(val);
        });
      } else {
        html = '';
      }
      boardTitleWord.html('中奖详情');
    } else {
      return false;
    }

    boardContent.html(html);
  }
});