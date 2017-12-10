/**
 * DOM_day06下午1，俄罗斯方块实战
 * 20:41
 */
var game = {
  CSIZE: 26,  // 每个格子大小
  OFFSET: 15,  // 格子距离边框的偏移量
  pg: null,    // 保存游戏容器元素
  shape: null,  // 保存正在下落的主角图形
  timer: null,   // 保存定时器序号
  interVal: 200, // 下落的时间间隔
  RN: 20,        // 总行数
  CN: 10,        // 总列数
  wall: null,    // 墙
  start: function () {
    this.wall = [];
    for (var r = 0; r < this.RN; r++)
      this.wall[r] = new Array(this.CN);
    this.pg = document.getElementsByClassName('playground')[0];
    this.shape = new T();
    this.paint();
    this.timer = setInterval(this.moveDown.bind(this), this.interVal);
  },
  /**
   * 是否可继续下落
   */
  canDown: function () {
    for (var i = 0; i < this.shape.cells.length; i++) {
      var cell = this.shape.cells[i];
      if (cell.r === this.RN - 1 || this.wall[cell.r + 1][cell.c] !== undefined)
        return false;
    }
    return true;
  },
  /**
   * 下落
   */
  moveDown: function () {
    if (this.canDown()) {
      this.shape.moveDown();
    } else {
      this.landIntoWall();
      this.shape = new T();
    }
    this.paint();
  },
  /**
   * 落到墙里
   */
  landIntoWall: function () {
    for (var i = 0; i < this.shape.cells.length; i++) {
      var cell = this.shape.cells[i];
      this.wall[cell.r][cell.c] = cell;
    }
  },
  /**
   * 重绘一切
   */
  paint: function () {
    this.pg.innerHTML = this.pg.innerHTML.replace(/<img [^>]*>/g, "");
    this.paintShape();
    this.paintWall();
  },
  /**
   * 绘制主角图形
   */
  paintShape: function () {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < this.shape.cells.length; i++)
      frag.appendChild(this.paintCell(this.shape.cells[i]));
    this.pg.appendChild(frag);
  },
  /**
   * 绘制单个方块
   * @param cell
   * @returns {*}
   */
  paintCell: function (cell) {
    var img = new Image();
    img.style.left = cell.c * this.CSIZE + this.OFFSET + 'px';
    img.style.top = cell.r * this.CSIZE + this.OFFSET + 'px';
    img.src = cell.src;
    return img;
  },
  /**
   * 绘制墙
   */
  paintWall: function () {
    var frag = document.createDocumentFragment();
    for (var r = this.RN - 1; r >= 0; r--) {
      if (this.wall[r].join("") === "") break;
      for (var c = 0; c < this.CN; c++) {
        if (this.wall[r][c])
          frag.appendChild(this.paintCell(this.wall[r][c]));
      }
    }
    this.pg.appendChild(frag);
  }
};

game.start();