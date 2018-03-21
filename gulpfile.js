var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');
var del = require('del');

function serve(cb) {
  require('./server/app.js');
  cb();
}

function clean() {
  return del(['./dist']);
}

function inline() {
  return gulp.src('client/index.html')
    .pipe(inlinesource({
      rootpath: __dirname + '/client',
      compress: false
    }))
    .pipe(gulp.dest('./dist'));
}

function sw() {
  return gulp.src('./client/js/sw.js')
    .pipe(gulp.dest('./dist'));
}

function styles() {
  return gulp.src('./client/css/styles.css')
    .pipe(gulp.dest('./dist'));
}

function components() {
  return gulp.src('./client/components/*.js')
    .pipe(gulp.dest('./dist/components'));
}

function build() {
  return gulp.series(
    clean,
    gulp.parallel(serve, inline, sw, styles, components)
  )();
}

gulp.task('default', build);
