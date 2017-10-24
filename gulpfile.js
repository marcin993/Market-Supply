const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const runSequence = require("run-sequence");
const sass = require("gulp-sass");
const gcmq = require("gulp-group-css-media-queries");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");


const scripts = ["bower_components/jquery/dist/jquery.min.js", "src/js/scripts.js", "src/js/prefixfree.min.js"];

gulp.task("serve", function() {
    browserSync.init({
        server: "dist"
    });

    gulp.watch("src/sass/*.scss", ["styles"]);
    gulp.watch("src/index.html", ["html"]);
    gulp.watch("src/js/*.js", ["scripts"]);
    gulp.watch("src/images/*", ["images"])
    gulp.watch("dist/css/*", browserSync.reload);
});

gulp.task("styles", function(cb) {
    runSequence("sass", "css", cb);
});

gulp.task("sass", function() {
    return gulp.src("src/sass/*.scss")
            .pipe(sass())
            .pipe(rename("style.min.css"))
            .pipe(gulp.dest("dist/css"));
});

gulp.task("css", function() {
    return gulp.src("dist/css/style.min.css")
            .pipe(gcmq())
            .pipe(cleanCss())
            .pipe(gulp.dest("dist/css"));
});

gulp.task("html", function() {
    return gulp.src("src/index.html")
            .pipe(gulp.dest("dist/"))
            .pipe(browserSync.stream());
});

gulp.task("scripts", function(cb) {
    return gulp.src(scripts)
           .pipe(uglify({
             output: {
               comments: /^!/
             }
           }))
           .pipe(concat("all.js"))
           .pipe(gulp.dest("dist/js"))
           .pipe(browserSync.stream());
});

gulp.task("images", function() {
    return gulp.src("src/images/*")
            .pipe(imagemin())
            .pipe(gulp.dest("dist/images"));
});

gulp.task("FontAwesome", function() {
    gulp.src("src/css/font-awesome.css")
     .pipe(gulp.dest("dist/css"));

    gulp.src("src/font/*")
     .pipe(gulp.dest("dist/font"));
});

gulp.task("build", function(cb) {
    runSequence("styles", "scripts", "html", "images", "FontAwesome", cb);
});

gulp.task("default", function() {
  	runSequence("build", "serve");
});
