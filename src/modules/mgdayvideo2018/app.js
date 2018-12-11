import 'fastclick';
import '../../common/js/init.js';
import '../../common/js/common.js';
import 'promise-polyfill/src/polyfill'; // Promise兼容
import 'babel-polyfill'; // Promise兼容

import '../../common/css/init.css';
import './css/common.css';
import './css/index.css';
import './css/lottery.css';

// html修改可以被hot reload检测
if (process.env.NODE_ENV !== 'production') {
  require('./index.html');
  require('./error.html');
}

if (location.href.includes('index.html')) {
  require('./js/index');
} else {
  require('./js/error');
}
