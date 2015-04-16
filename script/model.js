function Model (){
    this.field = new Field();
    this.static = null;
    this.cellsArr = [];
    this.colorArr = ['Blue',
        'red',
        'Gold'];
    this.markCellsForStep = 0;
}

function Field () {
    this.rows = 30;
    this.column = 20;
    this.minCellSet = 3;
}

function Cell (){
    this.x = null;
    this.y = null;
    this.color = null;
    this.clear = false;
}

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
        25:{min:25, max:70, mul:1.5, message:'You are crazy! count * X1.4'}
    };
}

Model.prototype.countingStatic = function () {
    var message,
        dellCell = this.markCellsForStep,
        bonuses = this.static.bonus,
        level;

    for (var key in bonuses) {
        if(bonuses.hasOwnProperty(key)){
            level = bonuses[key];
            if(level.min <= dellCell && dellCell <= level.max){
                this.static.rest -= dellCell;
                this.static.dellCells += dellCell;
                this.static.count += Math.round(level.mul*dellCell);
                this.static.maxDestroy = Math.max(this.static.maxDestroy, dellCell);
                this.static.message = level.message;
                message = level.message;
            }
        }
    }
};


Model.prototype.createCells = function () {
    var cell,
        column;

    for (var x = 0; x < this.field.column; x++) {
        column = [];
        for (var y = 0; y < this.field.rows; y++) {
            cell = new Cell();
            cell.x = x;
            cell.y = y;
            cell.color = this.getRndColor();
            column.push(cell);
        }
        this.cellsArr.push(column);
    }
};

Model.prototype.findCell = function (x, y) {
    var cell,
        column = [],
        max = this.cellsArr.length;

    for (var i = 0; i < max; i++) {
        column = this.cellsArr[i];
        for (var j = 0; j < column.length; j++) {
            cell = this.cellsArr[i][j];
            if (cell.x == x && cell.y == y){
                return cell;
            }
        }

    }
};


Model.prototype.markTheSameCell = function (cell) {
    var color = cell.color,
        self = this,
        arrCell,
        checkCell,
        markArr = [],
        neighbors = {
            top:[0, 1],
            left:[-1, 0],
            right: [1, 0],
            bottom: [0, -1]
        },
        newX,
        newY,
        sameColorSiblingFound;

    markArr.push(cell);
    sameColorSiblingFound = true;

    while (sameColorSiblingFound) {
        sameColorSiblingFound = false;

        for (var i = 0; i < markArr.length; i++) {
            arrCell = markArr[i];
            arrCell.clear = true;

            for (var key in neighbors) {
                if(neighbors.hasOwnProperty(key)) {
                    newX = arrCell.x + neighbors[key][0];
                    newY = arrCell.y + neighbors[key][1];

                    if (!self.isLeaveField(newX, newY)){
                        checkCell = this.cellsArr[newX][newY];

                        if (checkCell){
                            if(checkCell.color === color && !checkCell.clear){
                                sameColorSiblingFound = true;
                                checkCell.clear = true;
                                markArr.push(checkCell);
                            }
                        }
                    }
                }
            }

        }
    }
};

Model.prototype.updateCellArr = function () {
    var columnCount = this.cellsArr.length,
        column,
        cell,
        newCellArr = [],
        newColumnArr = [],
        columnCellCount = 0;

    for (var x = 0; x < columnCount; x++) {
        column = this.cellsArr[x];
        newColumnArr = [];
        columnCellCount = 0;
        for (var y = 0; y < column.length; y++) {
            cell = this.cellsArr[x][y];
            if (!cell.clear){
                cell.y = columnCellCount++;
                newColumnArr.push(cell);
            }else {
                this.markCellsForStep++;
            }
        }
        newCellArr.push(newColumnArr);
    }


    if(this.markCellsForStep >= this.field.minCellSet){
        this.cellsArr = newCellArr;
        this.countingStatic();
    }else{
        for (var i = 0; i <  this.cellsArr.length; i++) {
            for (var j = 0; j < this.cellsArr[i].length; j++) {
                this.cellsArr[i][j].clear = false;
            }

        }
    }
    this.markCellsForStep = 0;
};


Model.prototype.isLeaveField = function (x, y) {
    var top = 0,
        left = 0,
        right = this.field.column-1,
        bottom = this.field.rows-1;
    return x > right || x < left || y > bottom || y < top;
};

Model.prototype.getRndColor = function () {
    var rndColorNumber;

    rndColorNumber = Math.floor(Math.random() * this.colorArr.length);
    return this.colorArr[rndColorNumber];
};
