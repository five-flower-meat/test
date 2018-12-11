import $ from 'jquery';
import utils from './utils';

export default function (data) {
  const url = '/migu/activityInfo/queryOffline.action';
  const redirectUrl = '../offline/index.html';
  const json = {
    activeCode: data
  };
  $.ajax({
    method: 'POST',
    url: url,
    data: json,
    dataType: 'JSON',
    success: function (res = {}) {
      if (res.return_code === '200') {
        if (res.data.isOffline === 'true') {
          window.location.href = redirectUrl;
        }
      }
    },
    error: function (err) {
      let _err = utils.errorHandle(err);
      utils.Toast(_err);
    }
  });
}