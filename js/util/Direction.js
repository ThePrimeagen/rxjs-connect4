var Direction = {};
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

module.exports = Direction;