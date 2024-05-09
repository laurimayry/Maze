//import { Cell } from './Cell'; // Varmista, että Cell-luokka on tuotu oikein
// Luo canvas-elementti
var canvas = document.createElement('canvas');
canvas.width = 400; // Aseta leveys
canvas.height = 400; // Aseta korkeus
// Lisää canvas HTML-sivulle
document.body.appendChild(canvas);
// Hae 2D-konteksti
var ctx = canvas.getContext('2d');
// Määritä ruudukon koko
var rows = 10;
var cols = 10;
var cellSize = canvas.width / cols;
//Määritä tämän hetkinen solu
var Cell = /** @class */ (function () {
    function Cell(i, j) {
        this.i = i;
        this.j = j;
        this.walls = ['top', 'right', 'bottom', 'left'];
        this.visited = false;
    }
    Cell.prototype.draw = function (ctx, cellSize, color) {
        var x = this.j * cellSize;
        var y = this.i * cellSize;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeStyle = 'black'; // Aseta seinän väri
        if (this.walls[0].length > 0) { // Tarkista yläseinä
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (this.walls[1].length > 0) { // Tarkista oikea seinä
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (this.walls[2].length > 0) { // Tarkista alaseinä
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y + cellSize);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
        if (this.walls[3].length > 0) { // Tarkista vasen seinä
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        //ctx.strokeRect(x, y, cellSize, cellSize);
    };
    //Katso naapurisolut, ja valitse satunnaisesti joku olemassa olevista naapureista
    Cell.prototype.checkNeighbors = function () {
        var neighbors = [];
        //Tarkista, että naapurisolu on ruudukon sisäpuolella ja lisää se neighbors listaan, jos siellä ei olla vierailtu vielä
        //TOP
        if (this.i > 0) {
            var top_1 = grid[this.i - 1][this.j];
            if (top_1 && !top_1.visited) {
                neighbors.push(top_1);
            }
        }
        //RIGHT
        if (this.j < cols - 1) {
            var right = grid[this.i][this.j + 1];
            if (right && !right.visited) {
                neighbors.push(right);
            }
        }
        //BOTTOM
        if (this.i < rows - 1) {
            var bottom = grid[this.i + 1][this.j];
            if (bottom && !bottom.visited) {
                neighbors.push(bottom);
            }
        }
        //LEFT
        if (this.j > 0) {
            var left = grid[this.i][this.j - 1];
            if (left && !left.visited) {
                neighbors.push(left);
            }
        }
        //console.log(neighbors)
        // Valitse satunnaisesti naapuri neighbors listasta
        if (neighbors.length > 0) {
            var randomIndex = Math.floor(Math.random() * neighbors.length);
            var randomNeighbor = neighbors[randomIndex];
            //console.log("Satunnainen naapuri:", randomNeighbor);
            //Palauta random naapurisolu
            return randomNeighbor;
        }
    };
    return Cell;
}());
// Luodaan solut ja tallennetaan ne taulukkoon
var grid = [];
for (var i = 0; i < rows; i++) {
    grid[i] = [];
    for (var j = 0; j < cols; j++) {
        grid[i][j] = new Cell(i, j);
    }
}
//Määritä aloituspiste ja merkkaa se vierailtuksi
function depthFirstSearch(current, delay) {
    setTimeout(function () {
        current.visited = true;
        drawGrid();
        //Valitsee satunnaisen naapurin
        var next = current.checkNeighbors();
        //Jos naapuri löytyy, tee siitä current, JA poista seinä tästä välistä
        if (next) {
            removeWalls(current, next);
            depthFirstSearch(next, delay);
        }
    }, delay);
}
function removeWalls(a, b) {
    //Selvitä suunta missä liikutaan
    var upOrDown = a.i - b.i;
    //Jos suunta on Ylöspäin
    if (upOrDown === 1) {
        //Poista nykyiseltä solulta YLÄSEINÄ
        a.walls[0] = '';
        //Poista ALASEINÄ solulta, mihin liikutaan
        b.walls[2] = '';
        //console.log(a)
    }
    //Jos suunta on ALASPÄIN
    else if (upOrDown === -1) {
        a.walls[2] = '';
        b.walls[0] = '';
    }
    var rightOrLeft = a.j - b.j;
    if (rightOrLeft === -1) {
        a.walls[1] = '';
        b.walls[3] = '';
    }
    else if (rightOrLeft === 1) {
        a.walls[3] = '';
        b.walls[1] = '';
    }
}
var current = grid[0][0];
depthFirstSearch(current, 500);
// Piirrä ruudukko käyttäen Cell-luokkaa
function drawGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = grid[i][j];
            var x = cell.j * cellSize;
            var y = cell.i * cellSize;
            // Piirrä solu ilman ääriviivoja, jos se on vierailtu
            if (cell.visited) {
                cell.draw(ctx, cellSize, 'green');
            }
            else {
                cell.draw(ctx, cellSize, 'grey');
                // Piirrä ääriviivat vain, jos solu ei ole vierailtu
                ctx.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }
}
drawGrid();
