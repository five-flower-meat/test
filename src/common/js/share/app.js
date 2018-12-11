// 咪咕阅读：B+C，1
// 咪咕影院：C能力，2
// 咪咕游戏：C能力，3
// 咪咕动漫：C能力，4
// 咪咕音乐：B+C，5
// 咪咕视频：C能力，6
// 咪咕善跑：C能力，修改为B+C，7
// 咪咕直播：B+C，8
// 灵犀：B+C，9
// 展厅： 10
// 咪咕+： 11

// 20181114，目前只有音乐、阅读、影院进行过联调

import $ from 'jquery';
import utils from '../utils.js';
import imgWeixin from '../../images/share_pengyouquan.png';
import imgWxFriendCircle from '../../images/share_weixin.png';
import imgQQZone from '../../images/share_kongjian.png';
import imgQQ from '../../images/share_qq.png';
import imgWeibo from '../../images/share_weibo.png';

/**
 * @author carroll
 * @since 20180815
 * @description app分享功能
 * @example
 *  let share = shareAPP({
      shareTitle,
      shareDesc,
      curUrl,
      sharePic,
      appId, // app的id
      appTypeFromUrl, // app的机型
    });
    share.update({
      ...
    });
    share.callback();
*/
export default function ShareAPP(config = {}) {
  shareAPPHtml();

  const shareApp = $('.shareApp');
  const shareCancle = $('.shareCancle');
  const friendsCircle = $('.friends-circle');
  const friends = $('.friends');
  const qqZone = $('.qq-zone');
  const qq = $('.qq');
  const weibo = $('.weibo');
  const appType = utils.appType();

  this.shareTitle = config.shareTitle;
  this.curUrl = config.curUrl;
  this.sharePic = config.sharePic;
  this.shareDesc = config.shareDesc;
  this.appId = Number(config.appId);
  this.appTypeFromUrl = config.appTypeFromUrl;

  this.update = (newConfig) => {
    this.shareTitle = newConfig.shareTitle || this.shareTitle;
    this.curUrl = newConfig.curUrl || this.curUrl;
    this.sharePic = newConfig.sharePic || this.sharePic;;
    this.shareDesc = newConfig.shareDesc || this.shareDesc;;
    this.appId = Number(newConfig.appId) || this.appId;
    this.appTypeFromUrl = newConfig.appTypeFromUrl || this.appTypeFromUrl;
  }

  shareCancle.click(function () {
    shareApp.hide();
  });


  // 朦层下取消点穿事件
  shareApp.on('touchmove', function (e) {
    e.preventDefault();
  });
  if (!this.appId) return false;

  switch (this.appId) {
    // 20180815，咪咕阅读提供了新的API，http://www.xyji.top/?s=/r/AkJdPoTzIAbXqiyDGYzqcTYKlaxjjBUCtiFlgNWwcIlLMQBrHe:preview
    case 1:
      utils.loadScript('https://cdn.bootcss.com/jquery/3.1.0/jquery.min.js');
      utils.loadScript('http://wap.cmread.com/rbc/p/content/repository/ues/js/s109/jsBridge.js??time=20180815');
      if (this.appTypeFromUrl === 'ios' || utils.appType() === 2) {
        this.show = () => {
          cmrsdk.share({ 'shareOptions': 127, 'type': 1, 'detailType': '1', 'contentType': '10', 'title': this.shareTitle, 'description': this.shareDesc, 'bigLogo': this.sharePic, 'URL': this.curUrl, 'imgUrl': this.sharePic, 'successAction': '' });
        }
      } else {
        this.show = () => {
          shareApp.show();
          friendsCircle.click(() => {
            cmrsdk.shareEx({ 'shareType': '4', detailType: '2', 'contentType': '10', 'title': this.shareTitle, 'description': this.shareDesc, 'bigLogo': this.sharePic, 'URL': this.curUrl, 'type': 1, 'imgUrl': this.sharePic });
          });
          friends.click(() => {
            cmrsdk.shareEx({ 'shareType': '4', detailType: '1', 'contentType': '10', 'title': this.shareTitle, 'description': this.shareDesc, 'bigLogo': this.sharePic, 'URL': this.curUrl, 'type': 1, 'imgUrl': this.sharePic });
          });
          qqZone.click(() => {
            cmrsdk.shareEx({ 'shareType': '6', detailType: '10', 'contentType': '10', 'title': this.shareTitle, 'description': this.shareDesc, 'bigLogo': this.sharePic, 'URL': this.curUrl, 'type': 1, 'imgUrl': this.sharePic });
          });
          qq.click(() => {
            cmrsdk.shareEx({ 'shareType': '5', detailType: '10', 'contentType': '10', 'title': this.shareTitle, 'description': this.shareDesc, 'bigLogo': this.sharePic, 'URL': this.curUrl, 'type': 1, 'imgUrl': this.sharePic });
          });
          weibo.click(() => {
            cmrsdk.shareEx({ 'shareType': '3', detailType: '10', 'contentType': '10', 'title': this.shareTitle, 'description': this.shareDesc, 'bigLogo': this.sharePic, 'URL': this.curUrl, 'type': 1, 'imgUrl': this.sharePic });
          });
        }
      };
      break;
    case 2:
      this.show = () => {
        let data = [{
          shareName: this.shareTitle,
          shareDesc: this.shareDesc,
          shareImg: this.sharePic,
          shareUrl: this.curUrl,
          type: 'share'
        }];
        try {
          myObj.wrpJsClick(JSON.stringify(data));
        } catch (e) {
          console.log(e);
        }
      };
      break;
    case 4:
      utils.loadScript('//ss.migudm.cn/biz/js-bridge/1.0.0/js-bridge.min.js');
      this.show = () => {
        migudmBridge.on('share', function (data, response) {
          response.success({
            title: this.shareTitle,
            desc: this.shareDesc,
            link: this.curUrl,
            imgUrl: this.sharePic
          });
        });
        migudmBridge.fire('showShareView');
      };
      break;
    case 5:
      /* 20180817版本更新 */
      /* 咪咕音乐安卓分享可以异步加载sdk，但是ios需要在页面加载的时候，就建立桥接，所以分享的sdk必须写在html里 */
      // utils.loadScript('http://h5.nf.migu.cn/app/v3/static/js/mgsdk/1.2.1/mgsdk-min.js');
      this.show = () => {
        migu.bridge.call('action.openShare', {
          title: this.shareTitle,
          subTitle: this.shareDesc,
          url: this.curUrl,
          imgSrc: this.sharePic, // 分享图片
        });
        // migu.mobile.app.bridge.view.openShare({
        //   type: 5, // 专题活动类型5
        //   title: this.shareTitle, // 分享标题
        //   subTitle: this.shareDesc, // 描述(可空)
        //   id: 0, // 保持为0
        //   imgUrl: this.sharePic, // 分享图片
        //   img: this.sharePic, // 分享同上一样,兼容老版用户
        //   h5URL: this.curUrl, // 分享的地址
        //   url: this.curUrl // 分享的地址(兼容老板客户端)
        // });
      };
      break;
    case 6:
      utils.loadScript('https://cdn.bootcss.com/jquery/3.1.0/jquery.min.js');
      utils.loadScript('http://m.miguvideo.com/wap/resource/migu/miguH5/js/plugins/webViewCommon_share.js', () => {
        window.mnWebMain.init(function (bridge) {
          $.pageRenderingEnd();
        });
        this.show = () => {
          $.shareInfomation(this.shareTitle,
            this.shareDesc,
            this.sharePic,
            this.curUrl);
        };
      });
      break;
    case 7:
      utils.loadScript('http://s.migu.cn/stN/html/config/webviewBridge.js');
      this.show = () => {
        setDefaultShareConfig({
          icon: this.sharePic,
          title: this.shareTitle,
          content: this.shareDesc,
          url: this.curUrl
        });
        doShare(0);
      }
      break;
    case 8:
      utils.loadScript('http://tv.miguvideo.com/mg/user/js/mgclient.js?time=20180815');
      this.show = () => {
        shareContentEx(this.curUrl, this.shareTitle, this.shareDesc, this.sharePic);
      };
      break;
    case 9:
      utils.loadScript('http://xz.voicecloud.cn/resources/jssdk/ilingxi-1.0.0.js');
      this.show = () => {
        shareApp.show();
        friendsCircle.on('click', () => {
          lx.shareWX({
            title: this.shareTitle, // 分享标题
            desc: this.shareDesc, // 分享描述
            link: this.curUrl,
            imgUrl: this.sharePic, // 分享图片
            type: '1', // 分享类型:1 朋友圈 2 好友
            isShowSheet: '0'
          });
        });
        friends.on('click', () => {
          lx.shareWX({
            title: this.shareTitle, // 分享标题
            desc: this.shareDesc, // 分享描述
            link: this.curUrl,
            imgUrl: this.sharePic, // 分享图片
            type: '2', // 分享类型:1 朋友圈 2 好友
            isShowSheet: '0'
          });
        });
      };
      break;
    case 10:
      break;
    default:
      break;
  }
};

function shareAPPHtml() {
  const html = `
  <div class="shareApp">
    <div class="shareBox">
      <div class="share-title">
        分享至
      </div>
      <div class="share-list">
        <div class="friends-circle">
          <img src="${imgWeixin}" alt="">
          <p>朋友圈</p>
        </div>
        <div class="friends">
          <img src="${imgWxFriendCircle}" alt="">
          <p>微信</p>
        </div>
        <div class="qq-zone">
          <img src="${imgQQZone}" alt="">
          <p>QQ空间</p>
        </div>
        <div class="qq">
          <img src="${imgQQ}" alt="">
          <p>QQ</p>
        </div>
        <div class="weibo">
          <img src="${imgWeibo}" alt="">
          <p>微博</p>
        </div>
      </div>
      <div class="shareCancle">取消</div>
    </div>
  </div>
  `;
  $('body').append(html);
}