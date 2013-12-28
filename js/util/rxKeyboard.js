var Rx = require('rx');
var _ = require('lodash');
var ALLOWED_KEYS = [37, 38, 39, 40, 13];

function getKeyboardObservable() {
    return Rx.Observable.fromEvent(window, 'keydown')
        .filter(function(e) {
            return _.contains(ALLOWED_KEYS, e.keyCode);
        })
        .select(function(e) {
            return e.keyCode || e.which;
        })
}

var keyboard = null;

module.exports = function(filter) {

    if (!keyboard) {
        keyboard = getKeyboardObservable().publish();
        keyboard.connect();
    }

    // attaches a filter.
    if (filter && _.contains(ALLOWED_KEYS, filter)) {
        filter = [].concat(filter);
        return keyboard.filter(function(code) {
            return _.contains(filter, code);
        });
    }

    return keyboard;
};

