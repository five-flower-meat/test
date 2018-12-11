import $ from 'jquery';
import IosDialog from '../../../common/js/ios-dialog';
import utils from '../../../common/js/utils';
import API from './api';
import { isShowTitle } from './common';
$(function () {
  (function () {
    // 是否显示title bar
    isShowTitle();
  })();
  $('#save-btn').click(function () {
    const consignee = $('#name').val();
    const contact = $('#telNumber').val();
    const region = $('#address').val();
    const address = $('#detailedAddress').val();
    const isTitle = utils.GetQueryString('isTitle');
    if (consignee <= 0) {
      utils.Toast('请填写收货人姓名');
    } else if (contact.length !== 11 || !utils.checkPhone(contact)) {
      utils.Toast('请填写正确的手机号码');
    } else if (region <= 0) {
      utils.Toast('请填写收货地区');
    } else if (address <= 0) {
      utils.Toast('请填写详细地址');
    } else {
      IosDialog({
        contentHtml: '<div>填写完成！请确认是否保存该地址，地址一经保存，无法修改</div>',
        rightContent: '返回修改',
        leftContent: '确认',
        leftFunc: function () { },
        rightFunc: function () {
          API.putAddress({
            consignee,
            contact,
            region,
            address
          }).then(res => {
            utils.Toast('填写成功');
            setTimeout(() => {
              location.href = utils.addQueryString('./index.html', 'isTitle', isTitle);
            }, 2000);
          });
        }
      });
    }
  });
});