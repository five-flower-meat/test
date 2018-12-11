import $ from 'jquery';
import utils from '../../../common/js/utils';
import html2canvas from 'html2canvas';
import {
  convertImgToBase64,
  commonShareWX
} from './common';
import offline from '../../../common/js/offline';

$(function () {
  var resultStarName = utils.GetQueryString('resultStarName');
  var statistics = utils.GetQueryString('statistics');
  const qrCode = $('.qr-code-share');
  /* const longTap = $('.long-tap'); */
  const saveImg = $('#src');
  const unsaveHtml = document.querySelector('#idot-container'); // 兼容html2canvas，必须使用原生获取元素

  (function () {
    offline('mg-idot-update');
    commonShareWX(); // 微信分享
    handleResuleName();

    handle2Img();
  })();

  function handle2Img() {
    let url = window.location.href;
    let origin = url.substr(0, url.indexOf('/result.html'));
    url = `${origin}/index.html`;

    let imgUrl = `${window.location.origin}/migu/answerGame/getQRCode.action?width=129&height=129&url=${url}`;
    convertImgToBase64(imgUrl, function (base64) {
      qrCode[0].src = base64;

      qrCode[0].onload = function () {
        validateImages();
      };
    });
  }

  function validateImages() {
    let time = setInterval(function () {
      if (qrCode[0].complete) {
        clearInterval(time);
        bodyToImg();
      }
    }, 300);

    setTimeout(function () {
      clearInterval(time);
    }, 30 * 1000);
  }

  function bodyToImg() {
    // 转换成图片
    html2canvas(unsaveHtml).then(canvas => {
      const dataURL = canvas.toDataURL('image/jpeg');
      saveImg.attr('src', dataURL);
      saveImg.css('display', 'block');
      unsaveHtml.style.display = 'none';
    });
  }

  function handleResuleName() {
    if (resultStarName) {
      $('.idot-result').css('display', 'block');
      $('.result-foot-share').css('display', 'block');

      // 兼容html2canvas背景文字问题
      let words = $(`.${resultStarName}`).find('.result-description span').html();
      if (words && words.length) {
        words = words.split('');
        let str = '';
        words.forEach(val => {
          str += `<span class="result-desc-bg">${val}</span>`;
        });
        $(`.${resultStarName}`).find('.result-description').html(str);
      }
    }
    switch (resultStarName) {
      case 'zhoujielun':
        $('#idot-result').addClass('zhoujielun-bg');
        $('.zhoujielun').css('display', 'block');
        $('.representative-music__word').text('青花瓷');
        break;
      case 'caiyilin':
        $('#idot-result').addClass('caiyilin-bg');
        $('.caiyilin').css('display', 'block');
        $('.representative-music__word').text('舞娘');
        break;
      case 'dengziqi':
        $('#idot-result').addClass('dengziqi-bg');
        $('.dengziqi').css('display', 'block');
        $('.representative-music__word').text('光年之外');
        break;
      case 'NinePercent':
        $('#idot-result').addClass('NinePercent-bg');
        $('.NinePercent').css('display', 'block');
        $('.representative-music__word').text('Wait Wait Wait');
        break;
      case 'jiajia':
        $('#idot-result').addClass('jiajia-bg');
        $('.jiajia').css('display', 'block');
        $('.representative-music__word').text('命运');
        break;
      case 'lijianqing':
        $('#idot-result').addClass('lijianqing-bg');
        $('.lijianqing').css('display', 'block');

        $('.representative-music__word').text('匆匆');
        break;
      case 'wuqi':
        $('#idot-result').addClass('wuqi-bg');
        $('.wuqi').css('display', 'block');
        $('.representative-music__word').text('盲童');
        break;
      case 'wuyuetian':
        $('#idot-result').addClass('wuyuetian-bg');
        $('.wuyuetian').css('display', 'block');
        $('.representative-music__word').text('温柔');
        break;
      case 'xiaobingzhi':
        $('#idot-result').addClass('xiaobingzhi-bg');
        $('.xiaobingzhi').css('display', 'block');
        $('.representative-music__word').text('凡人');
        break;
      case 'xvjiaying':
        $('#idot-result').addClass('xvjiaying-bg');
        $('.xvjiaying').css('display', 'block');
        $('.representative-music__word').text('一爱难求');
        break;
      case 'xuezhiqian':
        $('#idot-result').addClass('xuezhiqian-bg');
        $('.xuezhiqian').css('display', 'block');
        $('.representative-music__word').text('演员');
        break;
      case 'yuanyawei':
        $('#idot-result').addClass('yuanyawei-bg');
        $('.yuanyawei').css('display', 'block');
        $('.representative-music__word').text('不同凡想');
        break;
      case 'zhuxindong':
        $('#idot-result').addClass('zhuxindong-bg');
        $('.zhuxindong').css('display', 'block');
        $('.representative-music__word').text('孤独感');
        break;
      case 'shananjie':
        $('#idot-result').addClass('shananjie-bg');
        $('.shananjie').css('display', 'block');
        $('.representative-music__word').text('Rhythm Boy');
        break;
      case 'mowengwei':
        $('#idot-result').addClass('mowengwei-bg');
        $('.mowengwei').css('display', 'block');
        $('.representative-music__word').text('他不爱我');
        break;
      default:
        break;
    };
    $('.statisticsCopy').text(statistics + '%');
  }
});