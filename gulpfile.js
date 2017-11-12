const gulp = require("gulp");
const size = require("gulp-size");
const uglify = require("gulp-uglify");
const replace = require("gulp-replace");
const _package = require("./package.json");

var paths = {
    scripts: "lib/**/*.js"
};

gulp.task("build", function() {
    return gulp.src(paths.scripts)
        .pipe(replace("__VERSION__", _package.version))
        .pipe(size())
        .pipe(size({
            gzip: true
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["build"]);
