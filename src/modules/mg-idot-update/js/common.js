import utils from '../../../common/js/utils';
import share from '../../../common/js/share';

// 实现将项目的图片转化成base64
export function convertImgToBase64(url, callback, outputFormat) {
  let canvas = document.createElement('CANVAS');
  let ctx = canvas.getContext('2d');
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
};

export function commonShareWX() {
  let title = '测测谁是你的灵魂爱豆';
  let description = '第12届咪咕汇音乐盛典即将盛大开启，一起为爱豆打call！';
  let picture = 'https://s.migu.cn/stN/mg-idot-update/static/mg-idot-update/share.jpg';

  if (utils.isWechat()) { // 微信分享
    const shareType = new share.ShareWX({
      title: title,
      description: description,
      picture: picture
    });
    console.log(shareType);
  }
}

export function qrCodeFunc(selector) {
  let url = window.location.href;
  let origin = url.substr(0, url.indexOf('/index.html'));
  url = `${origin}/index.html`;
  let imgUrl = `${window.location.origin}/migu/answerGame/getQRCode.action?width=129&height=129&url=${url}`;
  convertImgToBase64(imgUrl, function (base64) {
    selector[0].src = base64;

    selector[0].onload = function () {
      validateImages();
    };
  });

  function validateImages() {
    let time = setInterval(function () {
      if (selector[0].complete) {
        clearInterval(time);
      }
    }, 300);
    setTimeout(function () {
      clearInterval(time);
    }, 30 * 1000);
  }
}
// 明星音乐跳转
export const startMusicLink = [
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600902000006889090',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000006813635',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000006284646',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000009049119',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600907000008380799',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600907000002883465',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600913000000571655',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600907000000353804',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000007734029',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000008672123',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600907000005783770',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600910000008055456',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000006191204',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600908000008934273',
  'http://h5.nf.migu.cn/app/v3/p/share/song/index.html?id=600910000009562967',
];

export const startName = [
  'zhoujielun',
  'caiyilin',
  'dengziqi',
  'NinePercent',
  'jiajia',
  'lijianqing',
  'wuqi',
  'wuyuetian',
  'xiaobingzhi',
  'xvjiaying',
  'xuezhiqian',
  'yuanyawei',
  'zhuxindong',
  'shananjie',
  'mowengwei',
];