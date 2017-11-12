const gulp = require("gulp");
const size = require("gulp-size");
const count = require("gulp-count");
const mocha = require("gulp-mocha");
const replace = require("gulp-replace");
const _package = require("./package.json");

var paths = {
    scripts: "lib/**/*.js",
    test: "test/**/*.js"
};

gulp.task("build", function() {
    return gulp.src(paths.scripts)
        .pipe(replace("__VERSION__", _package.version))
        .pipe(size())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest("./dist"))
        .pipe(count("## assets copied"));
});

gulp.task("test", function() {
    gulp.src(paths.test)
        .pipe(mocha({reporter: "spec"}));
});

gulp.task("default", ["build"]);
