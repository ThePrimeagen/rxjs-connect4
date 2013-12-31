var $ = require('jquery');

var ViewNode = function() {
    this.$el = $('<div/>').addClass('node');
};

ViewNode.prototype = {};
module.exports = ViewNode;