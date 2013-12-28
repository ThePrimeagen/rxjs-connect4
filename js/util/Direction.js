var rxKeyboard = require('./rxKeyboard')

var Direction = function(direction) {
    this.direction = direction;
};

// -----------------------------------------------------------------
// Static
// -----------------------------------------------------------------

Direction.UP = 'up';
Direction.DOWN = 'down';
Direction.LEFT = 'left';
Direction.RIGHT = 'right';

Direction.reverseMap = {};
Direction.reverseMap[Direction.UP] = Direction.DOWN;
Direction.reverseMap[Direction.DOWN] = Direction.UP;
Direction.reverseMap[Direction.LEFT] = Direction.RIGHT;
Direction.reverseMap[Direction.RIGHT] = Direction.LEFT;

Direction.codeToDirection = {};
Direction.codeToDirection[37] = Direction.LEFT;
Direction.codeToDirection[38] = Direction.UP;
Direction.codeToDirection[39] = Direction.RIGHT;
Direction.codeToDirection[40] = Direction.DOWN;

Direction.onKeyboardDirection = rxKeyboard()
    .select(function(code) {
        return Direction.codeToDirection[code];
    })
    .filter(function(code) {
        return code !== undefined;
    });

// -----------------------------------------------------------------
// Instance methods
// -----------------------------------------------------------------
Direction.prototype = {
    set direction(value) { this._direction = value; },
    get direction() { return this._direction; },

    /**
     * Reverses, 180, PI, the current direction
     */
    reverse: function() {
        this.direction = Direction.reverseMap(this.direction);
    }
};

module.exports = Direction;