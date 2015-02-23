var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');
var uglify = require('gulp-uglify');

gulp.task('minify-html', function(){
  gulp.src('./public/blog/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public/blog'));
});

gulp.task('minify-js', function(){
  gulp.src('./public/blog/javascripts/octopress.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/blog/javascripts/'));
});

gulp.task('default', ['minify-html', 'minify-js']);
