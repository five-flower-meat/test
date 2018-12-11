import $ from 'jquery';
import utils from '../../../common/js/utils.js';

/**
 * @author carroll
 * @since 20180814
 * @example
 * Dialog({
    isNeedConfirm: true,
    desc: 'ok',
    cancelHtml: 'xxxx',
    confirmHtml: 'XXX',
    cancelCallback: func,
    confirmCallback: func
  });
 */
export function Dialog(option = {}) {
  const toast = $('.xyyx-toast');
  const toastTitle = $('.xyyx-toast__title');
  const toastDesc = $('.xyyx-toast__desc');
  const toastButton = $('.xyyx-toast__button');
  const toastSuccessImg = $('.xyyx-toast__logo-success');
  const toastGeneralImg = $('.xyyx-toast__logo');
  const buttonBottom = $('.xyyx-toast__bottom');
  const buttonLeft = $('.xyyx-toast__bottom .left');
  const buttonRight = $('.xyyx-toast__bottom .right');

  if (option.isNeedConfirm) {
    toastButton.hide();
    buttonBottom.show();
  } else {
    toastButton.show();
    buttonBottom.hide();
  }

  if (option.type === 'success') {
    toastSuccessImg.show();
    toastGeneralImg.hide();
  } else {
    toastSuccessImg.hide();
    toastGeneralImg.show();
  }

  if (option.title) {
    toastTitle.show();
    toastTitle.html(option.title);
  } else {
    toastTitle.hide();
  }

  buttonLeft.unbind();
  buttonRight.unbind();

  // 按钮操作
  buttonLeft.html(option.cancelHtml || '取消');
  buttonRight.html(option.confirmHtml || '确定');

  if (option.cancelCallback) {
    buttonLeft.click(function () {
      option.cancelCallback();
      toast.hide();
    });
  } else {
    buttonLeft.click(function () {
      toast.hide();
    });
  }

  if (option.confirmCallback) {
    buttonRight.click(function () {
      option.confirmCallback();
      toast.hide();
    });
  } else {
    buttonRight.click(function () {
      toast.hide();
    });
  }

  toast.show();
  toastDesc.html(option.desc);
  toastButton.click(function () {
    toast.hide();
  });
}

export function Request(url, data, configs = {}) {
  utils.Loading({ show: true });
  return new Promise(function (resolve, reject) {
    $.ajax({
      method: 'POST',
      url: 'http://localhost:9618' + url,
      // url: url,
      data: data,
      dataType: 'JSON',
      success: function (res) {
        utils.Loading({ show: false });
        if (res.code.toString() === '-1') {
          Dialog({
            type: 'error',
            desc: res.msg
          });
        } else {
          if (res.code.toString() === '401') {
            if (configs.isFirstRequest) {
              resolve(res);
            } else {
              location.href = res.data.returnUrl;
            }
          } else {
            resolve(res);
          }
        }
      },
      error: function (err) {
        utils.Loading({ show: false });
        let _err = utils.errorHandle(err);
        utils.Toast(_err);
        // reject(err);
      }
    });
  });
}