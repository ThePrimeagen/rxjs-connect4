var Direction = require('./Direction');
var _ = require('lodash');
var WIDTH = 200;
var HEIGHT = 200;
var P1_HOVER_COLOR = '#38b2ce';
var P1_SET_COLOR = '#04819e';
var P1_SET_HOVER_COLOR = '#015367';
var P2_HOVER_COLOR = '#ff9f40';
var P2_SET_COLOR = '#ff7f00';
var P2_SET_HOVER_COLOR = '#a65200';

/**
 * Builds the graph that will be the tic tac toe board.
 * @param $container
 * @param [options]
 * @constructor
 */
function graph($container, options) {
    var board = [];
    var settings = _.extend({
        rows: 3,
        columns: 3
    }, options);
    var $boardContainer = $('<div/>')
        .css({
            width: (WIDTH * settings.columns) + 'px',
            height: (HEIGHT * settings.rows) + 'px'
        });
    $container.append($boardContainer);

    for (var r = 0; r < settings.rows; r++) {
        var row = board[r] = [];

        // Build column nodes.
        for (var c = 0; c < settings.columns; c++) {
            var n = new Node($boardContainer, [r, c].join(''));
            row.push(n);

            if (r > 0) {
                var upNode = board[r - 1][c];

                n.addNeighbor(upNode, Direction.UP)
                upNode.addNeighbor(n, Direction.DOWN);
            }

            if (c > 0) {
                var leftNode = board[r][c - 1];

                n.addNeighbor(leftNode, Direction.LEFT)
                leftNode.addNeighbor(n, Direction.RIGHT);
            }
        }
    }

    return board;
};

/**
 * If i were going to spend any more time in this project This would be the class i would change.  I don't like it!
 */
var Node = function($container, name) {
    var neighbors = this._neighbors = {};

    neighbors[Direction.UP] = this;
    neighbors[Direction.RIGHT] = this;
    neighbors[Direction.DOWN] = this;
    neighbors[Direction.LEFT] = this;

    if ($) {
        this._$el = $('<div/>').css({
            width: '200px',
            height: '200px',
            float: 'left'
        });
        $container.append(this._$el);
    }

    // The name of the node
    this._name = name;
    this._set = false;

    // default color of Node.
    this._color = '#fff';
    this._setPlayer = -1;
};

module.exports = {
    Node: Node,
    graph: graph
};

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

    /**
     * Enters the node
     */
    enter: function() {
        this._$el.css({
            'background-color': this._set ? this._enterSetColor : this._enterColor
        });
        return this;
    },

    /**
     * Will color the node
     */
    color: function(color) {
        this._$el.css({
            'background-color': color
        });
        return this;
    },

    /**
     * exits the node
     */
    exit: function() {
        this._$el.css({
            'background-color': this._color
        });
        return this;
    },

    /**
     * Gets the boolean if is set
     * @returns {Boolean}
     */
    isSet: function() {
        return this._set;
    },

    /**
     * gets the player who set the node.
     * @returns {Number}
     */
    getSetPlayer: function() {
        return this._setPlayer;
    },

    /**
     * Expects player to be a number (0) or (1)
     * @param {Number} player
     */
    setPlayer: function(player) {
        this._player = player;

        // 0 is player1, 1 is player2
        if (player === 0) {
            this._enterColor = P1_HOVER_COLOR;
            this._enterSetColor = P1_SET_HOVER_COLOR;
            this._setColor = P1_SET_COLOR;
        } else {
            this._enterColor = P2_HOVER_COLOR;
            this._enterSetColor = P2_SET_HOVER_COLOR;
            this._setColor = P2_SET_COLOR;
        }
        return this;
    },

    /**
     * Sets the node to being set
     */
    check: function() {
        this._set = true;
        this._$el.css({
            'background-color': this._setColor
        });
        this._color = this._setColor;
        this._setPlayer = this._player;
    }
};



