var game = {
  CSIZE: 26,//格子大小
  OFFSET: 15,//内边距
  pg: null,//容器元素
  shape: null,//主角图形——正在下落的图形
  nextShape: null,//备胎图形
  interval: 200,//下落的时间间隔——游戏速度
  timer: null,//定时器序号
  wall: null,//保存停止下落的方块的墙
  RN: 20, CN: 10,//保存总行数和总列数
  lines: 0,//保存总行数
  score: 0,//保存得分
  SCORES: [0, 10, 30, 60, 120],
  //0  1  2  3  4
  state: 1,//保存游戏状态
  GAMEOVER: 0,//游戏结束
  RUNNING: 1,//运行
  PAUSE: 2,//暂停
  start: function () {//启动游戏
    this.state = this.RUNNING;
    this.lines = 0;
    this.score = 0;
    this.wall = [];//创建空数组保存在wall中
    for (var r = 0; r < this.RN; r++) {//r从0开始到<RN结束
      //设置wall中r行为CN个空元素的数组
      this.wall[r] = new Array(this.CN);
    }
    this.pg =//查找class为playground的元素保存在pg属性
      document.querySelector(".playground");
    this.shape = this.randomShape();//生成主角
    this.nextShape = this.randomShape();//生成备胎
    this.paint();//绘制主角图形
    //启动周期性定时器,设置任务函数为moveDown,间隔为interval,再将序号保存在timer中
    this.timer = setInterval(
      this.moveDown.bind(this), this.interval
    );
    //为document绑定onkeydown
    document.onkeydown = function (e) {
      switch (e.keyCode) {//判断按键号
        case 37: //是37: 就左移
          this.state == this.RUNNING &&
          this.moveLeft();
          break;
        case 39: //是39: 就右移
          this.state == this.RUNNING &&
          this.moveRight();
          break;
        case 40: //是40: 就下落
          this.state == this.RUNNING &&
          this.moveDown();
          break;
        case 32: //是32(空格): 就一落到底
          this.state == this.RUNNING &&
          this.hardDrop();
          break;
        case 38: //是38: 顺时针旋转
          this.state == this.RUNNING &&
          this.rotateR();
          break;
        case 90: //是90(Z): 逆时针旋转
          this.state == this.RUNNING &&
          this.rotateL();
          break;
        case 83: //是83(S): 重启
          this.state == this.GAMEOVER &&
          this.start();
          break;
        case 81: //是81(Q): 放弃
          this.state != this.GAMEOVER &&
          (this.gameOver(), this.paint());
          break;
        case 80: //是80(P): 暂停
          this.state == this.RUNNING &&
          this.pause();
          break;
        case 67: //是67(C): 继续
          this.state == this.PAUSE &&
          this.myContinue();
      }
    }.bind(this);
  },
  myContinue: function () {
    this.timer = setInterval(
      this.moveDown.bind(this), this.interval
    );
    this.state = this.RUNNING;
    this.paint();
  },
  pause: function () {
    //停止定时器,清除timer,修改状态为结束
    clearInterval(this.timer);
    this.timer = null;
    this.state = this.PAUSE;
    this.paint();
  },
  gameOver: function () {
    //停止定时器,清除timer,修改状态为结束
    clearInterval(this.timer);
    this.timer = null;
    this.state = this.GAMEOVER;
  },
  canRotate: function () {
    //遍历shape的每个格子
    for (var i = 0; i < this.shape.cells.length; i++) {
      //将当前格保存在cell中
      var cell = this.shape.cells[i];
      //如果cell的c<0或cell的c>=CN
      if (cell.c < 0 || cell.c >= this.CN
        //或cell的r<0或cell的r>=RN
        || cell.r < 0 || cell.r >= this.RN
        //或wall中和cell相同位置不是undefined
        || this.wall[cell.r][cell.c] !== undefined
      ) {
        return false;//返回false
      }
    }//(遍历结束)
    return true;//返回true
  },
  rotateR: function () {
    this.shape.rotateR();
    //如果不能旋转，就反向再转回来
    if (!this.canRotate()) {
      this.shape.rotateL();
    }
    this.paint();
  },
  rotateL: function () {
    this.shape.rotateL();
    //如果不能旋转，就反向再转回来
    if (!this.canRotate()) {
      this.shape.rotateR();
    }
    this.paint();
  },
  canLeft: function () {
    //遍历shape中每个格
    for (var i = 0; i < this.shape.cells.length; i++) {
      //将当前格保存在cell中
      var cell = this.shape.cells[i];
      //如果cell的c是0或wall中cell左侧不是undefined
      if (cell.c == 0 || this.wall[cell.r][cell.c - 1])
        return false;//返回false
    }//(遍历结束)
    return true;//返回true
  },
  moveLeft: function () {
    if (this.canLeft()) {//如果可以左移
      this.shape.moveLeft();//调用shape的moveLeft
      this.paint();//重绘一切
    }
  },
  canRight: function () {
    //遍历shape中每个格
    for (var i = 0; i < this.shape.cells.length; i++) {
      //将当前格保存在cell中
      var cell = this.shape.cells[i];
      //如果cell的c是CN-1或wall中cell右侧不是undefined
      if (cell.c == this.CN - 1
        || this.wall[cell.r][cell.c + 1])
        return false;//返回false
    }//(遍历结束)
    return true;//返回true
  },
  moveRight: function () {
    if (this.canRight()) {//如果可以右移
      this.shape.moveRight();//调用shape的moveRight
      this.paint();//重绘一切
    }
  },
  paintShape: function () {//绘制主角图形
    var frag =//创建文档片段frag
      document.createDocumentFragment();
    //遍历shape的cells
    for (var i = 0; i < this.shape.cells.length; i++) {
      //将当前cell临时保存在cell变量中
      var cell = this.shape.cells[i];
      this.paintCell(cell, frag);//绘制cell
    }
    this.pg.appendChild(frag);//将frag追加到pg中
  },
  paintCell: function (cell, frag) {//单绘一个格
    var img = new Image();//创建img
    img.src = cell.src;//设置img的src为cell的src
    //设置img的left为OFFSET+cell的c*CSIZE
    img.style.left =
      this.OFFSET + cell.c * this.CSIZE + "px";
    //设置img的top为OFFSET+cell的r*CSIZE
    img.style.top =
      this.OFFSET + cell.r * this.CSIZE + "px";
    frag.appendChild(img);//将img追加到frag中
    return img;
  },
  paint: function () {//重绘一切
    //删除pg内容中所有img
    //替换pg内容中的所有<img[^>]*>为""
    this.pg.innerHTML =
      this.pg.innerHTML.replace(/<img[^>]*>/g, "");
    this.paintShape();//重绘主角
    this.paintWall();//重绘墙
    this.paintNext();//重绘备胎
    this.paintScore();//重绘分数
    this.paintState();//重绘状态
  },
  paintState: function () {//重绘状态
    if (this.state != this.RUNNING) {
      var img = new Image();
      img.src = this.state == this.GAMEOVER ?
        "img/game-over.png" :
        "img/pause.png";
      img.className = "state";
      this.pg.appendChild(img);
    }
  },
  paintScore: function () {
    //找到id为lines的span，设置其内容为lines
    document.getElementById("lines")
      .innerHTML = this.lines;
    //找到id为score的span，设置其内容为score
    document.getElementById("score")
      .innerHTML = this.score;
  },
  paintWall: function () {
    //创建文档片段frag
    var frag = document.createDocumentFragment();
    //自底向上遍历wall
    for (var r = this.RN - 1; r >= 0; r--) {
      //如果r行是空行，就退出循环
      if (this.wall[r].join("") === "") {
        break;
      }
      else {//否则
        for (var c = 0; c < this.CN; c++) {
          //将当前格临时保存在cell中
          var cell = this.wall[r][c];
          if (cell !== undefined) {//跳过空元素
            //调用paintCell，传入cell和frag
            this.paintCell(cell, frag);
          }
        }
      }
    }//(遍历结束)
    this.pg.appendChild(frag);//将frag追加到pg中
  },
  canDown: function () {//判断能否下落
    //遍历shape的cells
    for (var i = 0; i < this.shape.cells.length; i++) {
      //将当前格保存在变量cell中
      var cell = this.shape.cells[i];
      //如果cell的r等于RN-1或
      //wall中cell的下方不是undefined
      //返回false
      if (cell.r == this.RN - 1 ||
        this.wall[cell.r + 1][cell.c] !== undefined) {
        return false;
      }
    }//(遍历结束)
    return true;//返回true
  },
  landIntoWall: function () {//落到墙里
    //遍历shape的cells
    for (var i = 0; i < this.shape.cells.length; i++) {
      //将当前格保存在变量cell中
      var cell = this.shape.cells[i];
      //将cell放入wall中和cell相同的位置
      this.wall[cell.r][cell.c] = cell;
    }
  },
  moveDown: function () {//下落一步
    if (this.canDown()) {//如果可以下落
      this.shape.moveDown();//调用shape的moveDown  
    } else {//否则,停止下落
      this.landIntoWall();//落到墙里
      var ln = this.deleteRows()//删除满格行
      this.lines += ln;
      this.score += this.SCORES[ln];
      //如果游戏结束
      if (this.isGameOver()) {
        this.gameOver();
      } else {//否则
        this.shape = this.nextShape;//备胎转正
        //生成新备胎
        this.nextShape = this.randomShape();
      }
    }
    this.paint();//重绘主角
  },
  isGameOver: function () {//判断游戏结束
    //遍历nextShape中每个cell
    for (var i = 0; i < this.nextShape.cells.length; i++) {
      var cell = this.nextShape.cells[i];
      //如果wall中和cell相同位置有格
      if (this.wall[cell.r][cell.c])
        return true;//返回true
    }//(遍历结束)
    return false;//返回false
  },
  randomShape: function () {//随机生成图形
    //在0~2之间生成一个随机数
    switch (Math.floor(Math.random() * 3)) {
      //是0，就返回一个新的O对象
      case 0:
        return new O();
      //是1，就返回一个新的I对象
      case 1:
        return new I();
      //是2，就返回一个新的T对象
      case 2:
        return new T();
    }
  },
  paintNext: function () {
    var frag =//创建文档片段frag
      document.createDocumentFragment();
    //遍历nextShape的cells
    for (var i = 0; i < this.nextShape.cells.length; i++) {
      //将当前cell临时保存在cell变量中
      var cell = this.nextShape.cells[i];
      var img = this.paintCell(cell, frag);//绘制cell
      //获得img的style的left,转为浮点数保存在left中
      var left = parseFloat(img.style.left);
      //获得img的style的top，转为浮点数保存在top
      var top = parseFloat(img.style.top);
      //设置img的style的left=left+10*CSIZE
      img.style.left = left + 10 * this.CSIZE + "px";
      //设置img的style的top=top+CSIZE
      img.style.top = top + this.CSIZE + "px";
    }
    this.pg.appendChild(frag);//将frag追加到pg中
  },
  hardDrop: function () {//一落到底
    //只要可以下落就反复调用moveDown
    while (this.canDown()) {
      this.moveDown();
    }
  },
  deleteRows: function () {//删除所有满格行
    //自底向上遍历wall中每一行,声明ln=0
    for (var r = this.RN - 1, ln = 0; r >= 0; r--) {
      //如果当前行是空行,就退出循环
      if (this.wall[r].join("") === "") {
        break;
      }
      //定义正则reg: 开头,或,,或,结尾
      //如果用reg检测当前行转为字符串的结果 未通过
      if (!/^,|,,|,$/.test(String(this.wall[r]))) {
        this.deleteRow(r);//就删除当前行
        //先将ln+1，再如果ln等于4,就break
        if (++ln == 4) {
          break;
        }
        r++;//r留在原地
      }
    }//(遍历结束)
    return ln;//返回ln
  },
  deleteRow: function (r) {//删除第r行
    //从r开始自底向上遍历wall
    for (; r >= 0; r--) {
      //复制wall中r-1行给r行
      this.wall[r] = this.wall[r - 1].slice();
      //如果wall中r-1行是空行,就退出循环
      if (this.wall[r - 1].join("") === "") {
        break;
      }
      else {//否则
        //将wall中r-1行重置为CN个空元素的数组
        this.wall[r - 1] = new Array(this.CN);
        //遍历wall中r行的每个格
        for (var c = 0; c < this.CN; c++) {
          //如果当前格不是undefined，就将当前格的r+1
          this.wall[r][c] && (this.wall[r][c].r++);
        }
      }
    }
  }
}
game.start();