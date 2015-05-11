/*global -$ */
'use strict';
// generated on 2015-05-10 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('styles', function () {
  return gulp.src('webapp/app/styles/main.css')
    .pipe($.sourcemaps.init())
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('webapp/.tmp/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  return gulp.src('webapp/app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['webapp/.tmp', 'webapp/app', 'webapp/.']});

  return gulp.src('webapp/app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('webapp/dist'));
});

gulp.task('images', function () {
  return gulp.src('webapp/app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('webapp/dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('webapp/app/fonts/**/*'))
    .pipe(gulp.dest('webapp/.tmp/fonts'))
    .pipe(gulp.dest('webapp/dist/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'webapp/app/*.*',
    'webapp/!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('webapp/dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'fonts'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['webapp/.tmp', 'webapp/app'],
      routes: {
        '/bower_components': 'webapp/bower_components'
      }
    }
  });

  // watch for changes
  gulp.watch([
    'webapp/app/*.html',
    'webapp/app/scripts/**/*.js',
    'webapp/app/images/**/*',
    'webapp/.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('webapp/app/styles/**/*.css', ['styles']);
  gulp.watch('webapp/app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('webapp/app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('webapp/app'));
});

gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('webapp/dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
