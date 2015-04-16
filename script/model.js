function Model (){
    this.field = null;
}

function Field () {
    this.rows = 30;
    this.column = 20;
    this.minCellSet = 3;
    this.cellsArr = [];
    this.cellColorsAmount = 2;
}

function Cell (x, y, colorsAmount){
    this.x = x;
    this.y = y;
    this.color = null;
    this.clear = false;
    this.color = this.getRndColor(colorsAmount);
}

Cell.prototype.colorArr = [
    'Red',
    'Gold',
    'Blue',
    'Green',
    'Beige',
    'BlueViolet'
];

Cell.prototype.getRndColor = function (colorsAmount) {
    var rndColorNumber;

    if(colorsAmount > this.colorArr.length){
        colorsAmount = colorsAmount % this.colorArr.length
    }

    rndColorNumber = Math.floor(Math.random() * colorsAmount);
    return this.colorArr[rndColorNumber];
};


Model.prototype.createCells = function () {
    var cell,
        column;

    for (var x = 0; x < this.field.column; x++) {
        column = [];
        for (var y = 0; y < this.field.rows; y++) {
            cell = new Cell(x, y, this.field.cellColorsAmount);
            column.push(cell);
        }
        this.field.cellsArr.push(column);
    }
};

Model.prototype.markTheSameColorCells = function (cell, cellArr) {
    var color = cell.color,
        self = this,
        arrCell,
        cellToCheck,
        markCellsArr = [],
        neighbors = {
            top:[0, 1],
            left:[-1, 0],
            right: [1, 0],
            bottom: [0, -1]
        },
        newX,
        newY,
        sameColorSiblingFound;

    markCellsArr.push(cell);
    sameColorSiblingFound = true;

    while (sameColorSiblingFound) {
        sameColorSiblingFound = false;

        for (var i = 0; i < markCellsArr.length; i++) {
            arrCell = markCellsArr[i];
            arrCell.clear = true;

            for (var key in neighbors) {
                if(neighbors.hasOwnProperty(key)) {
                    newX = arrCell.x + neighbors[key][0];
                    newY = arrCell.y + neighbors[key][1];

                    if (!self.isOutsideGameField(newX, newY)){
                        cellToCheck = cellArr[newX][newY];
                        if (cellToCheck){

                            if(cellToCheck.color === color && !cellToCheck.clear){
                                cellToCheck.clear = true;
                                sameColorSiblingFound = true;
                                markCellsArr.push(cellToCheck);
                            }
                        }
                    }
                }
            }
        }
    }
    for (var k = 0; k < markCellsArr.length; k++) {
        markCellsArr[k].clear = false;
    }
    return markCellsArr
};

Model.prototype.updateCellArr = function (markCellArr) {
    var minDestroyCell = this.field.minCellSet,
        dellCellsCount = markCellArr.length,
        newCellsArr;

    if(dellCellsCount >= minDestroyCell){
        newCellsArr = this.getUpdateCellArr(markCellArr, this.field.cellsArr);
        this.field.cellsArr = newCellsArr;
    }
};

Model.prototype.getUpdateCellArr = function (markCellArr, cellArr) {
    var columnCount = cellArr.length,
        column,
        cell,
        newCellArr = [],
        newColumnArr = [],
        newCellsYPosition = 0;

    for (var x = 0; x < columnCount; x++) {
        column = this.field.cellsArr[x];
        newColumnArr = [];
        newCellsYPosition = 0;

        for (var y = 0; y < column.length; y++) {
            cell = this.field.cellsArr[x][y];

            if (markCellArr.indexOf(cell) < 0){
                cell.y = newCellsYPosition++;
                newColumnArr.push(cell);
            }
        }
        newCellArr.push(newColumnArr);
    }
    return newCellArr;
};


Model.prototype.availableForNewMoves = function (cellArr, minCellsSet) {
    var cell,
        sameColorGroup,
        checkSameColorGroupLength;

    for (var i = 0; i <  cellArr.length; i++) {
        for (var j = 0; j < cellArr[i].length; j++) {
            cell = cellArr[i][j];
            sameColorGroup = this.markTheSameColorCells(cell, cellArr);
            if(sameColorGroup.length >= minCellsSet){
                checkSameColorGroupLength =  true;
            }
        }
    }
    return checkSameColorGroupLength;

};

Model.prototype.isOutsideGameField = function (x, y) {
    var top = 0,
        left = 0,
        right = this.field.column-1,
        bottom = this.field.rows-1;
    return x > right || x < left || y > bottom || y < top;
};