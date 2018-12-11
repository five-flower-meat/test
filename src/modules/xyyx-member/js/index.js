import $ from 'jquery';
import utils from '../../../common/js/utils';
import { MEMBER_TYPE } from './constant.js';
import day7 from '../images/7.png';
import day30 from '../images/30.png';
import member1 from '../images/member1.png';
import member2 from '../images/member2.png';
import member3 from '../images/member3.png';
import member4 from '../images/member4.png';
import winning from '../images/winning.png';
import shareImg from '../images/give/share.png'; // 必须引入，加入到打包文件中
import CaptchaInstance from '../../../common/js/captcha.js';
import share from '../../../common/js/share';
import offline from '../../../common/js/offline';

$(function () {
  // 微信分享
  const shareWX = new share.ShareWX({
    title: '咪咕千万会员好礼免费送',
    description: '千万会员免费送，热剧劲歌好书等你pick',
    picture: 'http://s.migu.cn/stN/xyyx-member/static/share.png'
  });
  shareWX.fetch();

  const province = utils.GetQueryString('province');
  const getImmediate = $('#getImmediate');
  const getImmediateStatus = getImmediate.children('.get');
  const benefitsClose = $('#benefitsClose');
  const benefits = $('.benefits');
  const benefitsList = $('.benefits-list');
  const toast = $('.xyyx-toast');
  const toastErrorTitle = $('.xyyx-toast__title');
  const toastSuccessTitle = $('.xyyx-toast__title2');
  const toastDesc = $('.xyyx-toast__desc');
  const toastButton = $('.xyyx-toast__button');
  const returnBack = $('.memb-return');
  let phone = $('#phone');
  let accessRights = $('#accessRights');
  let getImmediateTime = null;
  let isStillGetPrizeTime = null;
  let stillRequestCounter = 100; // 最多请求轮询请求200次。
  let stillRequestInterval = 3000; // 每隔多少毫秒请求一次。

  offline('xyyx-member');

  benefits.on('touchmove', function (e) { e.preventDefault(); });
  toast.on('touchmove', function (e) { e.preventDefault(); });

  accessRights.click(function () {
    location.href = './give.html';
  });

  benefitsClose.click(function () {
    benefits.hide();
    new CaptchaInstance().hide();
    isStillGetPrizeTime = null;
  });

  returnBack.click(function () {
    history.back(-1);
  });

  phone.on('input propertychange', function () {
    if ($(this).val() && $(this).val().length === 11) {
      getImmediateStatus.removeClass('disabled');
    } else {
      getImmediateStatus.addClass('disabled');
    }
  });

  getImmediate.click(function () {
    const phoneValue = phone.val();
    const isPhone = utils.checkPhone(phoneValue);
    if (!isPhone) {
      Dialog({
        type: 'error',
        desc: '请输入正确的11位手机号码'
      });
      return false;
    }
    if (getImmediateTime) {
      utils.Toast('请不要连续提交');
      return false;
    }
    getImmediateTime = setTimeout(() => {
      getImmediateTime = null;
    }, 3000);

    let captcha = new CaptchaInstance({
      phone: phoneValue,
      title: '请输入短信验证码'
    });
    captcha.get(function () {
      getCaptchaAPI({ phone: phoneValue }).then(function () {
        captcha.show();
      });
    });
    captcha.then(function (value) {
      let count = 0;
      console.log('output value', value);
      let params = {
        phone: phoneValue,
        validateCode: value
      };
      checkCaptcha(params).then(() => {
        // 关闭软键盘
        document.activeElement.blur();

        getPrizeAPI();

        isStillGetPrizeTime = setInterval(function () {
          const isShow = benefits.css('display') === 'block';
          if (count === stillRequestCounter) {
            clearInterval(isStillGetPrizeTime);
            return false;
          }
          if (isShow) {
            count++;
            getPrizeAPI({ isNotLoading: true });
          }
        }, stillRequestInterval);
      });
    });
  });

  function getCaptchaAPI(params) {
    return API('/migu/campusChild/sendValidCode.action', params);
  }

  function checkCaptcha(params) {
    return API('/migu/campusChild/checkValidCode.action', params);
  }

  function getPrizeAPI(config) {
    const phoneValue = phone.val();
    const params = {
      phone: phoneValue,
      provinceId: province
    };
    API('/migu/campusChild/queryCampusChild.action', params, config)
      .then(function (res) {
        let html = '';
        let rechargeCount = 0;
        res.records.forEach(function (val) {
          rechargeCount = val.chargeState === '2' || val.chargeState === '3' ? rechargeCount + 1 : rechargeCount;
          html += benefitsHtml(val);
        });
        // 全部成功或者失败后，取消轮询请求
        if (rechargeCount === res.records.length) {
          clearInterval(isStillGetPrizeTime);
          benefits.show();
          benefitsList.html(html);

          // if (benefits.css('display') !== 'block') {
          //   Dialog({
          //     type: 'success',
          //     desc: '您已是咪咕所有产品的会员'
          //   });
          // } else {
          //   benefits.show();
          //   benefitsList.html(html);
          // }
        } else {
          benefits.show();
          benefitsList.html(html);
        }
      });
  }

  function memberSelected(val) {
    let _val = Math.ceil(val / 2);
    switch (_val) {
      case 1:
        return member1;
      case 2:
        return member2;
      case 3:
        return member3;
      case 4:
        return member4;
      default:
        return '';
    }
  }

  function benefitsHtml(item) {
    const calcDay = value => {
      return (Number(value) % 2) === 0 ? 30 : 7;
    };
    return `<div class="benefits-item">
      <div class="benefits-item__slogon">
        <img src="${calcDay(item.memberType) === 30 ? day30 : day7}" alt="">
      </div>
      <div class="benefits-item__logo">
        <img src="${memberSelected(item.memberType)}" alt="">
        <div class="benefits-winning ${item.chargeState === '2' ? 'display' : ''}"><img src="${winning}" alt="" /></div>
        <div class="todoing ${item.chargeState === '1' ? 'disabled' : ''}">抽奖中</div>
        <div class="failed ${item.chargeState === '3' ? 'disabled' : ''}">就差一点</div>
      </div>
      <div class="benefits-item__name">${MEMBER_TYPE[item.memberType].memberType}</div>
    </div>`;
  }

  function API(url, data, config = {}) {
    !config.isNotLoading && utils.Loading({ show: true });
    return new Promise(function (resolve, reject) {
      $.ajax({
        method: 'POST',
        // url: 'http://localhost:9618' + url,
        url: url,
        data: data,
        dataType: 'JSON',
        success: function (res) {
          !config.isNotLoading && utils.Loading({ show: false });
          if (res.return_code.toString() === '-1') {
            Dialog({
              type: 'error',
              desc: res.return_msg
            });
          } else {
            resolve(res.data);
          }
        },
        error: function (err) {
          !config.isNotLoading && utils.Loading({ show: false });
          let _err = utils.errorHandle(err);
          utils.Toast(_err);
          // reject(err);
          clearInterval(isStillGetPrizeTime);
        }
      });
    });
  }

  /**
   * @param {Object} option = { desc, isShowTitle }
   */
  function Dialog(option) {
    toast.show();
    toastDesc.html(option.desc);
    if (option.type === 'error') {
      toastErrorTitle.show();
    } else if (option.type === 'success') {
      toastSuccessTitle.show();
    }
    toastButton.click(function () {
      toast.hide();
    });
  }
});