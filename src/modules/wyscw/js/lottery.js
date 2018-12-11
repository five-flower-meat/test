import $ from 'jquery';

/**
 * @author carroll
 * @since 20181108
 * @class Lottery
 */
export default class Lottery {
  constructor(args) {
    this.$options = Object.assign({}, {
      index: 1, // 初始位置
      target: 2, // 最终位置，由后台匹配
      initSpeed: 300, // 初始转动速度
      speed: 0, // 当前转动次数
      upStep: 50, // 加速滚动步长
      upMax: 50, // 速度上限
      downStep: 50, // 减速滚动步长,
      downMax: 500, // 减速上限
      waiting: 3000, // 允许转动时长
      isRunning: false, // 当前是否正在抽奖
      upTimer: null,
      downTimer: null,
      rollerTimer: null,
      total: 10, // 总共多少个奖品
      isOver: false, // 是否禁止抽奖
      afterStop: null, // 抽奖之后的操作
    }, args);
  }

  start(target, isNotAvaiable) { // 最后指向的目标、是否可执行
    // 如果抽奖次数用光
    if (this.isNotAvaiable) return false;
    // 如果正在抽奖中
    if (this.$options.isRunning) return false;

    this.$options.target = target || this.$options.target;
    this.$options.speed = this.$options.initSpeed;

    this.roll();
  }

  index() {
    return (this.$options.index - 1) % this.$options.total + 1;
  }

  // 开始转动转盘
  roll() {
    const items = $('.birth-main-list');
    items.find(`[data-index=${this.index()}]`).removeClass('active');
    ++this.$options.index;
    items.find(`[data-index=${this.index()}]`).addClass('active');

    this.rollerTimer = setTimeout(() => {
      this.roll();
    }, this.$options.speed);

    if (!this.$options.isRunning) {
      this.up();
      this.$options.isRunning = true;
    }
  }

  // 停止之后
  stop() {
    clearTimeout(this.downTimer);
    clearTimeout(this.rollerTimer);

    this.$options.speed = this.$options.initSpeed;
    this.$options.isRunning = false;

    if (this.$options.afterStop) {
      this.$options.afterStop.call(this);
    }
  }

  afterStop(func) {
    this.$options.afterStop = func;
  }

  // 加速转盘
  up() {
    if (this.$options.speed <= this.$options.upMax) {
      this.constant();
    } else {
      this.$options.speed -= this.$options.upStep;
      this.upTimer = setTimeout(() => {
        this.up();
      }, this.$options.speed);
    }
  }

  // 匀速转盘
  constant() {
    clearTimeout(this.upTimer);
    setTimeout(() => {
      this.down();
    }, this.$options.waiting);
  }

  // 减速转盘
  down() {
    if (this.$options.speed > this.$options.downMax &&
      this.$options.target === this.index()) {
      this.stop();
    } else {
      this.$options.speed += this.$options.downStep;
      this.downTimer = setTimeout(() => {
        this.down();
      }, this.$options.speed);
    }
  }
};