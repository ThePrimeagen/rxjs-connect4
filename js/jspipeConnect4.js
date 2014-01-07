var Rx = require('rx');
var Observable = Rx.Observable;
var $ = require('jquery');
var Graph = require('./util/Graph');
var rxKeyboard = require('./util/jspipe-keyboard');
var Direction = require('./util/Direction');
var viewGraph = require('./viewGraph');
var ux = require('./functions/ux');
var GameLogic = require('./functions/GameLogic');
var NOOP = function() {};

var JsPipeConnect4 = function($container) {
    this._$container = $container;
};

// TODO: Add animation
// TODO: Add countdown when user wins
// TODO: Restart when user wins
// TODO: Add polling to a server and create cross internets play

JsPipeConnect4.prototype = {
    /**
     * Starts the game loop
     */
    start: function() {


        (function createGameLife($container) {
            $container.empty();

            var g = Graph.grid({
                rows: 11,
                columns: 15
            });

            // Sets up the view graph.
            viewGraph($container, {
                graph: g
            });

            var gameObservable = gameActionObservables(g);
            var gameWinObservable = GameLogic.isThereWinner(g, gameObservable[0]);
            var gameWinSubscription = gameWinObservable.subscribe(function(nodes) {

                var animations = [];
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].data.viewNode.$el.addClass('winner');
                    animations.push(ux.throb(nodes[i].data.viewNode.$el, 3));

                }

                // clears previous subscriptions
                gameWinSubscription.dispose();
                gameLoopSubscription.dispose();

                // waits for animations to be done.
                Rx.Observable.merge(animations).subscribe(NOOP, NOOP, function() {
                    createGameLife($container);
                });
            });

            var gameLoopSubscription = Rx.Observable.merge(gameObservable)
                .takeUntil(gameWinObservable)
                .subscribe();

        })(this._$container);
    }
};

function gameActionObservables(graph) {
    var startNode = graph[10][7];
    var players = ['p1', 'p2'];
    var gameDataObs = gameDataObservable(startNode);

    ux.colorNodes(startNode, startNode, players[0]);
    return [
        onEnterObservable(gameDataObs, players),
        onDirectionObservable(gameDataObs, players)
    ];
}

function onDirectionObservable(dataObservable, players) {
    return dataObservable

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
}

function onEnterObservable(dataObservable, players) {
    var enterObs = dataObservable
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
    enterObs.connect();
    return enterObs;
}

function gameDataObservable(startNode) {
    var keyboardObs = rxKeyboard(13).merge(Direction.onKeyboardDirectionLR);
    var firstData = {
        currentNode: startNode,
        prevNode: false,
        currentPlayerIdx: 0,
        enter: false
    };

    // TODO:  How would i do this differently.  How do i keep state without keeping state (thats what she said?)?
    // FIXME: Fix the above todo.
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
        })
        .publish();

    // Connects up the observable.
    dataObs.connect();

    return dataObs;
}

module.exports = JsPipeConnect4;


