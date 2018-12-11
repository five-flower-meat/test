import 'fastclick';
import 'promise-polyfill/src/polyfill'; // Promise兼容
import '../../common/js/init.js';
import '../../common/js/common.js';
// import './js/index';
// import './js/result';

import '../../common/css/init.css';
import './css/index.css';
import './css/result.css';

// html修改可以被hot reload检测
if (process.env.NODE_ENV !== 'production') {
  require('./index.html');
  require('./result.html');
}

if (location.href.includes('index.html')) {
  require('./js/index');
} else if (location.href.includes('result.html')) {
  require('./js/result');
}