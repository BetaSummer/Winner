var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-ruby-sass');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');

gulp.task('js', function () {
    return gulp.src('src/js/*js')
        // .pipe(uglify())
        .pipe(gulp.dest('public/dist/js'));
});

gulp.task('css', function () {
    gulp.src('public/dist/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('public/dist/css'))
})

gulp.task('images', function () {
    gulp.src('src/images/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('public/dist/images'))
});

gulp.task('sass', function() {
    return sass('src/sass/*.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
   })
    .pipe(gulp.dest('public/dist/css'))
});


gulp.task('copyfonts', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('public/dist/fonts/'))
});

// gulp.task('jade', function() {
//   gulp.src('jade/**/*.jade')
//     .pipe(jade())
//     .pipe(gulp.dest('views/'))
// });

gulp.task('auto',function(){
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/js/*js', ['js']);
  // gulp.watch('dist/css/*.css', ['css']);
  gulp.watch('src/images/*.*', ['images']);
  gulp.watch('src/fonts/*.*', ['copyfonts']);
  // gulp.watch('jade/**/*.jade',['jade']);
})
gulp.task('default',['auto'])
