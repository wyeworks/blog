var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');
var uglify = require('gulp-uglify');

gulp.task('minify-html', function(){
  gulp.src('./public/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('minify-js', function(){
  gulp.src('./public/javascripts/octopress.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('default', ['minify-html', 'minify-js']);
