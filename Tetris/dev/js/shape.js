//Step1: 定义Cell类型描述格子对象统一的结构
function Cell(r, c) {
  this.r = r;
  this.c = c;
  this.src = "";
}

//描述状态对象的数据结构
function State(r0, c0, r1, c1, r2, c2, r3, c3) {
  this.r0 = r0;
  this.c0 = c0;
  this.r1 = r1;
  this.c1 = c1;
  this.r2 = r2;
  this.c2 = c2;
  this.r3 = r3;
  this.c3 = c3;
}

//Step2: 抽象公共父类型Shape
function Shape(r0, c0, r1, c1, r2, c2, r3, c3, src, states, orgi) {
  this.cells = [new Cell(r0, c0), new Cell(r1, c1),
    new Cell(r2, c2), new Cell(r3, c3)];
  for (var i = 0; i < this.cells.length; i++) {
    this.cells[i].src = src;
  }
  this.states = states;
  this.orgCell = this.cells[orgi];
  this.statei = 0;//当前旋转状态，默认都是0
}

//定义父类型原型对象封装公共的方法
Shape.prototype = {
  IMG: {
    T: "img/T.png", O: "img/O.png", I: "img/I.png"
  },
  moveDown:function() {//this->当前图形
    //遍历当前图形的cells
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].r++;//将当前cell的r+1
    }
  },
  moveLeft:function() {//this->当前图形
    //遍历当前图形的cells
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].c--;//将当前cell的c-1
    }
  },
  moveRight:function() {//this->当前图形
    //遍历当前图形的cells
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].c++;//将当前cell的c+1
    }
  },
  rotateR:function() {//顺时针旋转
    //将当前图形的statei+1
    this.statei++;
    //如果statei>=当前图形的states的length,就改回0
    if (this.statei == this.states.length) {
      this.statei = 0;
    }
    this.rotate();
  },
  rotate:function() {
    //获得当前对象states数组中statei位置的对象，保存在state中
    var state = this.states[this.statei];
    //遍历当前图形的cells //i=0
    for (var i = 0; i < this.cells.length; i++) {
      //将当前cell保存在cell中
      var cell = this.cells[i];
      //修改cell的r为orgCell.r+state的ri
      cell.r = this.orgCell.r + state['r' + i];
      //修改cell的c为orgCell.c+state的ci
      cell.c = this.orgCell.c + state['c' + i];
    }
  },
  rotateL:function() {//逆时针旋转
    this.statei--;//将当前图形的statei-1
    //如果statei<0,就改回states的length-1
    if (this.statei < 0) {
      this.statei = this.states.length - 1;
    }
    this.rotate();
  },
}

//Step3:定义具体图形类型描述所有图形的数据结构
function T() {//借用Shape()
  Shape.call(this,
    0, 3, 0, 4, 0, 5, 1, 4,
    this.IMG.T,
    [
      new State(0, -1, 0, 0, 0, +1, +1, 0),
      new State(-1, 0, 0, 0, +1, 0, 0, -1),
      new State(0, +1, 0, 0, 0, -1, -1, 0),
      new State(+1, 0, 0, 0, -1, 0, 0, +1),
    ],
    1
  );
}

//设置子类型原型对象继承父类型原型对象
Object.setPrototypeOf(
  T.prototype, Shape.prototype
);

//定义O类型描述所有O图形的数据结构
function O() {//借用Shape()
  Shape.call(this,
    0, 4, 0, 5, 1, 4, 1, 5,
    this.IMG.O,
    [new State(0, -1, 0, 0, +1, -1, +1, 0)],
    1
  );
}

Object.setPrototypeOf(
  O.prototype, Shape.prototype
);

function I() {//借用Shape()
  Shape.call(this,
    0, 3, 0, 4, 0, 5, 0, 6,
    this.IMG.I,
    [
      new State(0, -1, 0, 0, 0, +1, 0, +2),
      new State(-1, 0, 0, 0, +1, 0, +2, 0)
    ],
    1
  );
}

Object.setPrototypeOf(
  I.prototype, Shape.prototype
);
/*
                 orgi:  states
	S  04 05 13 14   3       2
	Z  03 04 14 15   2       2
	L  03 04 05 13   1       4
	J  03 04 05 15   1       4
*/