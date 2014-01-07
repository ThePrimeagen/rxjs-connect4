var $ = require('jquery');
var ALLOWED_KEYS = [37, 38, 39, 40, 13];

function isAllowedKey(code, filter) {
    filter = filter || [];
    for (var i = 0; i < ALLOWED_KEYS.length; i++) {
        if (ALLOWED_KEYS[i] === code) {
            return true;
        }
    }
    for (var i = 0; i < filter.length; i++) {
        if (filter[i] === code) {
            return true;
        }
    }
    return false;
}

module.exports = function() {
    $(window).on('keyup', function(e) {
        var code = e.keyCode || e.which;
        if (arguments.length === 1) {
            if (isAllowedKey(code)) {
                arguments[0].apply(null, [code]);
            }
        } else if (arguments.length === 2) {
            if (isAllowedKey(code, arguments[0])) {
                arguments[1].apply(null, [code]);
            }
        }
    });
};

