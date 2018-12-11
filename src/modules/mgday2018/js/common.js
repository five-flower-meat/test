import $ from 'jquery';
import utils from '../../../common/js/utils';

export function isShowTitle() {
  const titleBar = $('.mgday-bar');
  const isTitle = utils.GetQueryString('isTitle');
  if (isTitle === '0') titleBar.hide();
}

export function backHandle() {
  const back = $('#back');

  // 返回上一页
  back.click(() => history.back(-1));
}

export function hasAccessApp(appId) {
  if (
    appId === 1 ||
    // appId === 2 ||
    appId === 5
    // appId === 6
  ) {
    return true;
  }
}
