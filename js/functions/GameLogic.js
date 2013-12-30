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
        return Rx.Observable.create(function(observer) {
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

                for (r = 1; r < graph.length; r++) {
                    for (c = 0; c < graph[0].length; c++) {
                        var node = graph[r][c];
                        if (node.data.hasPiece) {
                            var down = countAndNodes(node, nextDownNode);
                            if (down.count >= 3) {
                                console.log('Found it(DOWN): ' + down.nodes);
                                observer.onNext();
                                observer.onCompleted();
                                break;
                            }

                            var right = countAndNodes(node, nextRightNode);
                            if (right.count >= 3) {
                                console.log('Found it(RIGHT): ' + right.nodes);
                                observer.onNext();
                                observer.onCompleted();
                                break;
                            }

                            var diagonal = countAndNodes(node, nextDiagonalNode);
                            if (diagonal.count >= 3) {
                                console.log('Found it(DIAG): ' + diagonal.nodes);
                                observer.onNext();
                                observer.onCompleted();
                                break;
                            }
                        }
                    }
                }
            }).subscribe();
        });
    }
});

function nextDownNode(node) {
    return node.getNeighbor(Direction.DOWN);
}

function nextRightNode(node) {
    return node.getNeighbor(Direction.RIGHT);
}

function nextDiagonalNode(node) {
    var right = nextRightNode(node);
    var diagonal = nextDownNode(right);

    // Cannot go diagonal
    if (right.name === node.name || diagonal.name === right.name) {
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

