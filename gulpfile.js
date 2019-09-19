const log = require("fancy-log");
const gulp = require("gulp");
const size = require("gulp-size");
const count = require("gulp-count");
const mocha = require("gulp-mocha");
const jsdoc = require("gulp-jsdoc3");
const eslint = require("gulp-eslint");
const cssnano = require("gulp-cssnano");
const replace = require("gulp-replace");
const terser = require("gulp-terser");
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
            terser({
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
        .pipe(
            count({
                message: "## js files copied",
                logger: msg => log(msg)
            })
        );
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
    gulp.watch(paths.scripts, gulp.series(["build-js"]));
});

gulp.task("watch-css", () => {
    gulp.watch(paths.css, gulp.series(["build-css"]));
});

gulp.task("lint", () => {
    return gulp
        .src(paths.scripts)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("lint-fix", () => {
    return gulp
        .src(paths.scripts)
        .pipe(eslint({ fix: true }))
        .pipe(eslint.format())
        .pipe(gulp.dest(file => file.base))
        .pipe(eslint.failAfterError());
});

gulp.task("test", () => {
    return gulp.src(paths.test).pipe(
        mocha({
            reporter: "spec"
        })
    );
});

gulp.task("build", gulp.series(["build-js", "build-css"]));

gulp.task("watch", gulp.parallel(["build", "watch-js", "watch-css"]));

gulp.task("default", gulp.series(["build"]));
