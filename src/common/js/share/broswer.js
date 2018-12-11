import $ from 'jquery';
import utils from '../utils';
import imgWeixin from '../../images/share_pengyouquan.png';
import imgWxFriendCircle from '../../images/share_weixin.png';
import imgQQZone from '../../images/share_kongjian.png';
import imgQQ from '../../images/share_qq.png';
import imgWeibo from '../../images/share_weibo.png';

/**
 * @author carroll
 * @since 20180816
 * @description 浏览器分享
 * @event 支持动态传参
 * @example
 *  let share = shareBroswer({
      shareTitle,
      curUrl,
      sharePic,
      shareDesc
    });
    share.show();
    share.update({
      ...
    });
*/
export default function ShareBroswer(config = {}) {
  shareBroswerHtml();

  const shareApp = $('.shareApp');
  const shareCancle = $('.shareCancle');
  const {
    shareTitle,
    curUrl,
    sharePic,
    shareDesc
  } = config;

  shareCancle.click(function () {
    shareApp.hide();
  });

  this.show = function () {
    shareApp.show();
  };
  this.hide = function () {
    shareApp.hide();
  };
  this.update = function (newConfig) {
    this.shareTitle = newConfig.shareTitle;
    this.shareDesc = newConfig.shareDesc;
    this.curUrl = newConfig.curUrl;
    this.sharePic = newConfig.sharePic;
  };

  // 朦层下取消点穿事件
  shareApp.on('touchmove', function (e) {
    e.preventDefault();
  });

  window._bd_share_config = {
    //此处添加分享具体设置
    common: {
      bdText: shareTitle,
      bdDesc: shareDesc,
      bdUrl: curUrl,
      bdPic: sharePic,
      bdComment: shareDesc,
      // 更新配置
      onBeforeClick: (cmd, _config) => {
        _config.bdText = this.shareTitle;
        _config.bdDesc = this.shareDesc;
        _config.bdComment = this.shareDesc;
        _config.bdUrl = this.curUrl;
        _config.bdPic = this.sharePic;
        return _config;
      }
    },
    // 这里只是随便引用了一个css，防止百度样式覆盖
    share: [{
      bdCustomStyle: 'https://s.migu.cn/stN/html/szf/css/index.css?20171106'
    }],
  }

  //以下为js加载部分
  // utils.loadScript('http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5));
  // utils.loadScript('https://www.landiannews.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5));
  utils.loadScript('./static/api/js/share.js');
  // utils.loadScript('/static/static-test/api/js/share.js?v=89860593.js?');
}

function shareBroswerHtml() {
  const html = `
  <div class="shareApp">
    <div class="shareBox" data-tag="share_1">
      <div class="share-title">
        分享至
      </div>
      <div class="share-list bdsharebuttonbox">
        <div class="friends-circle">
          <img class="bds_weixin"  data-cmd="weixin" src="${imgWeixin}" alt="">
          <a class="bds_weixin" data-cmd="weixin">朋友圈</a>
        </div>
        <div class="friends">
          <img class="bds_weixin" data-cmd="weixin" src="${imgWxFriendCircle}" alt="">
          <a class="bds_weixin" data-cmd="weixin">微信</a>
        </div>
        <div class="qq-zone">
          <img class="bds_qzone" data-cmd="qzone" src="${imgQQZone}" alt="">
          <a class="bds_qzone" data-cmd="qzone">QQ空间</a>
        </div>
        <div class="qq">
          <img class="bds_sqq" data-cmd="sqq" src="${imgQQ}" alt="">
          <a class="bds_sqq" data-cmd="sqq">QQ</a>
        </div>
        <div class="weibo">
          <img class="bds_tsina" data-cmd="tsina" src="${imgWeibo}" alt="">
          <a class="bds_tsina" data-cmd="tsina">微博</a>
        </div>
      </div>
      <div class="shareCancle">取消</div>
    </div>
  </div>
  `;
  $('body').append(html);
}