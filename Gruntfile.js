/*
 * Build for the tic tac toe rx modules.
 *
 * Copyright (c) 2013 Michael Brady Paulson
 * Licensed under the MIT license.
 */

'use strict';

var browserify = require('browserify');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Project configuration.
    grunt.initConfig({
        // Configuration to be run (and then tested).
        build_me: {
            compile: {
                options: {
                    main: './js/main.js',
                    out: './static/dist/main.js',
                    require: {
                        './node_modules/rx/rx.lite.js': 'rx',
                        './node_modules/rx/rx.binding.js': 'rx-binding',
                        './js/RxConnect4.js': 'RxConnect4',
                        'jquery-browserify': 'jquery',
                        './js/main.js': 'TicTacToe'
                    }
                }
            }
        },

        watch: {
            files: ['./js/**/*.js'],
            tasks: ['build_me']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // By default, lint and run all tests.
    grunt.registerTask('default', ['build_me', 'watch']);
};


function browserifyBuild(options) {
    var requires = options.requires;
    var b = browserify();
}