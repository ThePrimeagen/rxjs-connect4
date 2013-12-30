var Rx = require('rx');
var Observable = Rx.Observable;
var _ = require('lodash');
var $ = require('jquery');
var Graph = require('./util/Graph');
var rxKeyboard = require('./util/rxKeyboard');
var Direction = require('./util/Direction');
var viewGraph = require('./viewGraph');
var ux = require('./functions/ux');
var GameLogic = require('./functions/GameLogic');

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
    this._graph = g;
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
        ux.colorNodes(this._firstNode, this._firstNode, players[0]);

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

            // Cannot fill the top row.
            // Must be enter command
            // current node must not have a piece already
            .filter(function(data) {
                return data.enter && !data.currentNode.data.hasPiece && data.currentNode.row !== 0;
            })
            .doAction(function(data) {

                // sets a piece.
                var nodeData = data.currentNode.data;

                nodeData.hasPiece = true;
                ux.select(data.currentNode.data.viewNode.$el, players[data.currentPlayerIdx]);
                data.currentNode = ux.nextAvailableNodeInColumn(data.currentNode);

                // Sets the new player
                data.currentPlayerIdx = ++data.currentPlayerIdx % 2;
                ux.colorNodes(data.currentNode, data.currentNode, players[data.currentPlayerIdx]);
            }).publish();

        var dir = dataObs

            // Filters out the enter
            .filter(function(data) {
                return !data.enter;
            })

            // Goes through the nodes and finds the node to start on
            .select(function(data) {
                var next = ux.nextAvailableNodeInColumn(data.currentNode);

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
                    ux.colorNodes(curr, prev, player);
                }
            });


        // Now that all observers are listening, we will connect.
        dataObs.connect();
        enter.connect();

        var gameWinObservable = GameLogic.isThereWinner(this._graph, enter);
        gameWinObservable.subscribe();

        // Merges and subscribes to them.
        Rx.Observable
            .merge(dir, enter)
            .takeUntil(gameWinObservable)
            .subscribe();
    }
};

module.exports = RxConnect4;


