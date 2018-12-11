import $ from 'jquery';
import {
  isShowTitle,
  backHandle,
  hasAccessApp
} from './common';
import {
  carouselData,
  readLink,
  musicLink,
  videoLink
} from './constant';
import Lottery from './lottery';
import utils from '../../../common/js/utils';
import iosDialog from '../../../common/js/ios-dialog/index';
import share from '../../../common/js/share';
import API from './api';
import lazyLoad from './lazyLoad.js';
import offline from '../../../common/js/offline';

$(function () {
  const appId = parseInt(utils.GetQueryString('miguid'));
  const isMiguApp = utils.GetQueryString('isMiguApp'); // 值为1
  const token = utils.GetQueryString('miguToken') || utils.GetQueryString('mgtoken') || utils.GetQueryString('token');
  const channelId = utils.GetQueryString('channelId');
  const CYCLE_TIME = 5000; // 文字轮播循环时间
  const waitTime = 5000; // 分享之后，响应等待的时间
  const EXTERNAL_CHANNELID = 201811180011; // 外部渠道号
  const lottyBtn = $('#lotteryBtn');
  const carousel = $('.birth-foot-carousel');
  const shareBtn = $('#share');
  const limitHtml = $('limit-page');
  const mgdayMain = $('.mgday-main');
  const shareTop = $('#shareTop');
  const birthFootTip = $('.birth-foot-tip');
  const activityReg = $('.activity-reg');
  let lottery = new Lottery({
    waiting: 2000,
    downMax: 300
  });
  let isLimit = false; // 是否限流页面
  let currentShareCountTotal = 0;

  let shareType = null; // 分享的js对象
  let title = '咪咕汇音乐盛典，群星闪耀，真乐无届';
  let description = '为爱豆打CALL，豪礼等你拿，更有机会免费得门票!';
  let picture = 'https://s.migu.cn/stN/mgdayhui2018/static/mgdayhui2018/share.jpg';

  (function () {
    if (isLimit) { // 是否限流
      mgdayMain.hide();
      limitHtml.show();
    }
    offline('mgdayhui2018');
    lazyLoad(); // 开启懒加载
    isShowTitle(); // 是否显示title bar
    backHandle(); // 注册返回按钮事件
    shareFunc(); // 注册分享
    isShowTopShare(); // 是否展示头部分享按钮

    carouselInit(); // 轮播名单

    lottyBtn.find('.init').show(); // 展示抽奖按钮内容

    API.loginJudge({
      token,
    }, {
      unRedirect: true,
      isNotLoading: true,
    }).then((res) => {
      if (res.return_code === '401') {
        // 不展示分享按钮
        shareBtn.hide();
        birthFootTip.hide();
      }
      queryRemainingTimes();
    });
  })();

  const lottyBtnEvent = function () {
    // 不允许连续抽奖
    if (!lottery.$options.isRunning) {
      luckyDraw();
    }
  };
  lottyBtn.on('click', lottyBtnEvent);

  // 头部点击分享按钮
  shareTop.click(function () {
    shareType.show();
  });

  // 点击活动规则
  activityReg.click(function () {
    iosDialog({
      width: 290,
      contentHtml: `
      <div class="dialog-reg-title">活动规则</div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">活动时间：</div>
        <div class="dialog-reg-right">2018年12月1日—2018年12月9日</div>
      </div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">活动规则：</div>
        <div class="dialog-reg-right">用户可优惠订购咪咕音乐白金会员和咪咕阅读至尊会员年包，如已是会员，之前以“天”为周期订购的，会员权益可叠加使用。</div>
      </div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">抽奖规则：</div>
        <div class="dialog-reg-right">用户每天可免费抽奖一次，同时在登录状态下分享活动一次可增加抽奖机会一次，每天最多分享三次，赠送三次抽奖机会，即每人每天最多抽奖四次，奖品有限，抽完为止。高价值奖励每个用户只限领取1次。</div>
      </div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">奖品发放：</div>
        <div class="dialog-reg-right">电子卡券类奖品将以短信形式通知用户，实物类奖品将在活动结束后7个工作日内以电话形式联系中奖用户。</div>
      </div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">客服热线：</div>
        <div class="dialog-reg-right">400-1011-118</div>
      </div>
      `,
      confirmContent: '我知道了'
    });
  });

  // 点击分享
  shareBtn.click(function () {
    // 提示用户用手机浏览器打开页面
    if (
      !utils.isWechat() &&
      !utils.isMoblie() &&
      !appId
    ) {
      utils.Toast('请用手机浏览器打开页面');
      return false;
    }

    // 如果分享次数达到4次，则不请求接口
    if (currentShareCountTotal === 4) {
      shareType.show();
      return false;
    }
    winDrawChance().then(() => {
      shareType.show();
      setTimeout(function () {
        queryRemainingTimes();
      }, waitTime);
    });
  });

  // 改变分享提示语的内容
  function changeShareHtml(res) {
    if (res.totalTimes === 4) {
      currentShareCountTotal = res.totalTimes;
      shareBtn.find('.present').show();
      shareBtn.find('.word').hide();
      birthFootTip.html('您已得到3次分享机会，明天还有哦～');
    } else {
      shareBtn.find('.present').hide();
      shareBtn.find('.word').show();
    }
  }

  function afterStop(res) {
    queryRemainingTimes(); // 查询次数
    API.winningRecharge({
      channelId,
      winningTime: res.winningTime,
      prizeType: res.prize.prizeType
    }, {
      isNotLoading: true
    }); // 抽奖之后下发短信
  }

  // 抽奖
  function luckyDraw() {
    API.luckyDraw({
      channelId
    }).then(res => {
      if (res.prize.prizeType === 1) {
        // 视频7天会员
        lottery.start(1);
        lottery.afterStop(() => {
          iosDialog({
            contentHtml: `<div>恭喜！获得咪咕视频7天会员体验权益</div><div class="ios-dialog-child">请前往咪咕视频客户端体验（奖品发放可能有延迟，以短信为主）</div>`,
            leftContent: '继续抽奖',
            rightContent: '立即前往',
            rightFunc: function () {
              window.location.href = videoLink.videoApp;
            }
          });
          afterStop(res);
        });
      } else if (res.prize.prizeType === 2) {
        // 音乐7天会员
        lottery.start(5);
        lottery.afterStop(() => {
          iosDialog({
            contentHtml: `<div>恭喜！获得咪咕音乐7天会员体验权益</div><div class="ios-dialog-child">请前往咪咕音乐客户端体验（奖品发放可能有延迟，以短信为主）</div>`,
            leftContent: '继续抽奖',
            rightContent: '立即前往',
            rightFunc: function () {
              window.location.href = musicLink.musicApp;
            }
          });
          afterStop(res);
        });
      } else if (res.prize.prizeType === 3) {
        // 阅读7天会员
        lottery.start(8);
        lottery.afterStop(() => {
          iosDialog({
            contentHtml: `<div>恭喜！获得咪咕阅读7天会员体验权益</div><div class="ios-dialog-child">请前往咪咕阅读客户端体验！（奖品发放可能有延迟，以短信为主）</div>`,
            leftContent: '继续抽奖',
            rightContent: '立即前往',
            rightFunc: function () {
              window.location.href = readLink.readApp;
            }
          });
          afterStop(res);
        });
      } else if (res.prize.prizeType === 6) {
        // 门票
        lottery.start(3);
        lottery.afterStop(() => {
          iosDialog({
            contentHtml: `<div>恭喜！获得咪咕汇门票一张</div><div class="ios-dialog-child">门票兑换码已采用短信形式下发至您的手
            机，请注意查收！</div>`,
            confirmContent: '继续抽奖',
          });
          afterStop(res);
        });
      } else if (res.prize.prizeType === 10) {
        // 谢谢惠顾
        lottery.start(4);
        lottery.afterStop(() => {
          iosDialog({
            contentHtml: `<div>差一点点...</div><div class="ios-dialog-child">与礼物擦肩而过，再试试吧！</div>`,
            confirmContent: '继续抽奖',
          });
          queryRemainingTimes();
        });
      }
    });
  }

  // 查询抽奖次数
  function queryRemainingTimes() {
    API.queryRemainingTimes({
      channelId
    }, {
      unRedirect: true,
      isNotLoading: true,
    }).then(res => {
      lottyBtn.children('.birth-main-lotty__word ').hide();
      changeShareHtml(res);
      if (res.remainingTimes === 0) {
        if (res.totalTimes === 4) {
          lottyBtn.find('.disabled').show();
        } else {
          lottyBtn.find('.zero').show();
        }
        // 解绑点击事件
        lottyBtn.off('click');
        return false;
      } else if (res.remainingTimes === 1) {
        lottyBtn.find('.first').show();
      } else if (res.remainingTimes === 2) {
        lottyBtn.find('.second').show();
      } else if (res.remainingTimes === 3) {
        lottyBtn.find('.third').show();
      } else if (res.remainingTimes === 4) {
        lottyBtn.find('.fourth').show();
      } else {
        lottyBtn.find('.init').show();
      }
      // 重新绑定
      lottyBtn.off('click');
      lottyBtn.on('click', lottyBtnEvent);
    });
  }

  function isInApp() {
    return hasAccessApp(appId) && isMiguApp === '1';
  }

  // 分享
  function shareFunc() {
    if (utils.isWechat()) { // 微信分享
      shareType = new share.ShareWX({
        title: title,
        description: description,
        picture: picture
      });
      shareType.fetch();
    } else if (isInApp()) { // app分享
      let url = utils.RemoveQueryString(window.location.href, 'isMiguApp');
      url = utils.RemoveQueryString(url, 'channelId');
      shareType = new share.ShareAPP({
        shareTitle: title,
        shareDesc: description,
        sharePic: picture,
        appId,
        curUrl: utils.addQueryString(url, 'channelId', EXTERNAL_CHANNELID),
      });
    } else {
      let url = utils.RemoveQueryString(window.location.href, 'isMiguApp');
      url = utils.RemoveQueryString(url, 'channelId');
      console.log('手机');
      shareType = new share.ShareBroswer({
        shareTitle: title,
        shareDesc: description,
        sharePic: picture,
        curUrl: utils.addQueryString(url, 'channelId', EXTERNAL_CHANNELID),
      });
    }
  }

  // 轮播
  function carouselInit() {
    let html = '';
    // 抽奖名单轮播
    carouselData.forEach(val => {
      html += `<li>${val}</li>`;
    });
    carousel.html(html);

    setInterval(() => {
      carousel.animate({
        marginTop: '-13px'
      }, 0, function () {
        $(this).css({
          marginTop: '0px'
        });
        let li = carousel.children().first().clone();
        carousel.children('li:last').after(li);
        carousel.children('li:first').remove();
      });
    }, CYCLE_TIME);
  }

  // 分享入库
  function winDrawChance() {
    return API.winDrawChance({
      channelId
    }, {
      isNotLoading: true
    });
  }

  function redirectUrl(ele, url, type) {
    $(ele).click(function () {
      // 埋点成功之后跳转
      API.analyzeRedirect({
        channelId,
        type: String(type)
      }, {
        isNotRedirectUrl: true
      }).then(() => {
        window.location.href = url;
      });
    });
  }

  function isShowTopShare() {
    // if (
    //   isInApp() ||
    //   (isMiguApp !== '1' && utils.isMoblie()) ||
    //   utils.isWechat()
    // ) {
    //   shareTop.show();
    // }
    shareTop.show();
  }

  // 音乐跳转
  redirectUrl('#music1', musicLink.musicModules[0], 1);
  redirectUrl('#music2', musicLink.musicModules[1], 2);
  redirectUrl('#music3', musicLink.musicModules[2], 3);
  redirectUrl('#music4', musicLink.musicModules[3], 4);
  redirectUrl('#musicBtn', musicLink.musicMember, 5);
  redirectUrl('#musicOrder', musicLink.musicOrder, 0);

  // 阅读跳转
  for (let i = 0; i < 12; i++) {
    let type = 7;
    type = Math.floor(i / 4) + type;
    redirectUrl(`#read${i + 1}`, readLink.readBook[i], type);
  }

  redirectUrl('#readBtn', readLink.readMember, 11);
  redirectUrl('#readOrder', readLink.readOrder, 6);

  // 跳转到答题小游戏
  $('.enter-answer-game__img').click(function () {
    window.location.href = 'https://s.migu.cn/stN/mg-idot-update/index.html';
  });
});