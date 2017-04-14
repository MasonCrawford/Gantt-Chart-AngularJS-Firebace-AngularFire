var gulp = require('gulp'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  compass = require('gulp-compass'),
  uglify = require('gulp-uglify'),
  minifyHTML = require('gulp-minify-html'),
  jsonminify = require('gulp-jsonminify'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat');

var env,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

  env = process.env.NODE_ENV || 'development';

  if (env==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
  } else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
  }

jsSources = [
  'assets/js/services/*.js',
  'assets/js/controllers/*.js',
  'assets/js/app.js'
];

sassSource = ['assets/css/main.scss'];
htmlSources = ['builds/development/views/*.html'];
jsonSources = [outputDir + 'js/*.json'];


gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'assets/js'))
    .pipe(connect.reload())
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
    .pipe(connect.reload())
});

gulp.task('views', function() {
  gulp.src('builds/development/views/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'views')))
});

gulp.task('compass', function() {
  gulp.src(sassSource)
    .pipe(compass({
      style: sassStyle,
      image: 'builds/development/assets/img',
      sass: 'assets/css',
      css: outputDir + 'assets/css'
    })
    .on('error', gutil.log))
    .pipe(gulp.dest(outputDir + 'assets/css'))
    .pipe(connect.reload())
});


gulp.task('watch', function() {
  gulp.watch('assets/js/**/*.js', ['js']);
  gulp.watch('assets/css/**/*', ['compass']);
  gulp.watch('builds/development/*.html',['html']);
  gulp.watch(outputDir + 'assets/css/main.css',['html']);
  gulp.watch('builds/development/views/*.html',['views']);
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'production', jsonminify()))
    .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
    .pipe(connect.reload())
});

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});


gulp.task('default', ['html', 'views', 'json', 'js', 'compass', 'connect', 'watch']);
