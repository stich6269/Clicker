function Controller (){
    this.model = new Model();
    this.drawer = new Drawer(this.model.field);

    this.initialGame();
    this.listener = null;
    this.intervalId = null;
}

Controller.prototype.initialGame = function () {
    this.model.static = new Static();
    this.model.static.rest = this.model.field.column*this.model.field.rows;

    var self = this;
    this.model.createCells();
    this.drawer.createGame();
    this.drawer.reDrawCells(self.model.cellsArr);
    this.drawer.drawStatic();


    this.listener = function(evt){
        var x,
            y,
            cell,
            rect = this.getBoundingClientRect();

        x = Math.floor((evt.clientX - rect.left) / self.drawer.cellSide);
        y = self.model.field.rows-1 - Math.floor((evt.clientY - rect.top) / self.drawer.cellSide);
        self.startIntervalTimer();

        cell = self.model.findCell(x, y);
        if(cell){
            self.model.markTheSameCell(cell);
            self.model.updateCellArr();
            self.drawer.reDrawCells(self.model.cellsArr);
            self.drawer.updateStatistic(self.model.static);
        }
    };
    this.drawer.canvasElem.addEventListener('click', this.listener)
};


Controller.prototype.startIntervalTimer = function () {
    var self = this;

    if (!this.intervalId){
        this.intervalId = setInterval(function(){
            self.model.static.time++;
            self.drawer.updateStatistic(self.model.static);
        }, 1000)
    }
};