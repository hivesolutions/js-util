const gulp = require("gulp");
const size = require("gulp-size");
const count = require("gulp-count");
const mocha = require("gulp-mocha");
const jsdoc = require("gulp-jsdoc3");
const eslint = require("gulp-eslint");
const cssnano = require("gulp-cssnano");
const uglifyes = require("gulp-uglifyes");
const replace = require("gulp-replace");
const _package = require("./package.json");

const paths = {
    scripts: "lib/**/*.js",
    css: "lib/**/*.css",
    docs: "lib/**/*.js",
    test: "test/**/*.js"
};

gulp.task("build-js", () => {
    return gulp
        .src(paths.scripts)
        .pipe(
            uglifyes({
                mangle: false,
                ecma: 5
            })
        )
        .pipe(replace("__VERSION__", _package.version))
        .pipe(size())
        .pipe(
            size({
                gzip: true
            })
        )
        .pipe(gulp.dest("dist"))
        .pipe(count("## js files copied"));
});

gulp.task("build-css", () => {
    return gulp
        .src(paths.css)
        .pipe(cssnano())
        .pipe(size())
        .pipe(
            size({
                gzip: true
            })
        )
        .pipe(gulp.dest("dist"))
        .pipe(count("## css files copied"));
});

gulp.task("docs", cb => {
    gulp.src(["README.md", paths.docs], {
        read: false
    }).pipe(jsdoc(cb));
});

gulp.task("watch-js", () => {
    gulp.watch(paths.scripts, ["build-js"]);
});

gulp.task("watch-css", () => {
    gulp.watch(paths.css, ["build-css"]);
});

gulp.task("lint", () => {
    return gulp
        .src(paths.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("test", () => {
    return gulp.src(paths.test).pipe(
        mocha({
            reporter: "spec"
        })
    );
});

gulp.task("watch", ["build", "watch-js", "watch-css"]);

gulp.task("build", ["build-js", "build-css"]);

gulp.task("default", ["build"]);
