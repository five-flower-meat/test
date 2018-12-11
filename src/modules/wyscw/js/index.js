import $ from 'jquery';
import {
  isShowTitle,
  backHandle,
  hasAccessApp
} from './common';
import {
  carouselData,
  videoLink,
  readLink,
  musicLink,
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
  const mgdayMain = $('.wyscw-main');
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
  let title = '我们一起上春晚，全网独播，好礼不断！';
  let description = '春晚研究院为您揭秘春晚那些事儿！';
  let picture = 'https://s.migu.cn/stN/wyscw/static/wyscw/share.jpg';

  (function () {
    if (isLimit) { // 是否限流
      mgdayMain.hide();
      limitHtml.show();
    }
    offline('wyscw'); // 是否下线

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
    $('.wyscw').css('overflow', 'hidden');
    iosDialog({
      width: 290,
      contentHtml: `
      <div class="dialog-reg-title">活动规则</div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">活动时间：</div>
        <div class="dialog-reg-right">2018年12月10日起</div>
      </div>
      <div class="dialog-reg-desc">
        <div class="dialog-reg-left">活动规则：</div>
        <div class="dialog-reg-right"></div>
      </div>
      <div class="dialog-reg-desc">
        1.30G流量免费领：<br/>
        &nbsp&nbsp下载并登录“咪咕视频”APP，进入“我的”→“福利”内领取。30G流量为咪咕视频、咪咕音乐、咪咕阅读、咪咕直播、咪咕游戏、咪咕圈圈6个APP的专属定向流量。其他相关说明以领取页说明为准。
      </div>
      <div class="dialog-reg-desc">
        2.抽奖规则：<br/>
        &nbsp&nbsp用户每天可免费抽奖一次，同时在登录状态下分享活动可增加一次抽奖机会，每天分享最多可获三次抽奖机会，即每人每天最多抽奖四次，奖品有限，抽完为止。高价值奖励每个用户只限领取1次。
      </div>
      <div class="dialog-reg-desc">
        3.奖品发放：<br/>
        &nbsp&nbsp电子卡券类奖品我们将以短信方式发送给用户，实物类奖品将在活动结束后7个工作日内以电话形式联系中奖用户。
      </div>
      <div class="dialog-reg-desc">
        4.咪咕视频钻石会员订购：<br/>
        ①用户成功订购咪咕视频钻石会员后，钻石会员权益直接加入到用户账户内；<br/>
        ②本活动售卖均为咪咕视频钻石会员，不包含TV端权益；<br/>
        ③如用户存在违反法律法规包含但不限于作弊、恶意刷量等行为，其参与活动获取的权益将被取消，并将承担相应的法律责任；<br/>
        ④在法律规定的范围内，咪咕有权对活动规则进行解释，并根据活动实际情况对活动规则进行变动或调整，相关变动或调整将公布在本活动页面。如遇不可抗力，咪咕有权取消本次活动。<br/>
      </div>
      <div class="dialog-reg-desc">
        5.咪咕音乐白金会员和咪咕阅读至尊会员优惠订购，以订购页规则为准。
      </div>
      <div class="dialog-reg-desc">
       6.客服热线：400-1011-118
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

  // 咪咕视频全网独播节目
  for (let i = 0; i < 4; i++) {
    let type = i + 1;
    redirectUrl(`#exclusiveVideo${i + 1}`, videoLink.exclusiveVideo[i], type);
  }

  // 咪咕视频钻石会员特权节目跳转
  for (let i = 0; i < 12; i++) {
    let type = 7 + Math.floor(i / 4);
    redirectUrl(`#video${i + 1}`, videoLink.memberVideo[i], type);
  }

  // 按钮跳转
  redirectUrl(`#download-mgvideo-btn`, videoLink.videoApp, 5);
  redirectUrl(`#being-mgVideoMember-btn`, videoLink.videoOrder, 11);
  redirectUrl(`#musicMember`, musicLink.musicOrder, 0);
  redirectUrl(`#readMember`, readLink.readOrder, 6);
});