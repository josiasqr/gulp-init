import gulp from "gulp";
import babel from "gulp-babel";
import terser from "gulp-terser";
import concat from "gulp-concat";
import autoprefixer from "gulp-autoprefixer";
import pug from "gulp-pug";
import sass from "gulp-sass";
import clean from "gulp-purgecss";
import cacheBust from "gulp-cache-bust";
import imagemin from "gulp-imagemin";
import plumber from "gulp-plumber";
import { init as server, stream, reload } from "browser-sync";

const production = false;

// js
gulp.task("babel", () => {
  return gulp
    .src("./dev/js/*.js")
    .pipe(plumber())
    .pipe(concat("scripts.min.js"))
    .pipe(babel())
    .pipe(terser())
    .pipe(gulp.dest("./public/js"))
    .pipe(stream());
});
// views
gulp.task("views", () => {
  return gulp
    .src("./dev/views/pages/*.pug")
    .pipe(plumber())
    .pipe(
      pug({
        pretty: production ? false : true,
      })
    )
    .pipe(
      cacheBust({
        type: "timestamp",
      })
    )
    .pipe(gulp.dest("./public"))
    .pipe(stream());
});
// sass
gulp.task("sass", () => {
  return gulp
    .src("./dev/scss/styles.scss")
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(autoprefixer())
    .pipe(gulp.dest("./public/css"))
    .pipe(stream());
});
// purgecss
gulp.task("clean", () => {
  return gulp
    .src("./public/css/styles.css")
    .pipe(plumber())
    .pipe(
      clean({
        content: ["./public/*.html"],
      })
    )
    .pipe(gulp.dest("./public/css"));
});
// gulp-imagemin
gulp.task("imgmin", () => {
  return gulp
    .src("./dev/assets/images/*")
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 30, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 }),
      ])
    )
    .pipe(gulp.dest("./public/assets/images"));
});
//default gulp
gulp.task("default", () => {
  server({
    server: "./public",
  });
  gulp.watch("./dev/views/**/*.pug", gulp.series("views")).on("change", reload);
  gulp.watch("./dev/scss/**/*.scss", gulp.series("sass")).on("change", reload);
  gulp.watch("./dev/js/*.js", gulp.series("babel")).on("change", reload);
});
