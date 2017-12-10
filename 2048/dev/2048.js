/* 前三行/列 合并 后三行/列 */
var game = {
  data: null,                         // 保存游戏的数据(arr[][])
  RN: 4,                            // 总行数
  CN: 4,                            // 总列数
  score: 0,                            // 保存游戏得分
  RUNNING: 1,                            // 运行中
  GAMEOVER: 0,                            // 结束
  /**
   * 启动程序
   */
  start: function () {
    // 重置游戏状态为运行中
    this.state = this.RUNNING;
    // 游戏得分归零
    this.score = 0;
    // 创建空数组保存在data属性中
    this.data = [];
    // r从0开始到<RN结束
    for (var r = 0; r < this.RN; r++) {
      // 向data中压入一个空数组
      this.data.push([]);
      // c从0开始到<CN结束
      for (var c = 0; c < this.CN; c++) {
        // 将data中r行c列位置赋值为0
        this.data[r][c] = 0;
      }
    }
    // 开局随机生成2个数据
    this.randomNum();
    this.randomNum();
    // console.dir(this.data);
    // 更新视图
    this.updateView();
    document.onkeydown = function (e) {
      if (this.state === this.RUNNING)
        switch (e.keyCode) {
          // 是37: 就左移
          case 37:
            this.moveLeft();
            break;
          // 是38: 就上移
          case 38:
            this.moveUp();
            break;
          // 是39: 就右移
          case 39:
            this.moveRight();
            break;
          // 是40: 就下移
          case 40:
            this.moveDown();
            break;
        }
    }.bind(this);
  },
  /**
   * 重新开始
   */
  restart: function () {
    document.getElementById('btn').onclick = function () {
      this.start();
    }.bind(this);
  },
  /**
   * 所有移动中相同代码的抽象
   * @param callback
   */
  move: function (callback) {
    // 为data拍照，保存在before中
    var before = String(this.data);
    callback.call(this);
    // 为data拍照，保存在after中
    var after = String(this.data);
    // 如果发生了移动
    if (before !== after) {
      // 随机生成数
      this.randomNum();
      // 如果游戏结束，就修改游戏状态为GAMEOVER
      this.isGameOver() && (this.state = this.GAMEOVER);
      // 更新页面
      this.updateView();
    }
  },
  /**
   * 上移所有行
   */
  moveUp: function () {
    this.move(function () {
      // 遍历data中每一列
      for (var c = 0; c < this.CN; c++) {
        // 调用moveUpInCol上移第c列
        this.moveUpInCol(c);
      }
    });
  },
  /**
   * 下移所有行
   */
  moveDown: function () {
    this.move(function () {
      // 遍历data中每一列
      for (var c = 0; c < this.CN; c++) {
        // 调用moveDownInCol下移第c列
        this.moveDownInCol(c);
      }
    });
  },
  /**
   * 右移所有行
   */
  moveRight: function () {
    this.move(function () {
      // 遍历data中每一行
      for (var r = 0; r < this.RN; r++) {
        // 右移第r行
        this.moveRightInRow(r);
      }
    });
  },
  /**
   * 左移所有行
   */
  moveLeft: function () {
    this.move(function () {
      // 遍历data中每一行  r
      for (var r = 0; r < this.RN; r++) {
        // 左移第r行
        this.moveLeftInRow(r);
      }
    });
  },
  /**
   * 下移第c行
   * @param c
   */
  moveDownInCol: function (c) {
    // r从RN-1开始，到r>0结束，r每次递减1
    for (var r = this.RN - 1; r > 0; r--) {
      // 查找r位置c列上方前一个不为0的位置prevr
      var prevr = this.getPrevInCol(r, c);
      // 如果没找到,就退出循环
      if (prevr === -1) {
        break;
      } else {// 否则
        // 如果r位置c列的值为0
        if (this.data[r][c] === 0) {
          // 将prevr位置c列的值赋值给r位置
          this.data[r][c] = this.data[prevr][c];
          // 将prevr位置c列置为0
          this.data[prevr][c] = 0;
          /* r留在原地, 继续与后面元素进行比较合并 */
          r++;
        } else if (this.data[r][c] === this.data[prevr][c]) {// 否则，如果r位置c列的值等于prevr位置的值
          // 将r位置c列的值*2
          this.data[r][c] *= 2;
          // 更新游戏得分
          this.score += this.data[r][c];
          // 将prevr位置c列置为0
          this.data[prevr][c] = 0;
        }
      }
    }
  },
  /**
   * 上移第c行
   * @param c
   */
  moveUpInCol: function (c) {
    // r从0开始,到r<RN-1结束，r每次递增1
    for (var r = 0; r < this.RN - 1; r++) {
      // 查找r行c列下方下一个不为0的位置nextr
      var nextr = this.getNextInCol(r, c);
      // 如果没找到,就退出循环
      if (nextr === -1) {
        break;
      } else { // 否则
        // 如果r位置c列的值为0
        if (this.data[r][c] === 0) {
          // 将nextr位置c列的值赋值给r位置
          this.data[r][c] = this.data[nextr][c];
          // 将nextr位置c列置为0
          this.data[nextr][c] = 0;
          /* r留在原地, 继续与后面元素进行比较合并 */
          r--;
        } else if (this.data[r][c] === this.data[nextr][c]) {// 否则，如果r位置c列的值等于nextr位置的值
          // 将r位置c列的值*2
          this.data[r][c] *= 2;
          // 更新游戏得分
          this.score += this.data[r][c];
          // 将nextr位置c列的值置为0
          this.data[nextr][c] = 0;
        }
      }
    }
  },
  /**
   * 右移第r行
   * @param r
   */
  moveRightInRow: function (r) {
    // c从CN-1开始，到>0结束，反向遍历r行中每个格
    for (var c = this.CN - 1; c > 0; c--) {
      // 找r行c列左侧前一个不为0的位置prevc
      var prevc = this.getPrevInRow(r, c);
      // 如果prevc为-1,就退出循环
      if (prevc === -1) {
        break;
      } else {// 否则
        // 如果c列的值是0
        if (this.data[r][c] === 0) {
          // 将prevc列的值赋值给c列
          this.data[r][c] = this.data[r][prevc];
          // 将prevc列的值置为0
          this.data[r][prevc] = 0;
          /* c留在原地, 继续与后面元素进行比较合并 */
          c++;
        } else if (this.data[r][c] === this.data[r][prevc]) {// 否则 如果c列的值等于prevc列的值
          // 将c列的值*2
          this.data[r][c] *= 2;
          // 更新游戏得分
          this.score += this.data[r][c];
          // 将prevc列置为0
          this.data[r][prevc] = 0;
        }
      }
    }
  },
  /**
   * 左移第r行
   * @param r
   */
  moveLeftInRow: function (r) {
    // c从0开始，到<CN-1结束，遍历r行中每个格
    for (var c = 0; c < this.CN - 1; c++) {
      // 找r行c列右侧下一个不为0的位置nextc
      var nextc = this.getNextInRow(r, c);
      // 如果nextc为-1,就退出循环
      if (nextc === -1) {
        break;
      } else {// 否则
        // 如果c列的值是0
        if (this.data[r][c] === 0) {
          // 将nextc列的值赋值给c列
          this.data[r][c] = this.data[r][nextc];
          // 将nextc列的值置为0
          this.data[r][nextc] = 0;
          /* c留在原地, 继续与后面元素进行比较合并 */
          c--;
        } else if (this.data[r][c] === this.data[r][nextc]) { // 否则 如果c列的值等于nextc列的值
          // 将c列的值*2
          this.data[r][c] *= 2;
          // 更新游戏得分
          this.score += this.data[r][c];
          // 将nextc列置为0
          this.data[r][nextc] = 0;
        }
      }
    }
  },
  /**
   * 找r行c列上侧上一个不为0的位置
   * @param r
   * @param c
   * @returns {*}
   */
  getPrevInCol: function (r, c) {
    // r-1
    r--;
    // 循环，r到>=0结束，每次递减1
    for (; r >= 0; r--) {
      // 如果r位置c列不等于0, 就返回r
      if (this.data[r][c] !== 0) return r;
    }// (遍历结束)
    // 返回-1
    return -1;
  },
  /**
   * 找r行c列下侧下一个不为0的位置
   * @param r
   * @param c
   * @returns {*}
   */
  getNextInCol: function (r, c) {
    // r+1
    r++;
    // 循环，到<RN结束，r每次递增1
    for (; r < this.RN; r++) {
      // 如果r位置c列不等于0, 就返回r
      if (this.data[r][c] !== 0) return r;
    }// (遍历结束)
    // 返回-1
    return -1;
  },
  /**
   * 找r行c列左侧前一个不为0的位置
   * @param r
   * @param c
   * @returns {*}
   */
  getPrevInRow: function (r, c) {
    // c-1
    c--;
    // 从c开始，到>=0结束，反向遍历
    for (; c >= 0; c--) {
      // 如果r行c位置不是0，就返回c
      if (this.data[r][c] !== 0) return c;
    }// (遍历结束)
    // 返回-1
    return -1;
  },
  /**
   * 找r行c列右侧下一个不为0的位置
   * @param r
   * @param c
   * @returns {*}
   */
  getNextInRow: function (r, c) {
    // c+1
    c++;
    // 从c开始，到<CN结束
    for (; c < this.CN; c++) {
      // 如果r行c位置不是0，就返回c
      if (this.data[r][c] !== 0) return c;
    }// (遍历结束)
    // 返回-1
    return -1;
  },
  isGameOver: function () {
    // 遍历data
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN; c++) {
        // 如果当前元素是0或
        // c<this.CN-1且当前元素等于右侧元素或
        // r<this.RN-1且当前元素等于下方元素
        if (this.data[r][c] === 0 ||
          c < this.CN - 1
          && this.data[r][c] === this.data[r][c + 1] ||
          r < this.RN - 1
          && this.data[r][c] === this.data[r + 1][c]) {
          // 就返回false
          return false;
        }
      }
    }// (遍历结束)
    // 返回true
    this.restart();
    return true;
  },
  /**
   * 在data的一个随机位置随机生成一个数字
   */
  randomNum: function () {
    // 反复:
    while (true) {
      // 在0~RN-1之间生成一个随机数r
      var r = Math.floor(Math.random() * this.RN);
      // 在0~CN-1之间生成一个随机数c
      var c = Math.floor(Math.random() * this.CN);
      // 如果data中r行c列为0
      if (this.data[r][c] === 0) {
        // 将data中r行c列的值设置为:
        // 随机生成一个0~1之间的小数，如果<0.5，就取2，否则取4
        this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
        // 退出循环
        break;
      }
    }
  },
  /**
   * 将data中的数据更新到页面
   */
  updateView: function () {
    // 遍历data r c
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN; c++) {
        // 找到页面中id为cXX的div
        var div = document.getElementById('c' + r + c);
        // 如果当前元素不是0
        if (this.data[r][c] !== 0) {
          // 将data中当前元素放入div的内容中
          div.innerHTML = this.data[r][c];
          // 修改div的className属性为"cell n"+当前元素值
          div.className = 'cell n' + this.data[r][c];
        } else { // 否则
          // 清空div的内容
          div.innerHTML = '';
          // 将div的className重置为cell
          div.className = 'cell';
        }
      }
    }
    // 找到id为score的span,设置其内容为score属性 span
    document.getElementById('score').innerHTML = this.score;
    // 找到id为gameOver的div,设置其style的display属性为: 如果游戏状态为GAMEOVER?"block":"none"
    document.getElementById('gameOver').style.display =
      this.state === this.GAMEOVER ? 'block' : 'none';
    // 如果游戏结束，将积分写入计分板
    this.state === this.GAMEOVER &&
    (document.getElementById('final').innerHTML = this.score);
  }
};
/**
 * 启动游戏
 */
game.start();