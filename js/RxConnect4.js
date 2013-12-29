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

        // TODO:  How would i do this differently.  How do i keep state without keeping state (thats what she said?)?
        // FIXME: Fix the above todo.
        var firstData = {
            currentNode: this._firstNode,
            prevNode: false,
            currentPlayerIdx: 0,
            enter: false
        };

        // initial placement must be colored.
        colorNodesAndColumns(this._firstNode, this._firstNode, players[0]);

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

                // sets a piece.
                var nodeData = data.currentNode.data;

                // You can't do that!
                if (data.hasPiece) {
                    return;
                }

                nodeData.hasPiece = true;
                select(data.currentNode.data.viewNode.$el, players[data.currentPlayerIdx]);
                data.currentNode = selectNextAvailableNodeInColumn(data.currentNode);

                // Sets the new player
                data.currentPlayerIdx = ++data.currentPlayerIdx % 2;
                colorNodesAndColumns(data.currentNode, data.currentNode, players[data.currentPlayerIdx]);
            });

        var dir = dataObs

            // Filters out the enter
            .filter(function(data) {
                return !data.enter;
            })

            // Goes through the nodes and finds the node to start on
            .select(function(data) {
                var next = selectNextAvailableNodeInColumn(data.currentNode);

                if (data.currentNode.name !== next.name) {
                    data.currentNode = next;
                }

                return data;
            })

            // Takes in data and will color the screen from the data that comes in.
            .doAction(function(data) {
                var curr = data.currentNode;
                var prev = data.prevNode;
                var player = players[data.currentPlayerIdx];

                if (curr.name !== prev.name) {

                    // Only recolors on name change.
                    colorNodesAndColumns(curr, prev, player);
                }
            });


        // Now that all observers are listening, we will connect.
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

function colorNodesAndColumns(curr, prev, player) {
    var $currEl = curr.data.viewNode.$el;
    var nodes = getNodes(curr, Direction.UP);
    var removes = getNodes(prev, Direction.UP);
    var i = 0;
    var $el;

    for (i = 0; i < removes.length; i++) {
        $el = removes[i].data.viewNode.$el;
        reset($el);
    }
    for (i = 0; i < nodes.length; i++) {
        $el = nodes[i].data.viewNode.$el;
        reset($el);
        setHoverColumn($el, player);
    }

    reset($currEl);
    reset(prev.data.viewNode.$el);
    setHover($currEl, player);
}

function selectNextAvailableNodeInColumn(node) {
    var next = null;
    var dir = node.data.hasPiece ? Direction.UP : Direction.DOWN;

    // Gets the next node
    // 1: Verifies that they are not the same node
    // 2:  If up: the current node has a piece
    // 2.1: If down: the next node does not have a piece.
    while ((next = node.getNeighbor(dir)).name !== node.name && (dir === Direction.UP && node.data.hasPiece || dir === Direction.DOWN && !next.data.hasPiece)) {
        node = next;
    }

    return node;
}

function select($el, player) {
    return reset($el)
        .addClass(player)
        .addClass('selected');
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


