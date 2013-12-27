var browserify = require('browserify');
var Rx = require('rx');
var fs = require('fs');

module.exports = function(grunt) {
    // Building the template file for the build_me task.
    grunt.registerMultiTask('build_me', 'Its the temporary building system.', function(target) {
        var options = this.options({
            debug: true
        });

        // Sets the main file
        var b = browserify()
            .add(options.main);

        var done = this.async();

        // exposes the needed files.
        for (var k in options.require) {
            b.require(k, {expose: options.require[k]});
        }

        // Compiles browserify
        bundle(b, {debug: options.debug})
            .selectMany(function(src) {
                return fsWrite(options.out, src);
            })
            .take(1)
            .subscribe(function() {
                grunt.log.write('Great Success! ' + options.out + ' has been written');
            }, function(err) {
                grunt.log.error('Error: ' + err);
                done();
            }, function() {
                done();
            });
    });
};


/**
 * Rxifies the bundling process.
 * @param {Browserify} b
 */
function bundle(b, options) {
    return Rx.Observable.create(function(observer) {
        b.bundle(options, function(err, src) {
            if (err) {
                observer.onError(err);
            } else {
                observer.onNext(src);
                observer.onCompleted();
            }
        });
    });
}

function fsWrite(path, src) {
    return Rx.Observable.create(function(observer) {
        fs.writeFile(path, src, function(err) {
            if (err) {
                observer.onError(err);
            } else {
                observer.onNext();
                observer.onCompleted();
            }
        });
    });
}
