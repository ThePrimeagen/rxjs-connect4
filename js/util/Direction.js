var rxKeyboard = require('./rxKeyboard')

var Direction = {};

function filterLR(code) {
    return code === leftCode || code === rightCode;
}

function selectDirection(code) {
    return Direction.codeToDirection[code];
}

function filterDirectionsOnly(code) {
    return code === leftCode ||
        code === upCode ||
        code === rightCode ||
        code === downCode;
}

// -----------------------------------------------------------------
// Static
// -----------------------------------------------------------------
var up, down, left, right;

Direction.UP = up = 'up';
Direction.DOWN = down = 'down';
Direction.LEFT = left = 'left';
Direction.RIGHT = right = 'right';

var upCode = 38;
var downCode = 40;
var leftCode = 37;
var rightCode = 39;

Direction.codeToDirection = {};
Direction.codeToDirection[leftCode] = left;
Direction.codeToDirection[upCode] = up;
Direction.codeToDirection[rightCode] = right;
Direction.codeToDirection[downCode] = down;

var directionToCode;
Direction.directionToCode = directionToCode = {};
Direction.directionToCode[left] = leftCode;
Direction.directionToCode[up] = upCode;
Direction.directionToCode[right] = rightCode;
Direction.directionToCode[down] = downCode;

Direction.onKeyboardDirection = rxKeyboard().filter(filterDirectionsOnly).select(selectDirection);
Direction.onKeyboardDirectionLR = rxKeyboard().filter(filterLR).select(selectDirection);

module.exports = Direction;