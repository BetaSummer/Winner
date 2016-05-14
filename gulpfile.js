var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

var paths = {
  scripts: ['**/*.js', '!node_modules/**/*.js', '!public/**/*.js', '!src/**/*.js']
};

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(paths.scripts)
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('css', function() {
  gulp.src('public/dist/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(minifycss())
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('images', function() {
  gulp.src('src/images/*.*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('public/dist/images'));
});

gulp.task('sass', function() {
  return sass('src/sass/*.scss')
    .on('error', function(err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('copyfonts', function() {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('public/dist/fonts/'));
});

gulp.task('auto', function() {
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/js/*js', ['js']);
  gulp.watch('dist/css/*.css', ['css']);
  gulp.watch('src/images/*.*', ['images']);
  gulp.watch('src/fonts/*.*', ['copyfonts']);
});

gulp.task('dist', ['sass', 'copyfonts', 'images']);

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('default', ['lint', 'dist', 'auto']);
