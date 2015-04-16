function Drawer(field){
    this.field = field;
    this.cellSide = 20;
    this.canvasWidth = this.cellSide * this.field.column;
    this.canvasHeight  = this.cellSide * this.field.rows;
    this.canvasElem = null;

    this.statisticElements = {
        time: null,
        count: null,
        rest: null,
        dellCells: null,
        maxDestroy: null,
        message:null
    }

}

Drawer.prototype.createCanvas = function(containerElem){
    this.canvasElem = document.createElement('CANVAS');
    this.canvasElem.width =  this.canvasWidth;
    this.canvasElem.height = this.canvasHeight;
    this.canvasElem.id = 'clicker';
    containerElem.appendChild(this.canvasElem);
};

Drawer.prototype.createGame = function () {
    var parentElem,
        containerElem,
        staticElem;

    if (!!document.getElementById('wrapper')){
        containerElem = document.getElementById('wrapper');
        containerElem.innerHTML = '';
        this.createCanvas(containerElem);
    }else {
        parentElem = document.getElementsByTagName('body')[0];
        containerElem = document.createElement('DIV');
        containerElem.id = 'wrapper';
        parentElem.appendChild(containerElem);
        this.createCanvas(containerElem);

        staticElem = document.createElement('DIV');
        staticElem.id = 'static';
        containerElem.appendChild(staticElem);

    }
};

Drawer.prototype.reDrawCells = function (arr) {
    var ctx = this.canvasElem.getContext('2d'),
        column,
        cell;


    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (var x = 0; x < this.field.column; x++) {
        column = arr[x];
        for (var y = 1; y <= this.field.rows; y++) {
            cell = column[y-1];
            if (cell){
                ctx.fillStyle = cell.color;
                ctx.fillRect(
                    x * this.cellSide,
                    (this.field.rows - y) * this.cellSide,
                    this.cellSide,
                    this.cellSide
                )
            }
        }

    }
};


Drawer.prototype.drawStatic = function () {
    var parentElement = document.getElementById('static'),
        ulElem,
        liElem;

    ulElem = document.createElement('UL');
    ulElem.id = 'static_list';

    for (var key in this.statisticElements) {
        if(this.statisticElements.hasOwnProperty(key)){
            liElem = document.createElement('LI');
            liElem.innerHTML = key;
            ulElem.appendChild(liElem);

            liElem = document.createElement('LI');
            liElem.id = key;
            liElem.innerHTML = 0;
            ulElem.appendChild(liElem);
            this.statisticElements[key] = liElem;
        }
    }
console.log(this.statisticElements);
    parentElement.appendChild(ulElem);
};


Drawer.prototype.updateStatistic = function (statistic) {
    var domElem;

    for (var key in this.statisticElements) {
        if(this.statisticElements.hasOwnProperty(key)){
            domElem = this.statisticElements[key];
            domElem.innerHTML = statistic[key];
        }
    }
};








