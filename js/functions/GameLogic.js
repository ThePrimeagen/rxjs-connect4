var _ = require('lodash');
var Rx = require('rx');
var Direction = require('util.Direction');
var GameLogic = {};

module.exports = GameLogic;

_.assign(GameLogic, {
    /**
     * Takes the state of the world and determines if there is a winner or not.
     * @param graph
     */
    isThereWinner: function(graph, boardAlteredObservable) {
        var winnerObservable = Rx.Observable.create(function(observer) {
            boardAlteredObservable.doAction(function() {
                var countGraph = [];
                var playerGraph = [];
                var row, r, c;


                for (r = 0; r < graph.length; r++) {
                    row = [];
                    var pRow = [];
                    for (c = 0; c < graph[0].length; c++){
                        row.push(0)
                        var node = graph[r][c];

                        if (node.data.hasPiece) {
                            var viewNode = node.data.viewNode;
                            var player = getPlayerFromPiece(viewNode.$el);
                            pRow.push(player);
                        } else {
                            pRow.push('');
                        }
                    }
                    countGraph.push(row);
                    playerGraph.push(pRow);
                }

                // Do not follow this crappy code.  It is a hack to get something working right away.
                for (r = 1; r < graph.length; r++) {
                    for (c = 0; c < graph[0].length; c++) {
                        var node = graph[r][c];
                        if (node.data.hasPiece) {
                            var down = countAndNodes(node, nextDownNode);
                            if (down.count >= 3) {
                                console.log('Found it(DOWN): ' + down.nodes);
                                observer.onNext(down.nodes);
                                observer.onCompleted(down.nodes);
                                return;
                            }

                            var right = countAndNodes(node, nextRightNode);
                            if (right.count >= 3) {
                                console.log('Found it(RIGHT): ' + right.nodes);
                                observer.onNext(right.nodes);
                                observer.onCompleted(right.nodes);
                                return;
                            }

                            var diagRD = countAndNodes(node, nextDiagonalNodeRD);
                            if (diagRD.count >= 3) {
                                console.log('Found it(DIAG): ' + diagRD.nodes);
                                observer.onNext(diagRD.nodes);
                                observer.onCompleted(diagRD.nodes);
                                return;
                            }

                            var diagLD = countAndNodes(node, nextDiagonalNodeLD);
                            if (diagLD.count >= 3) {
                                console.log('Found it(DIAG): ' + diagLD.nodes);
                                observer.onNext(diagLD.nodes);
                                observer.onCompleted(diagLD.nodes);
                                return;
                            }
                        }
                    }
                }
            }).subscribe();
        }).publish();

        winnerObservable.connect();
        return winnerObservable;
    }
});

function nextDownNode(node) {
    return node.getNeighbor(Direction.DOWN);
}

function nextRightNode(node) {
    return node.getNeighbor(Direction.RIGHT);
}

function nextDiagonalNodeRD(node) {
    var right = nextRightNode(node);
    var diagonal = nextDownNode(right);

    // Cannot go diagonal
    if (right.name === node.name || diagonal.name === right.name) {
        return node;
    }

    return diagonal;
}

function nextDiagonalNodeLD(node) {
    var left = node.getNeighbor(Direction.LEFT);
    var diagonal = nextDownNode(left);

    // Cannot go diagonal
    if (left.name === node.name || diagonal.name === left.name) {
        return node;
    }

    return diagonal;
}

function getPlayerFromPiece($el) {
    if ($el.hasClass('p1')) {
        return 'p1';
    }
    if ($el.hasClass('p2')) {
        return 'p2';
    }
    return '';
}

function countAndNodes(startNode, nextNodeFn) {
    var count = 0;
    var curr = startNode;
    var next = null;
    var player = getPlayerFromPiece(startNode.data.viewNode.$el);
    var nodes = [curr];

    if (player === '') {
        return;
    }

    while ((next = nextNodeFn(curr)).name !== curr.name && next.data.hasPiece && getPlayerFromPiece(next.data.viewNode.$el) === player) {
        curr = next;
        count++;
        nodes.push(curr);
    }

    return {
        count: count,
        nodes: nodes
    };
}

