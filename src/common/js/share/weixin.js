import $ from 'jquery';
import utils from '../utils.js';

/**
 * @author carroll
 * @since 20180719
 * @description 微信分享功能
 * @param {Object} config
 * @param {Function} successFunc
 * @example
 * shareWX({
    title: '',
    description: '',
    picture: ''
  }, successFunc)
*/
export default function ShareWX(config = {}, successFunc) {
  // 添加微信遮罩
  $('body').append('<div class="weixin-shadow"></div>');

  const weixinShadow = $('.weixin-shadow');
  const isWeixin = utils.isWechat();
  const ajaxUrl = '/migu/wxShare/wxJsSig.action';
  const shareTitle = config.title;
  const shareDesc = config.description;
  const sharePic = config.picture;

  weixinShadow.click(function () {
    weixinShadow.hide();
  });

  this.show = function () {
    weixinShadow.show();
  }

  this.fetch = getAPI;

  /* 20181123，首次自动调用微信服务 */
  this.fetch();
  
  function getAPI() {
    // 是否是微信
    if (isWeixin) {
      $.ajax({
        url: ajaxUrl,
        data: { url: window.location.href },
        dataType: 'json',
        success: function (msg) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: msg.data.appId, // 必填，公众号的唯一标识
            timestamp: msg.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: msg.data.nonceStr, // 必填，生成签名的随机串
            signature: msg.data.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
            wx.onMenuShareTimeline({
              title: shareTitle, // 分享标题
              desc: shareDesc, // 分享描述
              link: window.location.href, // 分享链接
              imgUrl: sharePic, // 分享图标
              success: function (res) {
                // 用户确认分享后执行的回调函数
                option.success(res);
              },
              cancel: function (res) {
                // 用户取消分享后执行的回调函数
                option.cancel(res);
              }
            });
            wx.onMenuShareAppMessage({
              title: shareTitle, // 分享标题
              desc: shareDesc, // 分享描述
              link: window.location.href, // 分享链接
              imgUrl: sharePic, // 分享图标
              success: function (res) {
                // 用户确认分享后执行的回调函数
                option.success(res);
              },
              cancel: function (res) {
                // 用户取消分享后执行的回调函数
                option.cancel(res);
              }
            });
            wx.onMenuShareQQ({
              title: shareTitle, // 分享标题
              desc: shareDesc, // 分享描述
              link: window.location.href, // 分享链接
              imgUrl: sharePic, // 分享图标
              success: function (res) {
                // 用户确认分享后执行的回调函数
                option.success(res);
              },
              cancel: function (res) {
                // 用户取消分享后执行的回调函数
                option.cancel(res);
              }
            });
            wx.onMenuShareWeibo({
              title: shareTitle, // 分享标题
              desc: shareDesc, // 分享描述
              link: window.location.href, // 分享链接
              imgUrl: sharePic, // 分享图标
              success: function (res) {
                // 用户确认分享后执行的回调函数
                option.success(res);
              },
              cancel: function (res) {
                // 用户取消分享后执行的回调函数
                option.cancel(res);
              }
            });
          });
        }
      });
    };
  }
};