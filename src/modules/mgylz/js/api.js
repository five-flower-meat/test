import $ from 'jquery';
import utils from '../../../common/js/utils';
import IosDialog from '../../../common/js/ios-dialog';

const API = url => (params, configs) => Request(url, params, configs);

function Request(url, data, config = {}) {
  data = Object.assign({}, data, {
    redirectUrl: location.href
  });
  !config.isNotLoading && utils.Loading({ show: true });
  return new Promise(function (resolve, reject) {
    $.ajax({
      method: 'POST',
      // url: 'http://localhost:9618' + url,
      url: url,
      data: data,
      dataType: 'JSON',
      success: function (res = {}) {
        if (res.return_code === '301' && !config.isNotShowDialog) {
          IosDialog({
            contentHtml: `<div>对不起！</div>
            <div>非天津移动用户无法参加本活动。</div>`
          });
        } else if (res.return_code && res.return_code === '-1') {
          utils.Toast(res.return_msg);
        } else if (
          res.return_code &&
          res.return_code === '401' &&
          !config.unRedirect
        ) {
          if (res.data && res.data.returnUrl) {
            window.location.href = res.data.returnUrl;
          } else {
            utils.Toast('接口出错');
          }
        } else {
          resolve(res.return_code === '401' ? res : res.data);
        }
        !config.isNotLoading && utils.Loading({ show: false });
      },
      error: function (err) {
        !config.isNotLoading && utils.Loading({ show: false });
        let _err = utils.errorHandle(err);
        utils.Toast(_err);
      }
    });
  });
}

export default {
  loginJudge: API('/migu/tjMarket/loginJudge.action'),
  clickSign: API('/migu/tjMarket/doSign.action'),
  getPrizeList: API('/migu/tjMarket/querySignWinningDetail.action'),
  getLotty: API('/migu/tjMarket/doluckylottery.action'),
  putAddress: API('/migu/tjMarket/fillInWinningAddress.action'),
};