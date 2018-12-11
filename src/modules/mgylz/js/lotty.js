import $ from 'jquery';
import IosDialog from '../../../common/js/ios-dialog';
import API from './api';
import { isShowTitle, backHandle } from './common';
import utils from '../../../common/js/utils';

$(function () {
  const lottyBtn = $('.lotty-wheel-btn');
  const circle = $('.lotty-wheel-circle .inter img');
  const isTitle = utils.GetQueryString('isTitle');
  const deg = 60;
  let offOn = true; // 是否正在抽奖
  let hasWin = false; // 是否抽过将

  // 初始化
  (function () {
    isShowTitle();
    backHandle();
  })();

  lottyBtn.click(function () {
    if (hasWin) {
      IosDialog({ content: `您今天已经抽过了~` });
      return false;
    }

    API.getLotty(null, {
      isNotLoading: true
    }).then(res => {
      let { prizeType } = res;
      // 有资格才能抽奖

      if (offOn) {
        circle.css('transform', 'rotate(0deg)');
        offOn = !offOn;
        ratating(prizeType);
      }
    });
  });

  /**
   * @description 转盘
   * @param {Number} prize | '几等奖'
   */
  function ratating(prize) {
    let timer = null;
    let setTimer = null;
    let randomNum = 0;
    clearInterval(timer);
    clearTimeout(setTimer);
    timer = setInterval(function () {
      if (Math.floor(randomNum / 360) < 3) {
        if (prize === 2) {
          randomNum = 3600 + prize * deg;
        } else if (prize === 3) {
          randomNum = 3600 + prize * deg;
        } else {
          randomNum = 3600 + (prize - 1) * deg;
        }
        // randomNum = Math.floor(Math.random() * 3600);
      } else {
        circle.css('transform', `rotate(${randomNum}deg)`);
        clearInterval(timer);
        setTimer = setTimeout(function () {
          hasWin = true;
          offOn = !offOn;
          prizeAlert(prize);
          clearTimeout(setTimer);
        }, 8000);
      }
    }, 30);
  }

  function prizeAlert(prize) {
    if (prize === 1) {
      IosDialog({
        contentHtml: `<div>恭喜！获得一等奖Kindle一台</div><div>Kindle将于下个月发放</div>`,
        confirmContent: '填写地址',
        confirmFunc: function () {
          location.href = utils.addQueryString('./address.html', 'isTitle', isTitle);
        }
      });
    } else if (prize === 2) {
      IosDialog({
        contentHtml: `<div>恭喜！获得二等奖15G通用流量</div><div>流量将于下个月到账，不可结转</div>`,
        confirmContent: '确认',
      });
    } else if (prize === 3) {
      IosDialog({
        contentHtml: `<div>恭喜！获得三等奖30M通用流量</div><div>流量将于下个月到账，不可结转</div>`,
        confirmContent: '确认',
      });
    } else {
      IosDialog({
        content: `出现异常`,
      });
    }
  }
});