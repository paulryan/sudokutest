var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var paths = {
    pages: [
        'src/*.html',
        'src/*.css'
    ]
};

gulp.task("copy", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("bundle", function () {
    return browserify({
            basedir: '.',
            debug: true,
            entries: [
                'src/ts/app.ts'
            ],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
});

gulp.task("minify", ["bundle"], function () {
    return gulp.src("dist/bundle.js")
       // .pipe(uglify({preserveComments: true}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("dist"))
});

gulp.task("default", ["copy", "bundle", "minify"]);