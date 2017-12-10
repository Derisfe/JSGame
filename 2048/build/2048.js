var game = {
  data:         [],
  RN:           4,
  CN:           4,
  score:        0,
  state:        1,
  RUNNING:      1,
  GAMEOVER:     0,
  start: function () {
    this.state = this.RUNNING;
    this.score = 0;
    for (var r = 0; r < this.RN; r++) {
      this.data.push([]);
      for (var c = 0; c < this.CN; c++) {
        this.data[r][c] = 0;
      }
    }
    this.randomNum();
    this.randomNum();
    this.updateView();
    document.onkeydown = function (e) {
      if (this.state === this.RUNNING)
        switch (e.keyCode) {
          case 37:
            this.moveLeft();
            break;
          case 38:
            this.moveUp();
            break;
          case 39:
            this.moveRight();
            break;
          case 40:
            this.moveDown();
            break;
          default:
            break;
        }
    }.bind(this);
  },
  restart: function () {
    document.getElementById('btn').onclick = function () {
      this.start();
    }.bind(this);
  },
  move: function (callback) {
    var before = String(this.data);
    callback.call(this);
    var after = String(this.data);
    if (before !== after) {
      this.randomNum();
      this.isGameOver() && (this.state = this.GAMEOVER);
      this.updateView();
    }
  },
  moveDown: function () {
    this.move(function () {
      for (var c = 0; c < this.CN; c++) {
        this.moveDownInCol(c);
      }
    });
  },
  moveUp: function () {
    this.move(function () {
      for (var c = 0; c < this.CN; c++) {
        this.moveUpInCol(c);
      }
    });
  },
  moveRight: function () {
    this.move(function () {
      for (var r = 0; r < this.RN; r++) {
        this.moveRightInRow(r);
      }
    })
  },
  moveLeft: function () {
    this.move(function () {
      for (var r = 0; r < this.RN; r++) {
        this.moveLeftInRow(r);
      }
    });
  },
  moveDownInCol: function (c) {
    for (var r = this.RN - 1; r > 0; r--) {
      var prevr = this.getPrevInCol(r, c);
      if (prevr === -1) {
        break;
      } else {
        if (this.data[r][c] === 0) {
          this.data[r][c] = this.data[prevr][c];
          this.data[prevr][c] = 0;
          r++;
        } else if (this.data[r][c] === this.data[prevr][c]) {
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          this.data[prevr][c] = 0;
        }
      }
    }
  },
  moveUpInCol: function (c) {
    for (var r = 0; r < this.RN - 1; r++) {
      var nextr = this.getNextInCol(r, c);
      if (nextr === -1) {
        break;
      } else {
        if (this.data[r][c] === 0) {
          this.data[r][c] = this.data[nextr][c];
          this.data[nextr][c] = 0;
          r--;
        } else if (this.data[r][c] === this.data[nextr][c]) {
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          this.data[nextr][c] = 0;
        }
      }
    }
  },
  moveRightInRow: function (r) {
    for (var c = this.CN - 1; c > 0; c--) {
      var prevc = this.getPrevInRow(r, c);
      if (prevc === -1) {
        break;
      } else {
        if (this.data[r][c] === 0) {
          this.data[r][c] = this.data[r][prevc];
          this.data[r][prevc] = 0;
          c++;
        } else if (this.data[r][c] === this.data[r][prevc]) {
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          this.data[r][prevc] = 0;
        }
      }
    }

  },
  moveLeftInRow: function (r) {
    for (var c = 0; c < this.CN - 1; c++) {
      var nextc = this.getNextInRow(r, c);
      if (nextc === -1) {
        break;
      } else {
        if (this.data[r][c] === 0) {
          this.data[r][c] = this.data[r][nextc];
          this.data[r][nextc] = 0;
          c--;
        } else if (this.data[r][c] === this.data[r][nextc]) {
          this.data[r][c] *= 2;
          this.score += this.data[r][c];
          this.data[r][nextc] = 0;
        }
      }
    }
  },
  getPrevInCol: function (r, c) {
    r--;
    for (; r >= 0; r--) {
      if (this.data[r][c] !== 0) return r;
    }
    return -1;
  },
  getNextInCol: function (r, c) {
    r++;
    for (; r < this.RN; r++) {
      if (this.data[r][c] !== 0) return r;
    }
    return -1;
  },
  getPrevInRow: function (r, c) {
    c--;
    for (; c >= 0; c--) {
      if (this.data[r][c] !== 0) return c;
    }
    return -1;
  },
  getNextInRow: function (r, c) {
    c++;
    for (; c < this.CN; c++) {
      if (this.data[r][c] !== 0) return c;
    }
    return -1;
  },
  isGameOver: function () {
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN; c++) {
        if (this.data[r][c] === 0 ||
          r < this.RN - 1 && (this.data[r][c] === this.data[r + 1][c]) ||
          c < this.CN - 1 && (this.data[r][c] === this.data[r][c + 1])
        ) {
          return false;
        }
      }
    }
    this.restart();
    return true;
  },
  updateView: function () {
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN; c++) {
        var div = document.getElementById('c' + r + c);
        if (this.data[r][c] !== 0) {
          div.innerHTML = this.data[r][c];
          div.className = 'cell n' + this.data[r][c];
        } else {
          div.innerHTML = '';
          div.className = 'cell';
        }
      }
    }
    document.getElementById('score').innerHTML = this.score;
    document.getElementById('gameOver').style.display = this.state === this.GAMEOVER ? 'block' : 'none';
    this.state === this.GAMEOVER && (document.getElementById('final').innerHTML = this.score);
  },
  randomNum: function () {
    while (true) {
      var r = Math.floor(Math.random() * this.RN);
      var c = Math.floor(Math.random() * this.CN);
      if (this.data[r][c] === 0) {
        this.data[r][c] = Math.random() > 0.5 ? 2 : 4;
        break;
      }
    }
  }
};

game.start();