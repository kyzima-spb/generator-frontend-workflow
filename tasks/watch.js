'use strict';

const es = require('event-stream');
const gulp = require('gulp');


function watch(config) {
    gulp.watch(
        config.src,
        config.parallel ? gulp.parallel(config.tasks) : gulp.series(config.tasks)
    );
}


module.exports = function (config) {
    return function (cb) {
        // es.merge(config.map(watch)).on('end', cb);
        
        config.map(watch);
        cb();
    };
};
