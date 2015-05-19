var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('sass', function () {
	gulp.src('app/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest('app/css'));
});

// Watch
// --------------------
gulp.task('watch', ['sass'], function(){
   browserSync({
   	server: {
      baseDir: 'app'
    },
    notify: true,
    port: 9000
    // proxy: "web.dev"
  });

  gulp.watch([
    'app/*.html',
    'app/css/*.css',
    'app/scripts/*.js',
    'app/scripts/**/*.js',
    'app/img/**/*.{png,jpg,gif}',
  ]).on('change', reload);

  gulp.watch('app/scss/**/*', ['sass']);

});

gulp.task('default', function () {
  gulp.start('watch');
});