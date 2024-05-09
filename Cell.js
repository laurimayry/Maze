"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
var Cell = /** @class */ (function () {
    function Cell(i, j) {
        this.i = i;
        this.j = j;
        this.walls = ['top', 'right', 'bottom', 'left'];
        this.visited = false;
    }
    return Cell;
}());
exports.Cell = Cell;
