import { Request } from './common.js';

const API = url => (params, configs) => Request(url, params, configs);

export default {
  login: API('/migu/campusMarketing/loginJudge.action'),
  getLoginUrl: API('/migu/campusMarketing/getLoginUrl.action'),
  // 兑换话费查询信息接口
  queryExchangeFeeInfo: API('/migu/campusMarketing/queryExchangeFeeInfo.action'),
  // 兑换话费接口
  exchangeFe: API('/migu/campusMarketing/exchangeFee.action'),
  // 导出需充话费记录
  downFeeNeedCharge: API('/migu/campusMarketing/downFeeNeedCharge.action'),
  // 查询邀请详情
  queryInvitingDetails: API('/migu/campusMarketing/queryInvitingDetails.action'),
  // 查询领取详情
  queryReceiveDetails: API('/migu/campusMarketing/queryReceiveDetails.action'),
  // 兑换话费
  exchangeFee: API('/migu/campusMarketing/exchangeFee.action'),
  // 换一换获取二维码图片
  getQRCode: API('/migu/campusMarketing/getQRCode.action'),
  // 查询子公司客户端用户状态
  queryUserStatus: API('/migu/campusMarketing/queryUserStatus.action'),
};