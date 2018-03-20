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

function build() {
  return gulp.series(
    clean,
    gulp.parallel(serve, inline)
  )();
}

gulp.task('default', build);
