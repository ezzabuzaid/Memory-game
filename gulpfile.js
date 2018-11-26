const gulp = require("gulp");

const browserify = require("browserify");
const tsify = require("tsify");
var fs = require('fs');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const gutil = require('gulp-util');
const minifyJS = require('gulp-minify');
const htmlmin = require('gulp-htmlmin');
const paths = {
    pages: ['dist/index.html'],
    scripts: ['dist/**/*.js']
};
const TASK_LIST = ['clean', 'compile-ts', ['minify-compress', 'copy-html'], 'minify-html'];

const gulpCopy = require('gulp-copy');

gulp.task('clean', () => del(['dist']));
gulp.task('minify-html', () => {
    return gulp.src(paths.pages)
        .pipe(htmlmin({ collapseWhitespace: true, useShortDoctype: true, removeStyleLinkTypeAttributes: true, removeComments: true }))
        .pipe(gulp.dest('dist'));
});
gulp.task('copy-html', () => {
    return gulp.src('./src/index.html')
        .pipe(gulpCopy('dist/', { prefix: 1 }))
        .pipe(gulp.dest('dist'));
});
gulp.task('minify-compress', () => {
    return gulp.src(paths.scripts)
        .pipe(minifyJS())
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});
gulp.task('compile-ts', () => {
    return browserify({
        basedir: '.',
        debug: false,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {},
    })
        // .pipe(watch('src/**/*'))
        .plugin(tsify)
        .bundle()
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
})
const sugar = (...a) => gulp.series(...a.map((i) => Array.isArray(i) ? gulp.parallel(...i) : i));

gulp.task("default", sugar(...TASK_LIST));
// task('watch', function () {
//     watch('src/**/*.ts', TASK_LIST);
//     watch('src/**/*.css', TASK_LIST);
//     watch('src/**/*.html', TASK_LIST);
// });
// task('stream', function () {
//     return watch('src/**/*.ts', {
//         ignoreInitial: false
//     });
// });

// {del} :: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];


// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src('./src/sass/styles.scss')
        // Compile SASS files
        .pipe(sass({
            outputStyle: 'nested',
            precision: 10,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        // Auto-prefix css styles for cross browser compatibility
        .pipe(autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        // Minify the file
        .pipe(csso())
        // Output
        .pipe(gulp.dest('./dist/css'))
});