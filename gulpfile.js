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

gulp.task("build", function(cb) {
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
    ], cb);
});

gulp.task("test", function() {
    gulp.src(paths.test)
        .pipe(mocha({
            reporter: "spec"
        }));
});

gulp.task("default", ["build"]);
