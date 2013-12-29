var Direction = require('./Direction');

/**
 * If i were going to spend any more time in this project This would be the class i would change.  I don't like it!
 */
var Node = function(name) {
    var neighbors = this._neighbors = {};

    neighbors[Direction.UP] = this;
    neighbors[Direction.RIGHT] = this;
    neighbors[Direction.DOWN] = this;
    neighbors[Direction.LEFT] = this;

    // The name of the node
    this.name = name.join(',');
    this.row = name[0];
    this.column = name[1];
};

module.exports = Node;
Node.prototype = {
    /**
     * Adds a neighbor
     * @param {Node} node
     * @param {String} direction
     */
    addNeighbor: function(node, direction) {
        this._neighbors[direction] = node;
    },

    /**
     * Gets the proper neighbor
     * @param {String} direction
     * @returns {Node}
     */
    getNeighbor: function(direction) {
        return this._neighbors[direction];
    },

    get data() { return this._data; },
    set data(value) { this._data = value; }
};


