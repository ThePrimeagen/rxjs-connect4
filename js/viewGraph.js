var $ = require('jquery');
var ViewNode = require('./ViewNode');
var Direction = require('./util/Direction');

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
        }
        nodes.push(row);
    }

    this.nodes = nodes;
};

module.exports = viewGraph;
