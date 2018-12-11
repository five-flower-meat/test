/**
 * @author carroll
 * @since 20180810
 * @class Captcha
 * @description 对外输出验证码
 */
import $ from 'jquery';
import '../css/captcha.css';
import imgClose from '../images/icon_close.png';

const second = 59;

class Captcha {
  constructor(...args) {
    if (!args[0]) return false;

    this.captcha = args[0].captcha;
    this.captchaMain = args[0].captchaMain;
    this.captchaInput = args[0].captchaInput;
    this.capthchaNumberItem = args[0].capthchaNumberItem;
    this.captchaCount = args[0].captchaCount;
    this.captchaPhone = args[0].captchaPhone;
    this.capthchaRepeat = args[0].capthchaRepeat;
    this.capthchaSend = args[0].capthchaSend;
    this.phone = args[0].phone;
    this.title = args[0].title;
    this.countTime = null;
  }
  initCaptcha() {
    // 手机号码展示
    const hiddPhone = this.phone.substr(0, 3) + '****' + this.phone.substr(7);
    this.captchaPhone.html(hiddPhone);

    this.captchaInput.val('');
    this.capthchaNumberItem.each(function () {
      $(this).removeClass('active');
      $(this).html('');
    });
    this.captchaCount.html(second);
    // 不能在function里clearInternal(countTime), 因为变量提升了
    this.countTime = setInterval(() => {
      var _count = Number(this.captchaCount.html()) - 1;
      if (_count >= 0) {
        this.captchaCount.html(_count);
      } else {
        clearInterval(this.countTime);
        this.capthchaRepeat.hide();
        this.capthchaSend.show();
      }
    }, 1000);
  }
  renderHtml() {
    const html = `
    <div class="captcha">
        <div class="captcha-main">
            <div class="benefits-main__button" id="captchaClose">
              <img src="${imgClose}" alt="">
            </div>
            <div class="capthcha-title">
                ${this.title}
            </div>
            <div class="capthcha-desc">
                验证码已发送至
                <span class="capthcha-desc__phone"></span>
            </div>
            <div class="capthcha-number">
                <input maxlength="6" type="tel" pattern="\\d*" class="captcha-input"  />
                <div class="capthcha-number__item"></div>
                <div class="capthcha-number__item"></div>
                <div class="capthcha-number__item"></div>
                <div class="capthcha-number__item"></div>
                <div class="capthcha-number__item"></div>
                <div class="capthcha-number__item"></div>
            </div>
            <div class="capthcha-repeat">
                重新发送验证码（
                <span class="capthcha-repeat__count">59</span>s）
            </div>
            <div class="capthcha-send">
                重新发送验证码
            </div>
        </div>
    </div>`;
    return html;
  }
  toKeyup(e) {
    let arr = [];
    let values = this.captchaInput.val();
    values = values.replace(/[^\d]/g, '');
    arr = values.toString().split('');
    this.capthchaNumberItem.each(function () {
      $(this).removeClass('active');
      $(this).html('');
    });
    arr.map((value, index) => {
      this.capthchaNumberItem.eq(index).html(value);
      this.capthchaNumberItem.eq(index).addClass('active');
    });
    return values;
  }
  // 重新发送请求
  resendCaptcha() {
    clearInterval(this.countTime);
    this.initCaptcha();
    this.capthchaSend.hide();
    this.capthchaRepeat.show();
    this.captchaInput.focus();
  }
  getCaptcha() {
    this.initCaptcha();
    this.captcha.show();
    this.captchaInput.focus();
  }
  captchaClick(e) {
    this.captcha.remove();
    clearInterval(this.countTime);
    // 取消keyup事件
    // this.captchaInput.unbind('keyup');
  }
};
function CaptchaInstance(options = {}) {
  $('body').append(new Captcha(options).renderHtml());
  let captchaValue = null;
  const captcha = $('.captcha');
  const captchaMain = $('.captcha-main');
  const captchaInput = $('.captcha-input');
  const capthchaNumberItem = $('.capthcha-number__item');
  const captchaPhone = $('.capthcha-desc__phone');
  const capthchaRepeat = $('.capthcha-repeat');
  const captchaCount = $('.capthcha-repeat__count');
  const capthchaSend = $('.capthcha-send');
  const captchaClose = $('#captchaClose');
  this.value = null;

  let captchaIns = new Captcha({
    captcha,
    captchaMain,
    captchaInput,
    capthchaNumberItem,
    captchaPhone,
    capthchaRepeat,
    captchaCount,
    capthchaSend,
    phone: options.phone,
    title: options.title
  });

  captcha.on('touchmove', function (e) { e.preventDefault(); });
  captchaClose.click(() => {
    captchaIns.captchaClick();
  });
  // 点击禁止内容关闭事件
  captchaMain.click(function (e) {
    e.stopPropagation();
  });
  // 监听按钮按下事件
  captchaInput.keyup(() => {
    let value = captchaIns.toKeyup();
    if (value === this.value) {
      return false;
    }
    this.value = value;
  });
  capthchaSend.click(() => {
    captchaIns.resendCaptcha();
    // 重新获取验证码
    this.getCaptcha();
  });

  // 展示弹窗
  this.show = function () {
    captcha.show();
    captchaIns.getCaptcha();
  };
  // 关闭弹窗
  this.hide = function () {
    captcha.remove();
  };
  // 获得验证码，以及传入回调函数
  this.get = function (callback) {
    this.getCaptcha = callback;
    callback();
  };
  // 输入验证码后，传入回调
  this.then = (callback) => {
    // this.callback = callback;
    Object.defineProperty(this, 'value', {
      get() {
        return captchaValue;
      },
      set(newValue) {
        captchaValue = newValue;
        if (captchaValue.length === 6) {
          callback(captchaValue);
        }
      }
    });
  };
};
export default CaptchaInstance;