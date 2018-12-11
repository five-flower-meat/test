import 'fastclick';
import '../../common/js/init.js';
import '../../common/js/common.js';
import './js/index';

import '../../common/css/init.css';
import './css/index.css';
import './css/give.css';
// import './css/address.css';

// html修改可以被hot reload检测
if (process.env.NODE_ENV !== 'production') {
  require('./index.html');
  require('./give.html');
  // require('./address.html');
}