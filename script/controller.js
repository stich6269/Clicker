function Controller (){
    this.model = null;
    this.drawer = null;
    this.static = null;

    this.initGame();
    this.listener = null;
    this.intervalId = null;
}


Controller.prototype.initGame = function () {
    var self = this;

    this.model = new Model();
    this.model.field = new Field();
    this.static = new Static();
    this.drawer = new Drawer(this.model.field);
    this.static.rest = this.model.field.column*this.model.field.rows;

    this.model.createCells();
    this.drawer.createGame();
    this.drawer.reDrawCells(self.model.field.cellsArr);
    this.drawer.drawStatic();


    this.listener = function(evt){
        var x,
            y,
            cell,
            markCellArr,
            rect,
            minCellsSet;

        rect = this.getBoundingClientRect();
        x = Math.floor((evt.clientX - rect.left) / self.drawer.cellSide);
        y = self.model.field.rows-1 - Math.floor((evt.clientY - rect.top) / self.drawer.cellSide);

        minCellsSet = self.model.field.minCellSet;
        cell = self.model.field.cellsArr[x][y];
        self.startIntervalTimer();

        if(cell){
            markCellArr = self.model.markTheSameColorCells(cell, self.model.field.cellsArr, true);
            self.model.updateCellArr(markCellArr);
            self.drawer.reDrawCells(self.model.field.cellsArr);
            self.static.countingStatic(markCellArr.length);
            self.drawer.updateStatistic(self.static);
            if(!self.model.availableForNewMoves(self.model.field.cellsArr, minCellsSet)){
                self.startNewGame();
            }
        }
    };
    this.drawer.canvasElem.addEventListener('click', this.listener);
};


Controller.prototype.startIntervalTimer = function () {
    var self = this;

    if (!this.intervalId){
        this.intervalId = setInterval(function(){
            self.static.time++;
            self.drawer.updateStatistic(self.static);
        }, 1000)
    }
};

Controller.prototype.startNewGame = function () {
    this.drawer.canvasElem.removeEventListener('click', this.listener);
    clearInterval(this.intervalId);
    this.intervalId = null;

    if(confirm('Start again?')){
        this.initGame();
    }
};


function Static(){
    this.time = 0;
    this.count = 0;
    this.maxDestroy = 0;
    this.dellCells = 0;
    this.rest = 0;
    this.message = null;
    this.bonus = {
        3:{min:3, max:4, mul:1, message:'Very simple step! count*X1'},
        5:{min:5, max:8, mul:1.1, message:'Simple step! count * X1.1'},
        9:{min:9, max:14, mul:1.2, message:'Good step! count * X1.1'},
        15:{min:15, max:19, mul:1.3, message:'Nice step! count * X1.2'},
        20:{min:20, max:24, mul:1.4, message:'Perfect step! count * X1.3'},
        25:{min:25, max:1000, mul:1.5, message:'You are crazy! count * X1.4'}
    };
}

Static.prototype.countingStatic = function (dellCellsCount) {
    var bonuses = this.bonus,
        level;


    console.log(this.maxDestroy, dellCellsCount, Math.max(this.maxDestroy, dellCellsCount));
    for (var key in bonuses) {
        if(bonuses.hasOwnProperty(key)){
            level = bonuses[key];
            if(level.min <= dellCellsCount && dellCellsCount <= level.max){
                this.rest -= dellCellsCount;
                this.dellCells += dellCellsCount;
                this.count += Math.round(level.mul * dellCellsCount);
                this.maxDestroy = Math.max(this.maxDestroy, dellCellsCount);
                this.message = level.message;
            }
        }
    }
};
