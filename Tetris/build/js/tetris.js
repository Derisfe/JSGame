var game = {
  CSIZE: 26,  // 每个格子大小
  OFFSET: 15,  // 格子距离边框的偏移量
  pg: null,    // 保存游戏容器元素
  shape: null,  // 保存正在下落的主角图形
  nextShape: null, // 保存备胎图形
  timer: null,   // 保存定时器序号
  interVal: 200, // 下落的时间间隔
  RN: 20,        // 总行数
  CN: 10,        // 总列数
  wall: null,    // 墙
  score: 0,     // 游戏得分
  lines: 0,     // 删除的总行数
  SCORES: [0, 10, 30, 60, 100],  // 分数等级
  state: 1,      // 游戏状态
  GAMEOVER: 0,
  RUNNING: 1,
  PAUSE: 2,
  start: function () {
    this.state = this.RUNNING;
    this.score = 0;
    this.lines = 0;
    this.wall = [];
    for (var r = 0; r < this.RN; r++)
      this.wall[r] = new Array(this.CN);
    this.pg = document.getElementsByClassName('playground')[0];
    this.shape = this.randomShape();
    this.nextShape = this.randomShape();
    this.paint();
    this.timer = setInterval(this.moveDown.bind(this), this.interVal);

    /**
     * 给document绑定键盘按下事件
     * @type {any}
     */
    document.onkeydown = function (e) {
      switch (e.keyCode) {
        case 32: // space
          this.state === this.RUNNING && this.hardDrop();
          break;
        case 37: // left
          this.state === this.RUNNING && this.moveLeft();
          break;
        case 38: // top
          this.state === this.RUNNING && this.rotateR();
          break;
        case 90: // z
          this.state === this.RUNNING && this.rotateL();
          break;
        case 39: // right
          this.state === this.RUNNING && this.moveRight();
          break;
        case 40: // down
          this.state === this.RUNNING && this.moveDown();
          break;
        case 83: // s
          this.state === this.GAMEOVER && this.start();
          break;
        case 81: // q
          this.state !== this.GAMEOVER && this.quit();
          break;
        case 80: // p
          this.state === this.RUNNING && this.pause();
          break;
        case 67: // c
          this.state === this.PAUSE && this.myContinue();
          break;
        default:
          break;
      }
    }.bind(this);
  },
  /**
   * 继续游戏
   */
  myContinue: function () {
    this.state = this.RUNNING;
    this.timer = setInterval(this.moveDown.bind(this), this.interVal);
    this.paint();
  },
  /**
   * 暂停游戏
   */
  pause: function () {
    this.state = this.PAUSE;
    clearInterval(this.timer);
    this.paint();
  },
  /**
   * 退出游戏
   */
  quit: function () {
    this.state = this.GAMEOVER;
    clearInterval(this.timer);
    this.paint();
  },
  /**
   * 当前图形是否能够旋转
   * @returns {boolean}
   */
  canRotate: function () {
    for (var i = 0; i < this.shape.cells.length; i++) {
      var cell = this.shape.cells[i];
      if (cell.c < 0 || cell.c >= this.CN ||
        cell.r < 0 || cell.r >= this.RN ||
        this.wall[cell.r][cell.c] !== undefined
      ) return false;
    }
    return true;
  },
  /**
   * 顺时针旋转
   */
  rotateR: function () {
    this.shape.rotateR();
    !this.canRotate() && this.shape.rotateL();
    this.paint();
  },
  /**
   * 逆时针旋转
   */
  rotateL: function () {
    this.shape.rotateL();
    !this.canRotate() && this.shape.rotateR();
    this.paint();
  },
  /**
   * 随机生成一个图形
   */
  randomShape: function () {
    var r = Math.floor(Math.random() * 3);
    switch (r) {
      case 0:
        return new T();
      case 1:
        return new O();
      case 2:
        return new I();
      default:
        break;
    }
  },
  /**
   * 一落到底
   */
  hardDrop: function () {
    while (this.canDown()) {
      this.moveDown();
    }
  },
  /**
   * 能否左移
   */
  canLeft: function () {
    for (var i = 0; i < this.shape.cells.length; i++) {
      var cell = this.shape.cells[i];
      if (cell.c === 0 ||
        this.wall[cell.r][cell.c - 1] !== undefined
      ) return false;
    }
    return true;
  },
  /**
   * 左移
   */
  moveLeft: function () {
    if (this.canLeft()) {
      this.shape.moveLeft();
      this.paint();
    }
  },
  /**
   * 能否右移
   */
  canRight: function () {
    for (var i = 0; i < this.shape.cells.length; i++) {
      var cell = this.shape.cells[i];
      if (cell.c === this.CN - 1 || this.wall[cell.r][cell.c + 1] !== undefined) return false;
    }
    return true;
  },
  /**
   * 右移
   */
  moveRight: function () {
    if (this.canRight()) {
      this.shape.moveRight();
      this.paint();
    }
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
      var ln = this.deleteRows();
      this.lines += ln;
      this.score += this.SCORES[ln];

      if (this.isGAMEOVER()) {
        this.shape = this.nextShape;
        this.nextShape = this.randomShape();
      } else {
        this.state = this.GAMEOVER;
        clearInterval(this.timer);
      }
    }
    this.paint();
  },
  isGAMEOVER: function () {
    for (var i = 0; i < this.nextShape.cells.length; i++) {
      var cell = this.nextShape.cells[i];
      if (this.wall[cell.r][cell.c]) return false;
    }
    return true;
  },
  /**
   * 判斷并刪除所有滿格行
   */
  deleteRows: function () {
    for (var r = this.RN - 1, ln = 0; r >= 0; r--) {
      if (this.isFullRow(r)) {
        this.deleteRow(r);
        ln++;
        if (this.wall[r - 1].join("") === '' || ln === 4) break;
        r++; // r留在原地
      }
    }
    return ln;
  },
  deleteRow: function (r) {
    for (; r >= 0; r--) {
      this.wall[r] = this.wall[r - 1];
      this.wall[r - 1] = new Array(this.CN);
      for (var c = 0; c < this.CN; c++) {
        this.wall[r][c] && this.wall[r][c].r++;
      }
      if (this.wall[r - 2].join("") === "") break;
    }
  },
  /**
   * 是否滿格行
   * @param r
   */
  isFullRow: function (r) {
    return String(this.wall[r]).search(/^,|,,|,$/) === -1;
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
    this.paintNext();
    this.paintScore();
    this.paintState();
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
  },
  /**
   * 重绘备胎图形
   */
  paintNext: function () {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < this.nextShape.cells.length; i++) {
      var img = this.paintCell(this.nextShape.cells[i]);
      img.style.left = parseFloat(img.style.left) + 10 * this.CSIZE + 'px';
      img.style.top = parseFloat(img.style.top) + this.CSIZE + 'px';
      frag.appendChild(img);
    }
    this.pg.appendChild(frag);
  },
  /**
   * 重绘分数
   */
  paintScore: function () {
    document.getElementById('score').innerHTML = this.score;
    document.getElementById('lines').innerHTML = this.lines;
  },
  /**
   * 根据游戏的状态绘制状态图片
   */
  paintState: function () {
    var img = new Image();
    if (this.state === this.GAMEOVER) {
      img.src = 'img/game-over.png';
    } else if (this.state === this.PAUSE) {
      img.src = 'img/pause.png';
    }
    img.className = 'state';
    this.pg.appendChild(img);
  }
};

game.start();