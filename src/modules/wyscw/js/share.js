import $ from 'jquery';

/**
 * 暂时废弃
 */
$(function() {
  $('.weiboShare').click(function() {
    shareToXl('test', location.href, 'https://s.migu.cn/stN/mgday2018/static/mgday2018/share.jpg');
  });
  function shareToXl(title, url, picurl) {
    var sharesinastring = 'https://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
    window.open(sharesinastring, 'newwindow', 'height=400,width=400,top=100,left=100');
  }
});