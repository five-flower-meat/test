export default function autoMusic(selector) {
  autoPlayMusic(selector);
  audioAutoPlay(selector);
}

function audioAutoPlay(selector) {
  // var audio = document.querySelector('#bg-music');
  var audio = selector;
  audio.play();
  document.addEventListener('WeixinJSBridgeReady', function () {
    audio.play();
  }, false);
}
// 音乐播放
function autoPlayMusic(selector) {
  // 自动播放音乐效果，解决浏览器或者APP自动播放问题
  function musicInBrowserHandler() {
    musicPlay(selector, true);
    document.body.removeEventListener('touchstart', musicInBrowserHandler);
  }
  document.body.addEventListener('touchstart', musicInBrowserHandler);
  // 自动播放音乐效果，解决微信自动播放问题
  function musicInWeixinHandler() {
    musicPlay(selector, true);
    document.addEventListener('WeixinJSBridgeReady', function () {
      musicPlay(selector, true);
    }, false);
    document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
  }
  document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
}
function musicPlay(selector, isPlay) {
  var media = selector;
  if (isPlay && media.paused) {
    media.play();
  }
  if (!isPlay && !media.paused) {
    media.pause();
  }
}