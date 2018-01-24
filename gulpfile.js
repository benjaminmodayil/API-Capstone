var gulp = require('gulp')
const purgecss = require('gulp-purgecss')
var sass = require('gulp-sass')
var concat = require('gulp-concat')
var useref = require('gulp-useref')

var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var beep = require('beepbeep')

var uglify = require('gulp-uglify')
var gulpIf = require('gulp-if')
var cssnano = require('gulp-cssnano')
var imagemin = require('gulp-imagemin')
var cache = require('gulp-cache')
var del = require('del')

var runSequence = require('run-sequence')
var browserSync = require('browser-sync').create()

//need a function that takes sass from specific folders (pages, components, & anything not base/reset)
// it will purgecss from these files THEN the sass task without purgecss will take effect.

var onError = function(err) {
  notify.onError({
    title: 'Gulp error in ' + err.plugin,
    message: err.toString()
  })(err)
  beep(3)
  this.emit('end')
}

gulp.task('sass', function() {
  return (gulp
      .src('app/scss/**/*.scss')
      .pipe(plumber({ errorHandler: onError }))
      .pipe(sass()) // Using gulp-sass
      // .pipe(
      //   purgecss({
      //     content: ['app/**/*.html'],
      //     whitelistPatterns: [/js/]
      //   })
      // )
      .pipe(gulp.dest('app/css'))
      .pipe(
        browserSync.reload({
          // Reloading with Browser Sync
          stream: true
        })
      ) )
})

// need to call this one specifically
gulp.task('useref', function() {
  return (gulp
      .src('app/*.html')
      .pipe(plumber())
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      //might break (below)
      .pipe(gulp.dest('dist')) )
})

gulp.task('images', function() {
  return (gulp
      .src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
      .pipe(plumber())
      // Caching images that ran through imagemin
      .pipe(cache(imagemin({ interlaced: true })))
      .pipe(gulp.dest('dist/images')) )
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist')
})

gulp.task('cache:clear', function(callback) {
  return cache.clearAll(callback)
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.scss', ['sass'])
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload)
  gulp.watch('app/js/**/*.js', browserSync.reload)
  console.log("remember purgecss doesn't care about your JS class names")
})

gulp.task('build', function(callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback)
})

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'], callback)
})
