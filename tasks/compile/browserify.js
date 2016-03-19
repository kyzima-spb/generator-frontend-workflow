"use strict";

const _ = require('lodash');
const es = require('event-stream');

const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');


function browserifyTask(options, devMode) {
    function browserifyThis(bundleConfig) {
        var b,
            bundle;


        if (devMode) {
            _.extend(bundleConfig, watchify.args, { debug: true });
            bundleConfig = _.omit(bundleConfig, ['external', 'require']);
        }

        b = browserify(bundleConfig);

        bundle = function () {
            return b
                .bundle()
                .on('error', function (err) {
                    err.plugin = 'browserify';
                    $.notify.onError(options.notify.error).call(this, err);
                })
                .pipe(source(bundleConfig.outputName))
                .pipe(gulp.dest(bundleConfig.dest))
                .pipe(browserSync.reload({
                    stream: true
                }));
        };

        if (devMode) {
            b = watchify(b);
            b.on('update', bundle);
            b.on('log', $.util.log);
            return bundle();
        }

        bundleConfig.require && (b.require(bundleConfig.require));
        bundleConfig.external && (b.external(bundleConfig.external));

        return bundle();
    }
    
    return function (cb) {
        es.merge(options.browserify.map(browserifyThis)).on('end', cb);
    }
}


module.exports = browserifyTask;
