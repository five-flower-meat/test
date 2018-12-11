import 'fastclick';
import 'promise-polyfill/src/polyfill'; // Promise兼容
import 'babel-polyfill'; // ES6兼容
import '../../common/js/init.js';
import '../../common/js/common.js';
import './js/index';

import '../../common/css/init.css';
import './css/index.css';

// html修改可以被hot reload检测
if (process.env.NODE_ENV !== 'production') {
  require('./index.html');
}