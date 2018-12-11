import './ios-dialog.css';
import $ from 'jquery';

let isLoading = false;

/**
 * @author carroll
 * @since 20181022
 * @description ios样式的确认弹窗
 * @param option content: '内容'
 * @param option contentHtml: '内容为html格式'
 * @param option confirmContent: '单列底部内容'
 * @param option confirmFunc: '单列执行的方法'
 * @param option leftContent: '底部左侧内容'
 * @param option rightContent: '底部右侧内容'
 * @param option leftFunc: ''
 * @param option rightFunc: ''
 */
function IosDialog(option = {}) {
  if (!isLoading) {
    const iosDialogHtml = `
      <div class="ios-dialog">
        <div class="ios-dialog-main" style="width: ${option.width ? option.width + 'px' : '255px'}">
          <div class="ios-dialog-desc"></div>
          <div class="ios-dialog-line" style="width: ${option.width ? option.width + 'px' : '255px'}"></div>
          <div class="ios-dialog-confirm">好的</div>
          <div class="ios-dialog-confirm-grid"></div>
        </div>
    </div>
    `;
    $('body').append(iosDialogHtml);
    isLoading = true;
  }
  const iosDialog = $('.ios-dialog');
  const confirm = $('.ios-dialog-confirm');
  const confirmGrid = $('.ios-dialog-confirm-grid');
  const desc = $('.ios-dialog-desc');

  iosDialog.on('touchmove', function (e) {
    /* e.preventDefault(); */
    e.stopPropagation();
  });

  // 20181206，修复中间区域可活动问题
  /* desc.on('touchstart', function(e) {
    $('body').css('overflow', 'hidden');
  }); */
  desc.on('touchmove', function (e) {
    e.stopPropagation();
  });
  /* desc.on('touchend', function (e) {
    // $('body').css('overflow', 'auto');
  }); */

  iosDialog.show();

  // 如果为两个栅格
  if (option.leftContent) {
    gridFunc();
  } else {
    // 正常展示
    confirmGrid.hide();
    confirm.show();
    confirm.html(option.confirmContent || '好的');
    confirm.click(function () {
      if (option.confirmFunc) {
        option.confirmFunc();
      }
      $('body').css('overflow', 'auto');
      $('.wyscw').css('overflow', 'auto');
      iosDialog.hide();
    });
  }

  desc.html(option.content || '');
  if (option.contentHtml) {
    desc.html(option.contentHtml);
  }

  function gridFunc() {
    confirmGrid.show();
    confirm.hide();
    const girdHtml = `
      <div class="ios-dialog-left">取消</div>
      <div class="ios-dialog-confirm-line"></div>
      <div class="ios-dialog-right">确定</div>
    `;
    confirmGrid.html(girdHtml);

    const left = $('.ios-dialog-left');
    const right = $('.ios-dialog-right');

    left.html(option.leftContent || '取消');
    right.html(option.rightContent || '确认');

    left.click(function () {
      if (option.leftFunc) {
        option.leftFunc();
      }
      $('body').css('overflow', 'auto');
      iosDialog.hide();
    });

    right.click(function () {
      if (option.rightFunc) {
        option.rightFunc();
      }
      $('body').css('overflow', 'auto');
      iosDialog.hide();
    });
  }
};

export default IosDialog;