const {
    dest,
    series,
    parallel,
    src,
    task,
    watch
} = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const minifyInline = require('gulp-minify-inline');
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');
const del = require('del');
const paths = {
    pages: ['src/*.html'],
    scripts: ['src/*.js']
};
const TASK_LIST = ["clean", "minify-html", "compress"];
task('minify-html', () => {
    return src(paths.pages)
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        // .pipe(minifyInline())
        .pipe(dest('dist'));
});
task('clean', function (cb) {
    del(['dist/*'], cb)
});
task('compress', function () {
    src(paths.scripts)
        .pipe(minify())
        .pipe(dest('dist'))
});
task("default", [...TASK_LIST, "watch"], function () {
    return browserify({
            basedir: '.',
            debug: true,
            entries: ['src/main.ts'],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(dest("dist"));
});
task('watch', function () {
    watch('src/**/*.ts', TASK_LIST);
    watch('src/**/*.css', TASK_LIST);
    watch('src/**/*.html', TASK_LIST);
});
// task('stream', function () {
//     return watch('src/**/*.ts', {
//         ignoreInitial: false
//     });
// });