function Cell(r, c, src) {
  this.r = r;
  this.c = c;
  this.src = src;
}

function Shape(rcs, src, states, orgi) {
  this.cells = [];
  for (var i = 0; i < 4; i++) {
    this.cells.push(new Cell(rcs[2 * i], rcs[2 * i + 1], src));
  }

  this.states = states; // 所有状态的数组
  this.orgCell = this.cells[orgi]; // 参照格
  this.statei = 0;  // 旋转状态
}

function State(arr) {
  for (var i = 0; i < 4; i++) {
    this['r' + i] = arr[2 * i];
    this['c' + i] = arr[2 * i + 1];
  }
}

Shape.prototype = {
  IMGS: {T: "img/T.png", O: "img/O.png", I: "img/I.png"},
  moveDown: function () {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].r++;
    }
  },
  moveLeft: function () {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].c--;
    }
  },
  moveRight: function () {
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].c++;
    }
  },
  rotateR: function () { // 0 1 2 3...
    this.statei++;
    if (this.statei === this.states.length) this.statei = 0;
    this.rotate();
  },
  rotateL: function () { // ...3 2 1 0
    this.statei--;
    if (this.statei < 0) this.statei = this.states.length - 1;
    this.rotate();
  },
  rotate: function () {
    var state = this.states[this.statei];
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];
      cell.r = this.orgCell.r + state['r' + i];
      cell.c = this.orgCell.c + state['c' + i];
    }
  },
};

function T() {
  Shape.call(this, [0, 3, 0, 4, 0, 5, 1, 4], this.IMGS.T,
    [
      new State([0, -1, 0, 0, 0, +1, +1, 0]),
      new State([-1, 0, 0, 0, +1, 0, 0, -1]),
      new State([0, +1, 0, 0, 0, -1, -1, 0]),
      new State([+1, 0, 0, 0, -1, 0, 0, +1]),
    ],
    1
  );
}

Object.setPrototypeOf(T.prototype, Shape.prototype);

function O() {
  Shape.call(this, [0, 4, 0, 5, 1, 4, 1, 5], this.IMGS.O,
    [new State([0, -1, 0, 0, +1, -1, +1, 0])],
    1);
}

Object.setPrototypeOf(O.prototype, Shape.prototype);

function I() {
  Shape.call(this, [0, 3, 0, 4, 0, 5, 0, 6], this.IMGS.I,
    [
      new State([0, -1, 0, 0, 0, +1, 0, +2]),
      new State([-1, 0, 0, 0, +1, 0, +2, 0])
    ],
    1
  );
}

Object.setPrototypeOf(I.prototype, Shape.prototype);
