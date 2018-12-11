/**
 * @author carroll
 * @since 20180813
 * @description 加载公共模块
*/
import '../css/common.css';
import $ from 'jquery';

const loading = `
  <div class="loading-hide">
    <div class="loading-mask"></div>
    <div class="loading-dialog">
      <div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
      </div>
    </div>
  </div>
`;

const toast = `
  <div class="toast">
    <div class="toast-main"></div>
  </div>
`;

$('body').append(loading);
$('body').append(toast);