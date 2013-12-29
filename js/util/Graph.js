var Direction = require('./Direction');
var _ = require('lodash');

var Graph = {
    /**
     * Builds the graph that will be the tic tac toe board.
     * @param [config]
     * @constructor
     */
    grid: function graph(config) {
        var board = [];
        var settings = _.extend({
            rows: 3,
            columns: 3
        }, config);

        for (var r = 0; r < settings.rows; r++) {
            var row = board[r] = [];

            // Build column nodes.
            for (var c = 0; c < settings.columns; c++) {
                var n = new Node([r, c].join(''));
                row.push(n);

                if (r > 0) {
                    var upNode = board[r - 1][c];

                    n.addNeighbor(upNode, Direction.UP)
                    upNode.addNeighbor(n, Direction.DOWN);
                }

                if (c > 0) {
                    var leftNode = board[r][c - 1];

                    n.addNeighbor(leftNode, Direction.LEFT)
                    leftNode.addNeighbor(n, Direction.RIGHT);
                }
            }
        }
        return board;
    }
};

module.exports = Graph;

