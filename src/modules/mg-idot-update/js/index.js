import $ from 'jquery';
import utils from '../../../common/js/utils';
// import source0 from '../images/music/SakaeinAction.mp3';
import source1 from '../images/music/zhoujielun.mp3';
import source2 from '../images/music/caiyilin.mp3';
import source3 from '../images/music/dengziqi.mp3';
import source4 from '../images/music/NinePercent.mp3';
import source5 from '../images/music/jiajia.mp3';
import source6 from '../images/music/lijianqing.mp3';
import source7 from '../images/music/wuqi.mp3';
import source8 from '../images/music/wuyuetian.mp3';
import source9 from '../images/music/xiaobingzhi.mp3';
import source10 from '../images/music/xvjiaying.mp3';
import source11 from '../images/music/xuezhiqian.mp3';
import source12 from '../images/music/yuanyawei.mp3';
import source13 from '../images/music/zhuxindong.mp3';
import source14 from '../images/music/shananjie.mp3';
import source15 from '../images/music/mowengwei.mp3';
import source16 from '../images/music/click.mp3';
import autoMusic from '../../../common/js/autoMusic';
import {
  commonShareWX,
  qrCodeFunc,
  startMusicLink,
  startName
} from './common';
import offline from '../../../common/js/offline';

$(function () {
  const isFromUpPage = utils.GetQueryString('resultStarName');
  const qrCode = $('.qr-code');
  const player = $('#click-player')[0];
  const sourceClick = $('source')[1];
  const playerone = $('#bgmusic-player')[0];
  // const source = $('source')[1];
  sourceClick.src = source16;
  // source.src = source0;

  offline('mg-idot-update');

  const QName = [
    '.question-one',
    '.question-two',
    '.question-three',
    '.question-four',
    '.question-five',
    '.question-six',
    '.question-seven',
  ];
  const barCell = [
    '.bar-cell-one',
    '.bar-cell-two',
    '.bar-cell-three',
    '.bar-cell-four',
    '.bar-cell-five',
    '.bar-cell-six',
    '.bar-cell-seven',
  ];

  (function () {
    if (isFromUpPage) {
      fromUpPage(isFromUpPage);
    } else {
      // playerone.load();
      autoMusic(playerone); // 音乐播放
    }

    clearSelected();

    commonShareWX(); // 微信分享

    qrCodeFunc(qrCode); // 获取二维码
  })();

  var answer = new Array(7); /** 保存各题答案，未作答题目的答案为0 */
  answer = [0, 0, 0, 0, 0, 0, 0];
  var resultStarName;
  var questionName; /** 获取当前问题题号 */
  var value; /** 每道题获取答案 */
  var index;
  var gotoNextBotton = $('div[class="goto-next-botton mg-idot-update-btn"]');
  var statistics = parseInt(Math.random() * (60 - 20 + 1) + 20);
  /** 点击下一题时切换题目，改写题号 */
  gotoNextBotton.each(function () {
    $(this).click(function () {
      questionName = $(this).parent().attr('class');
      value = $('input[name="' + questionName + '"]:checked').val();
      if (value === undefined) {
        utils.Toast('选择一个选项才能继续答题哦！');
      } else {
        if (questionName === QName[0].substring(1)) {
          turnToAnswerLine();
        }
        index = getIndexByName(questionName);
        answer[index] = parseInt(value);
        if (index < 6) {
          $(QName[index]).css('display', 'none');
          $(QName[index + 1]).css('display', 'block');
          $('.question-number-circle__word').text((index + 2));
          /** 实现答题页bar题号标识互斥高亮显示 */
          showQuestionMark(index);
        } else {
          // 跳转到结果页
          resultStarName = getResult();
          window.location.href = `./index.html?resultStarName=${resultStarName}`;
          // playerone.pause();
          // resultStarName = getResult();
          // gotoResult(resultStarName);
        }
      }
    });
  });

  // 注册离开事件，停止音乐播放
  window.onunload = function () {
    const playertwo = $('#result-player')[0];
    playerone.pause();
    playertwo.pause();
  };

  function fromUpPage(name) {
    $('.enter-test').css('display', 'none');
    $('.answer-question').css('display', 'block');
    playerone.pause();
    resultStarName = name;
    gotoResult(resultStarName);
  }

  /** 点击开始测试按钮进入答题界面 */
  $('.enter-test-button.mg-idot-update-btn').click(function () {
    if (playerone.paused) playerone.play();

    $('.enter-test').css('display', 'none');
    $('.answer-question').css('display', 'block');
  });

  /** 实现选项背景色互斥 */
  $('.option-cell').click(function () {
    $(this).css('background', '#D6BE7B').siblings().css('background', '#C8B98D');
    $(this).find('input[type="radio"]').prop('checked', true);
    player.load();
    player.play();
  });

  /** 随机生成统计数，以及按钮功能 */
  $('.statistics').text(statistics + '%');
  $('#share-friend').click(function () {
    clearSelected();
    location.href = './result.html?' + 'resultStarName=' + resultStarName + '&statistics=' + statistics;
  });
  $('#once-again').click(function () {
    clearSelected();
    location.href = './index.html';
  });
  $('#mghui-entrance').click(function () {
    clearSelected();
    location.href = 'http://h5.nf.migu.cn/app/v3/zt/2018/migu-awards/index.html?cfrom=000003&from=singlemessage';
  });
  /*  $('#extract-tickets').click(function () {
     clearSelected();
     location.href = 'https://s.migu.cn/stN/mgdayvideo2018/index.html?isTitle=0';
   }); */
  // 点击音乐跳转至对应的明星音乐
  $('.representative-music__img').click(function () {
    if (resultStarName !== undefined) {
      for (var i = 0; i < 15; i++) {
        if (resultStarName === startName[i]) {
          location.href = startMusicLink[i];
        }
      }
    }
  });

  /** 清除缓存选择结果 */
  function clearSelected() {
    for (var i = 0; i < 7; i++) {
      var questionNameTemp = QName[i].substring(1);
      $('input[name="' + questionNameTemp + '"]').prop('checked', false);
    }
  }

  /** 转到对应身份的答题线 */
  function turnToAnswerLine() {
    var value = $('input[name="question-one"]:checked').val();
    $('.answer-question-main').addClass('make-heighten');
    switch (value) {
      case '1':
        $('.star-answer-line').css('display', 'block');
        $('.answer-question').addClass('star-answer-line-bg');
        break;
      case '2':
        $('.fans-answer-line').css('display', 'block');
        $('.answer-question').addClass('fans-answer-line-bg');
        break;
      case '3':
        $('.broker-answer-line').css('display', 'block');
        $('.answer-question').addClass('broker-answer-line-bg');
        break;
      default:
        break;
    }
  };

  /** 实现答题页bar题号标识互斥高亮显示 */
  function showQuestionMark(index) {
    $(barCell[index]).removeClass('active-bar-cell');
    $(barCell[index]).find('.bar-number').removeClass('active-bar-number');
    $(barCell[index]).find('.bar-circle').removeClass('active-bar-circle');
    $(barCell[index + 1]).addClass('active-bar-cell');
    $(barCell[index + 1]).find('.bar-number').addClass('active-bar-number');
    $(barCell[index + 1]).find('.bar-circle').addClass('active-bar-circle');
  };

  function getIndexByName(questionName) {
    for (let i = 0; i < 7; i++) {
      if (questionName === QName[i].substring(1)) {
        return i;
      }
    }
  };

  function getResult() {
    var score = answer[1] + answer[2] + answer[4] + answer[5] + answer[6];
    switch (answer[3]) {
      case 1:
        if (score >= 15) {
          return 'dengziqi';
        } else if (score >= 8) {
          return 'xuezhiqian';
        } else {
          return 'zhuxindong';
        }
      case 2:
        if (score >= 15) {
          return 'mowengwei';
        } else if (score >= 8) {
          return 'xvjiaying';
        } else {
          return 'yuanyawei';
        }
      case 3:
        if (score >= 15) {
          return 'NinePercent';
        } else if (score >= 8) {
          return 'zhoujielun';
        } else {
          return 'jiajia';
        }
      case 4:
        if (score >= 15) {
          return 'wuyuetian';
        } else if (score >= 8) {
          return 'lijianqing';
        } else {
          return 'xiaobingzhi';
        }
      case 5:
        if (score >= 15) {
          return 'caiyilin';
        } else if (score >= 8) {
          return 'wuqi';
        } else {
          return 'shananjie';
        }
    }
  };

  function gotoResult(resultStarName) {
    $('.answer-question').css('display', 'none');
    $('.idot-container').css('display', 'block');
    if (resultStarName !== undefined) {
      const playertwo = $('#result-player')[0];
      const source = $('source')[2];
      switch (resultStarName) {
        case 'zhoujielun':
          $('#idot-result').addClass('zhoujielun-bg');
          $('.zhoujielun').css('display', 'block');
          source.src = source1;
          $('.representative-music__word').text('青花瓷');
          break;
        case 'caiyilin':
          $('#idot-result').addClass('caiyilin-bg');
          $('.caiyilin').css('display', 'block');
          source.src = source2;
          $('.representative-music__word').text('舞娘');
          break;
        case 'dengziqi':
          $('#idot-result').addClass('dengziqi-bg');
          $('.dengziqi').css('display', 'block');
          source.src = source3;
          $('.representative-music__word').text('光年之外');
          break;
        case 'NinePercent':
          $('#idot-result').addClass('NinePercent-bg');
          $('.NinePercent').css('display', 'block');
          source.src = source4;
          $('.representative-music__word').text('Wait Wait Wait');
          break;
        case 'jiajia':
          $('#idot-result').addClass('jiajia-bg');
          $('.jiajia').css('display', 'block');
          source.src = source5;
          $('.representative-music__word').text('命运');
          break;
        case 'lijianqing':
          $('#idot-result').addClass('lijianqing-bg');
          $('.lijianqing').css('display', 'block');
          source.src = source6;
          $('.representative-music__word').text('匆匆');
          break;
        case 'wuqi':
          $('#idot-result').addClass('wuqi-bg');
          $('.wuqi').css('display', 'block');
          source.src = source7;
          $('.representative-music__word').text('盲童');
          break;
        case 'wuyuetian':
          $('#idot-result').addClass('wuyuetian-bg');
          $('.wuyuetian').css('display', 'block');
          source.src = source8;
          $('.representative-music__word').text('温柔');
          break;
        case 'xiaobingzhi':
          $('#idot-result').addClass('xiaobingzhi-bg');
          $('.xiaobingzhi').css('display', 'block');
          source.src = source9;
          $('.representative-music__word').text('凡人');
          break;
        case 'xvjiaying':
          $('#idot-result').addClass('xvjiaying-bg');
          $('.xvjiaying').css('display', 'block');
          source.src = source10;
          $('.representative-music__word').text('一爱难求');
          break;
        case 'xuezhiqian':
          $('#idot-result').addClass('xuezhiqian-bg');
          $('.xuezhiqian').css('display', 'block');
          source.src = source11;
          $('.representative-music__word').text('演员');
          break;
        case 'yuanyawei':
          $('#idot-result').addClass('yuanyawei-bg');
          $('.yuanyawei').css('display', 'block');
          source.src = source12;
          $('.representative-music__word').text('不同凡想');
          break;
        case 'zhuxindong':
          $('#idot-result').addClass('zhuxindong-bg');
          $('.zhuxindong').css('display', 'block');
          source.src = source13;
          $('.representative-music__word').text('孤独感');
          break;
        case 'shananjie':
          $('#idot-result').addClass('shananjie-bg');
          $('.shananjie').css('display', 'block');
          source.src = source14;
          $('.representative-music__word').text('Rhythm Boy');
          break;
        case 'mowengwei':
          $('#idot-result').addClass('mowengwei-bg');
          $('.mowengwei').css('display', 'block');
          source.src = source15;
          $('.representative-music__word').text('他不爱我');
          break;
        default:
          break;
      };

      playertwo.load();
      if (!isFromUpPage) {
        playertwo.play();
      } else {
        autoMusic(playertwo);
      }
    };
  };
});