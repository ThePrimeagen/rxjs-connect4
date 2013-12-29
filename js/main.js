var Rx = require('rx');
var Observable = Rx.Observable;
var _ = require('lodash');
var $ = require('jquery');
var Graph = require('./util/Graph');
var rxKeyboard = require('./util/rxKeyboard');
var Direction = require('./util/Direction');
var viewGraph = require('./viewGraph');

var App = function($container) {
    var g = Graph.grid({
        rows: 10,
        columns: 9
    });

    // Sets up the view graph.
    viewGraph($container, {
        graph: g
    });
    this._firstNode = g[9][4];
};

App.prototype = {
    /**
     * Starts the game loop
     */
    start: function() {
        // gets the keyboard observable and starts the game.
        var players = ['p1', 'p2'];
        var keyDirObs = Direction.onKeyboardDirectionLR;
        var enterObs = rxKeyboard(13);
        var firstData = {
            currentNode: this._firstNode,
            prevNode: false,
            currentPlayerIdx: 0
        };

        keyboardObservable

            // Setups the data
            .scan(firstData, function(data, direction) {
                var currentNode = data.currentNode;
                var nextNode = currentNode.getNeighbor(direction);

                data.currentNode = nextNode;
                data.prevNode = currentNode;

                return data;
            })

            // Goes through the nodes and finds the node to start on
            .select(function(data) {
                var curr = data.currentNode;
                var next = null;
                var dir = curr.data.hasPiece ? Direction.UP : Direction.DOWN;

                // Finds the proper node.
                while ((next = curr.getNeighbor(dir)).name !== curr.name && next.data.hasPiece && !curr.data.hasPiece) {
                    curr = next;
                }

                if (data.currentNode.name !== curr.name) {
                    data.currentNode = curr;
                }

                return data;
            })

            // Takes in data and will color the screen from the data that comes in.
            .doAction(function(data) {
                var curr = data.currentNode;
                var prev = data.prevNode;
                var player = players[data.currentPlayerIdx];

                // Its not a same change.
                if (curr.name !== prev.name) {
                    var nodes = getNodes(curr, Direction.UP);

                    for (var i = 0; i < nodes.length; i++) {
                        reset(nodes[i].data);
                        setHoverColumn(nodes[i].data.$el, player);
                    }

                    reset(curr.data);
                    setHover(curr.data.$el, player);
                }
            });
    }
};

module.exports = App;

function getNodes(node, direction) {
    var nodes = [];
    var next = null;
    var curr = node;
    while ((next = curr.getNeighbor(direction)).name !== curr.name) {
        nodes.push(next);
        curr = next;
    }

    return next;
}


function reset($el) {
    return $el
        .removeClass('p1')
        .removeClass('p2')
        .removeClass('hover')
        .removeClass('column');
}

function setHover($el, player) {
    return $el
        .addClass(player)
        .addClass('hover');
}

function setHoverColumn($el, player) {
    return $el
        .addClass(player)
        .addClass('hover')
        .addClass('column');
}

