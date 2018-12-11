import $ from 'jquery';
import utils from '../../../common/js/utils';
// import IosDialog from '../../../common/js/ios-dialog';

const API = url => (params, configs) => Request(url, params, configs);

function Request(url, data, config = {}) {
  if (!config.isNotRedirectUrl) {
    data = Object.assign({}, data, {
      redirectUrl: location.href
    });
  }!config.isNotLoading && utils.Loading({
    show: true
  });
  return new Promise(function (resolve, reject) {
    $.ajax({
      method: 'POST',
      // url: 'http://localhost:9618' + url,
      url: url,
      data: data,
      dataType: 'JSON',
      success: function (res = {}) {
        if (res.return_code === '-1') {
          utils.Toast(res.return_msg);
        } else if (
          res.return_code === '401' &&
          !config.unRedirect
        ) {
          if (res.data && res.data.returnUrl) {
            utils.Toast('登录赢好礼，您可以用咪咕系APP的任一账号进行登录，也可用短信方式登录', 4000);
            setTimeout(function () {
              window.location.href = res.data.returnUrl;
            }, 4000);
          }
        } else {
          resolve(res.return_code === '401' ? res : res.data);
        }!config.isNotLoading && utils.Loading({
          show: false
        });
      },
      error: function (err) {
        if (err.status && err.status.toString() === '408') {
          window.location.href = './error.html';
        }!config.isNotLoading && utils.Loading({
          show: false
        });
        let _err = utils.errorHandle(err);
        utils.Toast(_err);
      }
    });
  });
}

export default {
  loginJudge: API('/migu/springFestival/loginJudge.action'),
  queryRemainingTimes: API('/migu/springFestival/queryRemainingTimes.action'),
  winDrawChance: API('/migu/springFestival/winDrawChance.action'),
  analyzeRedirect: API('/migu/springFestival/redirect.action'),
  luckyDraw: API('/migu/springFestival/luckyDraw.action'),
  winningRecharge: API('/migu/springFestival/winningRecharge.action'),
};