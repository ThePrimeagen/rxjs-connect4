var $ = require('jquery');
var ViewNode = require('./ViewNode');
var Rx = require('rx');

/**
 * creates a graph within the container provided.
 * @param $container
 * @param {{}}
 */
var viewGraph = function($container, options) {
    // Creates the view and attaches itself to the models.
    var $graphContainer = $('<div/>').addClass('graph');
    $container.append($graphContainer);

    var nodes = [];
    var graph = options.graph;
    var cols = [];

    for (var r = 0; r < graph.length; r++) {
        var row = [];
        for (var c = 0; c < graph[0].length; c++) {
            var node = new ViewNode();
            row.push(node);

            graph[r][c].data = {
                viewNode: node,
                column: c,

                // The one piece of mutable information
                hasPiece: false
            };

            if (!cols[c]) {
                cols[c] = [];
            }

            cols[c].push(node);
            $graphContainer.append(node.$el);
        }
        nodes.push(row);
    }

    this.nodes = nodes;

    // Adjusts all the widths and heights of nodes.
    adjustDimensionsAndPositions($graphContainer, graph);
    Rx.Observable.fromEvent(window, 'resize').subscribe(function() {
        adjustDimensionsAndPositions($graphContainer, graph);
    });
};

var getViewNode = viewGraph.getViewNode = function(node) {
    return node.data.viewNode;
};

module.exports = viewGraph;


/**
 * Adjusts the width and height of the container.
 * @param $graphContainer
 */
function adjustDimensionsAndPositions($graphContainer, graph) {
    var rows = graph.length;
    var columns = graph[0].length;
    var width = $graphContainer.width() / columns;
    var height = $graphContainer.height() / rows;
    var currentWidth = 0;
    var currentHeight = 0;

    for (var r = 0; r < rows; r++) {
        currentWidth = 0;
        for (var c = 0; c < columns; c++) {
            getViewNode(graph[r][c]).$el.css({
                width: width,
                height: height,
                top: currentHeight,
                left: currentWidth
            });
            currentWidth += width;

            if (r === 0) {
                getViewNode(graph[r][c]).$el.addClass('no-use');
            }
        }
        currentHeight += height;
    }
}

