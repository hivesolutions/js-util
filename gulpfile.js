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
    pump([
        gulp.src(paths.scripts),
        uglifyes({
            mangle: false,
            ecma: 6
        }),
        replace("__VERSION__", _package.version),
        size(),
        size({
            gzip: true
        }),
        gulp.dest("./dist"),
        count("## js files copied")
    ]);
});

gulp.task("build-css", function() {
    pump([
        gulp.src(paths.css),
        cssnano(),
        size(),
        size({
            gzip: true
        }),
        gulp.dest("./dist"),
        count("## css files copied")
    ]);
});

gulp.task("test", function() {
    pump([
        gulp.src(paths.test),
        mocha({
            reporter: "spec"
        })
    ]);
});

gulp.task("default", ["build-js", "build-css"]);
