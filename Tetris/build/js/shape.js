function Cell(r, c, src) {
  this.r = r;
  this.c = c;
  this.src = src;
}

function Shape(rcs, src) {
  this.cells = [];
  for (var i = 0; i < 4; i++) {
    this.cells.push(new Cell(rcs[2 * i], rcs[2 * i + 1], src));
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
  }
};

function T() {
  Shape.call(this, [0, 3, 0, 4, 0, 5, 1, 4], this.IMGS.T);
}

Object.setPrototypeOf(T.prototype, Shape.prototype);

function O() {
  Shape.call(this, [0, 4, 0, 5, 1, 4, 1, 5], this.IMGS.O);
}

Object.setPrototypeOf(O.prototype, Shape.prototype);

function I() {
  Shape.call(this, [0, 3, 0, 4, 0, 5, 0, 6], this.IMGS.I);
}

Object.setPrototypeOf(I.prototype, Shape.prototype);
