var Rx = require('rx');
var Direction = require('util.Direction');
var GameLogic = {};

module.exports = GameLogic;

    /**
     * Takes the state of the world and determines if there is a winner or not.
     * @param graph
     */
GameLogic.isThereWinner = function(node) {
    var down = countAndNodes(node, nextNode(Direction.DOWN));
    var up = countAndNodes(node, nextNode(Direction.UP));
    if (down.count + up.count >= 3) {
        return down.nodes.concat(up.nodes);
    }

    var left = countAndNodes(node, nextNode(Direction.LEFT));
    var right = countAndNodes(node, nextNode(Direction.RIGHT));
    if (left.count + right.count >= 3) {
        return left.nodes.concat(right.nodes);
    }

    var LU = countAndNodes(node, nextDiagonalNodeLU);
    var RD = countAndNodes(node, nextDiagonalNodeRD);
    if (LU.count + RD.count >= 3) {
        return LU.nodes.concat(RD.nodes);
    }

    var LD = countAndNodes(node, nextDiagonalNodeLD);
    var RU = countAndNodes(node, nextDiagonalNodeRU);
    if (LD.count + RU.count >= 3) {
        return LD.nodes.concat(RU.nodes);
    }

    return false;
};

function nextNode(direction) {
    return function(node) {
        return node.getNeighbor(direction);
    }
}

function nextDiagonalNodeRD(node) {
    var right = node.getNeighbor(Direction.RIGHT);
    var diagonal = right.getNeighbor(Direction.DOWN);
    return areUnique(node, right, diagonal) ? diagonal : node;
}

function nextDiagonalNodeRU(node) {
    var right = node.getNeighbor(Direction.RIGHT);
    var diagonal = right.getNeighbor(Direction.UP);
    return areUnique(node, right, diagonal) ? diagonal : node;
}

function nextDiagonalNodeLD(node) {
    var left = node.getNeighbor(Direction.LEFT);
    var diagonal = left.getNeighbor(Direction.DOWN);
    return areUnique(node, left, diagonal) ? diagonal : node;
}

function nextDiagonalNodeLU(node) {
    var left = node.getNeighbor(Direction.LEFT);
    var diagonal = left.getNeighbor(Direction.UP);
    return areUnique(node, left, diagonal) ? diagonal : node;
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

function areUnique(n1, n2, n3) {
    // Cannot go diagonal
    if (n2.name !== n1.name && n2.name !== n3.name) {
        return true;
    }
    return false;
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

