var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');

gulp.task('minify', function(){
  gulp.src('./public/**/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./public'))
});

gulp.task('default', function(){
  // the actions arise
});
