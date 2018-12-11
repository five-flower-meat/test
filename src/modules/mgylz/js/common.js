import $ from 'jquery';
import utils from '../../../common/js/utils';

export function isShowTitle() {
  const titleBar = $('.ylz-bar');
  const isTitle = utils.GetQueryString('isTitle');
  if (isTitle === '0') titleBar.hide();
}

export function backHandle() {
  const back = $('#back');

  // 返回上一页
  back.click(() => history.back(-1));
}