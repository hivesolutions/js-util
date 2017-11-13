const gulp = require("gulp");
const size = require("gulp-size");
const count = require("gulp-count");
const mocha = require("gulp-mocha");
const cssnano = require("gulp-cssnano");
const uglifyes = require("gulp-uglifyes");
const replace = require("gulp-replace");
const _package = require("./package.json");
const pump = require("pump");

var paths = {
    scripts: "lib/**/*.js",
    css: "lib/**/*.css",
    test: "test/**/*.js"
};

gulp.task("build-js", function() {
    gulp.src(paths.scripts)
        .pipe(uglifyes({
            mangle: false,
            ecma: 6
        }))
        .pipe(replace("__VERSION__", _package.version))
        .pipe(size())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest("./dist"))
        .pipe(count("## js files copied"));
});

gulp.task("build-css", function() {
    gulp.src(paths.css)
        .pipe(cssnano())
        .pipe(size())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest("./dist"))
        .pipe(count("## css files copied"));
});

gulp.task("test", function() {
    gulp.src(paths.test)
        .pipe(mocha({
            reporter: "spec"
        }));
});

gulp.task("default", ["build-js", "build-css"]);