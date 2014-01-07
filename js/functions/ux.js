var Rx = require('rx');
var Direction = require('util.Direction');
var NOOP = function() {};
var ux = {};

module.exports = ux;

/**
 * @param {Node} curr
 * @param {Node} prev
 * @param {String} player
 */
ux.colorNodes = function(curr, prev, player) {
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

    if (!prev.data.hasPiece) {
        reset(prev.data.viewNode.$el);
    }

    if (!curr.data.hasPiece) {
        reset($currEl);
        setHover($currEl, player);
    }
};

/**
 * Finds the next available node within the column that the node is within in.
 * @param {Node} node
 * @returns {Node}
 */
ux.nextAvailableNodeInColumn = function(node) {
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
};

/**
 * @param {jQueryElement} $el
 * @param {String} player
 * @returns {jQueryElement}
 */
ux.select = function ($el, player) {
    return reset($el)
        .addClass(player)
        .addClass('selected');
};

/**
 * Throbs the $el over time
 * @param {jQueryElement} $el
 */
ux.throb = function($el, rounds) {
    var throbUpSettings = {
        width: '+=10px',
        height: '+=10px',
        'margin-top': '-=5px',
        'margin-left': '-=5px',
        'margin-right': '-=5px',
        'margin-down': '-=5px'
    };
    var throbDownSettings = {
        width: '-=10px',
        height: '-=10px',
        'margin-top': '+=5px',
        'margin-left': '+=5px',
        'margin-right': '+=5px',
        'margin-down': '+=5px'
    };

    var animate = this._animate;

    return Rx.Observable.create(function(observer) {

        throbUp(0);
        function throbUp(count) {
            $el.css({'z-index': 1000});
            var sub = animate($el, throbUpSettings, 350)
                .subscribe(NOOP, NOOP, function() {
                    sub.dispose();
                    throbDown(count);
                });
        }

        function throbDown(count) {
            var sub = animate($el, throbDownSettings, 350)
                .subscribe(NOOP, NOOP, function() {
                    sub.dispose();
                    $el.css({'z-index': 1});

                    if (count < rounds) {
                        throbUp(count + 1);
                    } else {
                        observer.onNext();
                        observer.onCompleted();
                    }
                });
        }
    });
};

/**
 * Animates the element with the properties passed in.
 * @param properties
 * @param time
 */
ux._animate = function($el, properties, time) {
    return Rx.Observable.create(function(observer) {
        // starts the animation
        $el.animate(properties, time, function() {
            observer.onNext();
            observer.onCompleted();
        });

        // stops the animation
        return function() {
            $el.stop(true, true);
        };
    });
};

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

function reset($el) {
    return $el
        .removeClass('p1')
        .removeClass('p2')
        .removeClass('hover')
        .removeClass('column');
}

