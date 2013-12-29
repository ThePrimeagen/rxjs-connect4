var Rx = require('rx');
var Observable = Rx.Observable;
var _ = require('lodash');
var $ = require('jquery');
var Graph = require('./util/Graph');
var rxKeyboard = require('./util/rxKeyboard');
var Direction = require('./util/Direction');
var viewGraph = require('./viewGraph');

var RxConnect4 = function($container) {
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

RxConnect4.prototype = {
    /**
     * Starts the game loop
     */
    start: function() {
        // gets the keyboard observable and starts the game.
        var players = ['p1', 'p2'];
        var keyboardObs = rxKeyboard(13).merge(Direction.onKeyboardDirectionLR);
        var firstData = {
            currentNode: this._firstNode,
            prevNode: false,
            currentPlayerIdx: 0,
            enter: false
        };

        var dataObs = keyboardObs

            // Setups the data
            .scan(firstData, function(data, code) {
                if (Direction.directionToCode[code]) {
                    var currentNode = data.currentNode;
                    var nextNode = currentNode.getNeighbor(code);

                    data.currentNode = nextNode;
                    data.prevNode = currentNode;
                    data.enter = false;
                } else {
                    data.enter = true;
                }
                return data;
            }).publish();

        var enter = dataObs
            .filter(function(data) {
                return data.enter;
            })
            .doAction(function(data) {
                data.currentPlayerIdx = ++data.currentPlayerIdx % 2;
            });

        var dir = dataObs

            // Filters out the enter
            .filter(function(data) {
                return !data.enter;
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
                var $currEl = curr.data.viewNode.$el;

                // Its not a same change.
                if (curr.name !== prev.name) {
                    var nodes = getNodes(curr, Direction.UP);
                    var removes = getNodes(prev, Direction.UP);
                    var i = 0;
                    var $el;

                    for (i = 0; i < nodes.length; i++) {
                        $el = nodes[i].data.viewNode.$el;
                        reset($el);
                        setHoverColumn($el, player);
                    }
                    for (i = 0; i < removes.length; i++) {
                        $el = removes[i].data.viewNode.$el;
                        reset($el);
                    }

                    reset($currEl);
                    reset(prev.data.viewNode.$el);
                    setHover($currEl, player);
                }
            });


        dataObs.connect();
        // Merges and subscribes to them.
        Rx.Observable.merge(dir, enter).subscribe();
    }
};

module.exports = RxConnect4;

function getNodes(node, direction) {
    var nodes = [];
    var next = null;
    var curr = node;
    while ((next = curr.getNeighbor(direction)).name !== curr.name) {
        nodes.push(next);
        curr = next;
    }

    return nodes;
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


