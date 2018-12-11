/**
 * @author carroll
 * @since 20180719
 * @description 公共方法在utils上
*/
import $ from 'jquery';

const utils = {
  /**
   * @description 新增url中传入的query字段
   * @returns {String}
   */
  addQueryString(url, name, value) {
    const urlLen = url.length;
    if (url.includes('?')) {
      if (url[urlLen] === '?') {
        return `${url}${name}=${value}`;
      } else {
        return `${url}&${name}=${value}`;
      }
    } else {
      if (value) {
        return `${url}?${name}=${value}`;
      } else {
        return url;
      }
    }
  },

  /**
   * @description 去除url中某一query字段
   * @returns {String} 去除某一字段的新的url
   * @param { isRegularUrl } url
   * @param { String } paramKey
   */
  RemoveQueryString(url, paramKey) {
    // if (!this.isRegularUrl(url)) return url;
    let origin = url.substr(0, url.indexOf('?')); // 页面主地址（参数之前地址）
    let nextUrl = '';
    let urlParam = '';
    if (url.indexOf('?') > -1) {
      urlParam = url.substr(url.indexOf('?') + 1, url.length);
    } else {
      return url;
    }

    let arr = [];
    if (urlParam !== '') {
      var urlParamArr = urlParam.split('&'); // 将参数按照&符分成数组
      for (var i = 0; i < urlParamArr.length; i++) {
        var paramArr = urlParamArr[i].split('='); // 将参数键，值拆开
        // 如果键雨要删除的不一致，则加入到参数中
        if (paramArr[0] !== paramKey) {
          arr.push(urlParamArr[i]);
        }
      }
    }
    if (arr.length > 0) {
      nextUrl = '?' + arr.join('&');
    }
    url = origin + nextUrl;
    return url;

    // var loca = window.location;
    // var baseUrl = loca.origin + loca.pathname + '?';
    // var query = loca.search.substr(1);
    // if (query.indexOf(name) > -1) {
    //   var obj = {};
    //   var arr = query.split('&');
    //   for (var i = 0; i < arr.length; i++) {
    //     arr[i] = arr[i].split('=');
    //     obj[arr[i][0]] = arr[i][1];
    //   };
    //   delete obj[name];
    //   var url = baseUrl + JSON.stringify(obj).replace(/["{}]/g, '').replace(/:/g, '=').replace(/,/g, '&');
    //   return url;
    // };
    // return location.href;
  },

  /**
   * @description 获取url中某一query字段
   */
  GetQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },

  /**
   * @returns 1是andriod，2是ios，0是其他
   */
  appType: function () {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
      return 1;
    } else if (u.indexOf('iPhone') > -1 || u.indexOf('iphone') > -1) {
      return 2;
    } else {
      return 0;
    }
  },

  /**
   * @description 是否是手机端
   */
  isMoblie: function () {
    const u = navigator.userAgent;
    return !!u.match(/AppleWebKit.*Mobile.*/);
  },

  /**
   * @description 是否是微信
   */
  isWechat: function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') > -1) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * @description toast弹窗
   * @example Toast('输出内容');
   */
  Toast: function (desc, time) {
    var _time = time || 2000;
    var toastTime = null;
    var toast = $('.toast');
    var toastMain = $('.toast-main');
    clearTimeout(toastTime);
    toast.show();
    toastMain.html(desc);
    toastTime = setTimeout(function () {
      toast.hide();
    }, _time);
  },

  /**
   * @description 通过show和hide控制显示隐藏
   */
  Loading: function (configs) {
    var isLoading = $('.loading-hide');
    isLoading.on('touchmove', function (e) { e.preventDefault(); });
    configs.show ? isLoading.show() : isLoading.hide();
  },

  /**
   * @description 验证是否是11位手机号
   */
  checkPhone: function (value) {
    var reg = /^[1][0-9]{10}$/;
    return reg.test(value);
  },

  /**
   * @description 错误码处理
   */
  errorHandle: function (err) {
    switch (err.status) {
      case 400:
        return '请求错误';

      case 401:
        return '未授权，请登录';

      case 403:
        // 跳转到权限提示页面
        return '拒绝访问';

      case 404:
        return '请求地址出错';

      case 408:
        return '请求超时';

      case 500:
        return '服务器内部错误';

      case 501:
        return '服务未实现';

      case 502:
        return '网关错误';

      case 503:
        return '服务不可用';

      case 504:
        return '网关超时';

      case 505:
        return 'HTTP版本不受支持';

      default:
        return '未知错误';
    }
  },

  /**
   * @description 加载js文件
   */
  loadScript(src, callback) {
    var timeStamp = new Date().getTime();
    var scr = document.createElement('script');
    if (!src.includes('?')) {
      scr.src = src + '?t=' + timeStamp;
    } else {
      scr.src = src;
    }
    document.getElementsByTagName('head')[0].appendChild(scr);
    scr.onload = function () {
      if (callback) {
        callback();
      }
    };
  },

  /**
   * @export 验证是否是url，本地环境可能会失效
   * @param {*} url
   * @returns {Boolean}
   */
  isRegularUrl(url) {
    const match = /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
    return match.test(url);
  }
};

export default utils;