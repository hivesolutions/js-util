const gulp = require("gulp");
const size = require("gulp-size");
const count = require("gulp-count");
const mocha = require("gulp-mocha");
const uglify = require("gulp-uglifyes");
const replace = require("gulp-replace");
const _package = require("./package.json");
const pump = require("pump");

var paths = {
    scripts: "lib/**/*.js",
    test: "test/**/*.js"
};

gulp.task("build", function() {
    pump([
        gulp.src(paths.scripts),
        uglify({
            mangle: false,
            ecma: 6
        }),
        replace("__VERSION__", _package.version),
        size(),
        size({
            gzip: true
        }),
        gulp.dest("./dist"),
        count("## assets copied")
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

gulp.task("default", ["build"]);
