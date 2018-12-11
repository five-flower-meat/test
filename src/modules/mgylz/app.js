import 'fastclick';
import '../../common/js/init.js';
import '../../common/js/common.js';
import 'promise-polyfill/src/polyfill'; // Promise兼容

import '../../common/css/init.css';
import './css/common.css';
import './css/index.css';
import './css/lotty.css';
import './css/address.css';

// html修改可以被hot reload检测
if (process.env.NODE_ENV !== 'production') {
  require('./index.html');
  require('./lotty.html');
  require('./address.html');
}

if (location.href.includes('lotty.html')) {
  require('./js/lotty');
} else if (location.href.includes('address.html')) {
  require('./js/address');
} else {
  require('./js/index');
}