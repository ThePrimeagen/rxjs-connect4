var $ = require('jquery');

var ViewNode = function() {
    var color;
    this.$el = $('<div/>').addClass('node');
};

ViewNode.prototype = {
    /**
     * Animates the element with the properties passed in.
     * @param properties
     * @param time
     */
    animate: function(properties, time) {
        var $el = this.$el;
        return Rx.Observable.create(function(observer) {
            // starts the animation
            $el.animate(properties, time, function() {
                observer.onNext();
                observer.onComplete();
            });

            // stops the animation
            return function() {
                $el.stop(true, true);
            };
        });
    },
    /**
     * Stops any animation going
     */
    stop: function() {
        this.$el.stop(true, true);
    }
};

module.exports = ViewNode;