import 'fastclick';
import '../../common/css/init.css';
import './css/common.css';
import './css/index.css';
import './css/invite.css';
import './css/receive.css';
import './css/poster.css';

import '../../common/js/init.js';
import '../../common/js/common.js';
import './js/index.js';
import './js/inviteIndex.js';
import './js/receiveIndex.js';

// html修改可以被hot reload检测
if (process.env.NODE_ENV !== 'production') {
  require('./index.html');
  require('./invite.html');
  require('./receive.html');
}