var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();

var paths = {
  scripts: ['**/*.js', '!node_modules/**/*.js', '!public/dist/**/*.js', '!public/lib/**/*.js']
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
  return gulp.src('public/js/*.js')
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
  gulp.src('public/images/*.*')
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('public/dist/images'));
});

gulp.task('sass', function() {
  return sass('public/sass/*.scss')
    .on('error', function(err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest('public/dist/css'));
});

gulp.task('copyfonts', function() {
  gulp.src('public/fonts/**/*')
    .pipe(gulp.dest('public/dist/fonts/'));
});

gulp.task('auto', function() {
  gulp.watch('public/sass/*.scss', ['sass']);
  gulp.watch('public/js/*js', ['js']);
  gulp.watch('public/dist/css/*.css', ['css']);
  gulp.watch('public/images/*.*', ['images']);
  gulp.watch('public/fonts/*.*', ['copyfonts']);
});

gulp.task('browser-sync', function() {
  var files = [
    'views/admin/**/*.jade',
    'public/dist/css/*.css',
    'public/dist/js/*.js',
    'public/dist/images/*.*'
  ];
  browserSync.init(files, {
    proxy: '127.0.0.1:3000'
  });
});

gulp.task('dist', ['js', 'sass', 'copyfonts', 'images']);

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('default', ['lint', 'dist', 'auto', 'browser-sync']);
