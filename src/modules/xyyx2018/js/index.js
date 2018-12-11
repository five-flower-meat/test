import $ from 'jquery';
import { Dialog } from './common.js';
import share from '../../../common/js/share';
import utils from '../../../common/js/utils.js';
import API from './apis.js';
import { MIGU_ID, MIGU_ID_TO_NAME, DOWNLOAD_LINK } from './constant.js';

$(function () {
  if (!location.href.includes('index.html')) return false;

  const unlogin = $('#unlogin');
  const unbind = $('#unbind');
  const unupgrade = $('#unupgrade');
  const switchAccount = $('#switch');
  const getImmediate = $('#getImmediate');
  const back = $('#back');
  const collpase = $('#collpase');
  const inviteConatiner = $('.invite-list-container');
  const receiveContainter = $('.receive-list-container');
  const receiveDetail = $('.receive-detail');
  const inviteToReceiveMoney = $('#inviteToReceiveMoney');

  back.click(function () {
    history.back(-1);
  });

  const appId = parseInt(utils.GetQueryString('miguid'));
  const appName = appId ? MIGU_ID_TO_NAME[MIGU_ID[appId]] : '';
  const token = utils.GetQueryString('token');
  let firstResponse = {};
  let loginUrl = '';
  let inviteLists = '';

  const getLoginUrlPromise = API.getLoginUrl({
    redirectUrl: location.href
  }).then(res => {
    loginUrl = res.data.loginUrl;
  });

  // 第一次请求登录信息
  const loginPromise = isLogin(true).then(res => {
    const tipSwitch = $('.tip-switch');
    const tipUnlogin = $('.tip-unlogin');
    const tipUnupgrade = $('.tip-unupgrade');
    const tipUnbind = $('.tip-unbind');
    firstResponse = res;
    if (res.code === '401') {
      tipUnlogin.show();
      unlogin.click(function () {
        location.href = res.data.returnUrl;
      });
    } else {
      // 已登录情况
      // 存在手机号码并且不是移动
      if (res.code === '202') {
        tipSwitch.show();
        switchAccount.click(function () {
          location.href = loginUrl;
        });
      } else {
        // 咪咕善跑提示查看绑定方式，其它客户端升级客户端
        if (appId) {
          if (appId === 7) {
            tipUnbind.children('span').html(res.data.userInfo.nickname || '');
            tipUnbind.show();
            unbind.click(function () {
              Dialog({
                desc: '请登录咪咕善跑“我>设置>绑定 个人信息”完成移动手机号码绑定'
              });
            });
          } else {
            tipUnupgrade.children('span').html(res.data.userInfo.nickname || '');
            tipUnupgrade.show();
            unupgrade.html(appName);
            unupgrade.click(function () {
              location.href = DOWNLOAD_LINK[MIGU_ID[appId]];
            });
          }
        }
      }
    }
    return res;
  });

  Promise.all([getLoginUrlPromise, loginPromise]).then(res => {
    API.queryInvitingDetails({
      passid: firstResponse.data.userInfo.passid
    }).then(res => {
      inviteLists = res.data.invitingList;
      inviteDetailLengthCheck(inviteLists, true);
    });

    API.queryReceiveDetails({
      passid: firstResponse.data.userInfo.passid
    }).then(res => {
      const { invitingList } = res.data;
      if (!invitingList.length) {
        receiveDetail.hide();
      } else {
        receiveDetailHtml(invitingList);
      }
      // 充满达到5次
      if (invitingList.length >= 5) {
        inviteToReceiveMoney.addClass('disabled');
        inviteToReceiveMoney.html('您已领取上限50元话费，感谢支持');
      }
    });
  });

  share.ShareAPP({
    shareButton: getImmediate,
    appId,
  });

  inviteToReceiveMoney.click(function () {
    Dialog({
      isNeedConfirm: true,
      desc: `您即将为号码${firstResponse.data.userInfo.msisdn}充值10元`,
      confirmHtml: '确认充值',
      confirmCallback: function () {
        API.exchangeFee({
          clientType: appId,
          passid: firstResponse.data.userInfo.passid
        }).then(res => {
          Dialog({
            type: 'success',
            title: '充值成功',
            desc: `话费将于10月31日活动结束统一发放`,
          });
        });
      }
    });
  });

  getImmediate.click(function (e) {
    let isCheck = checkUserStatus(firstResponse);
    if (isCheck) {
      // location.href = './invite.html';
    } else {

    }
  });

  collpase.click(function () {
    if (!collpase.children('.collpase-main-img').hasClass('up')) {
      collpase.children('.cont').html('收起来');
      collpase.children('.collpase-main-img').addClass('up');
      inviteDetailLengthCheck(inviteLists);
    } else {
      collpase.children('.cont').html('展开全部');
      collpase.children('.collpase-main-img').removeClass('up');
      inviteDetailLengthCheck(inviteLists.slice(0, 3));
    }
  });

  function inviteDetailLengthCheck(invitingList, firstLock) {
    const noCont = $('.invite-detail-no-cont');
    const hasCont = $('.invite-detail-has-cont');
    if (invitingList.length) {
      hasCont.show();
      noCont.hide();
      if (invitingList.length <= 3 && firstLock) {
        collpase.hide();
      } else {
        if (firstLock) {
          invitingList = invitingList.slice(0, 3);
        }
        collpase.show();
      }
    } else {
      hasCont.hide();
      noCont.show();
    }
    inviteDetailHtml(invitingList);
  }

  function inviteDetailHtml(list) {
    let html = '';
    list.forEach(val => {
      html += `
      <ul class="invite-list-main">
        <li class="invite-list-item">${val.userName}</li>
        <li class="invite-list-item">${val.clientType}</li>
        <li class="invite-list-item">${val.loginTime}</li>
      </ul>
    `;
    });
    inviteConatiner.html(html);
  }

  function receiveDetailHtml(list) {
    let html = '';
    list.forEach(val => {
      html += `
      <ul class="receive-list-main">
        <li class="receive-list-item">${val.money}</li>
        <li class="receive-list-item">${val.loginTime}</li>
      </ul>
    `;
    });
    receiveContainter.html(html);
  }

  function isLogin(isFirstRequest) {
    return API.login({
      redirectUrl: location.href,
      token
    }, { isFirstRequest });
  }

  function checkUserStatus(res) {
    if (res.code === '201') {
      if (appId) {
        if (appId === 7) {
          Dialog({
            desc: '请登录咪咕善跑“我>设置>绑定 个人信息”完成移动手机号码绑定',
            cancelHtml: 'xxxx'
          });
        } else {
          Dialog({
            isNeedConfirm: true,
            desc: `抱歉，本活动仅支持移动手机号码，请升级${appName}后完成手机绑定`,
            confirmHtml: `升级${appName}`,
            confirmCallback: function () {
              location.href = DOWNLOAD_LINK[MIGU_ID[appId]];
            }
          });
        }
      }
    } else if (res.code === '202') {
      Dialog({
        isNeedConfirm: true,
        desc: `抱歉，本活动仅支持移动手机号码`,
        confirmHtml: '切换账号',
        confirmCallback: function () {
          location.href = loginUrl;
        }
      });
    } else {
      return true;
    }
  }
});