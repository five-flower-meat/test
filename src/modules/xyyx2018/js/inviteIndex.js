import $ from 'jquery';
import share from '../../../common/js/share';
import utils from '../../../common/js/utils';
// import API from './apis.js';

$(function () {
  if (!location.href.includes('invite.html')) return false;

  const appId = utils.GetQueryString('miguid');
  // const token = utils.GetQueryString('token');
  const inviteFriends = $('#inviteFriends');
  const appTypeFromUrl = utils.GetQueryString('channel');
  const back = $('#back');
  const qrCode = $('.invi-qr-code');
  const poster = $('.poster');
  const posterClose = $('.poster-close');

  // let firstResponse = {};
  let shareType;

  back.click(function () {
    history.back(-1);
  });

  if (utils.isWechat()) {
    shareType = new share.ShareWX();
    // 微信分享
  } else if (appId) {
    // app分享
    shareType = new share.ShareAPP({
      shareTitle: 'test',
      shareDesc: 'test',
      appId,
      appTypeFromUrl,
      curUrl: utils.RemoveQueryString('miguid'),
    });
  } else if (utils.isMoblie()) {
    // 手机浏览器分享
    console.log('手机');
    shareType = new share.ShareBroswer();
  } else {
    console.log('不展示分享');
  }
  inviteFriends.click(function () {
    shareType.update({
      shareTitle: '测试标题',
      shareDesc: '测试详情',
      curUrl: utils.RemoveQueryString('miguid'),
      sharePic: 'http://s.migu.cn/stN/html/worldcup/images/bg.png'
    });
    shareType.show();
  });

  qrCode.click(function () {
    poster.show();
  });
  posterClose.click(function () {
    poster.hide();
  });

  // const loginPromise = isLogin(true).then(res => {
  //   firstResponse = res;
  // });
  // Promise.all([loginPromise]).then(res => {
  //   API.getQRCode().then(res => {
  //     console.log(res);
  //   });

  //   API.queryUserStatus({
  //     passid: firstResponse.data.userInfo.passid
  //   }).then(res => {
  //     // 获取客户端信息
  //   });
  // });

  // function isLogin(isFirstRequest) {
  //   return API.login({
  //     redirectUrl: location.href,
  //     token
  //   }, { isFirstRequest });
  // }
});