/**
 * Gulpfile.js
 * Copyright (c) 2015 Johnie Hjelm
 * Using Browser Sync http://www.browsersync.io/, Autoprefixer, Sass, Uglify etc
 */

/*-------------------------------------------------------------------

    Required plugins

-------------------------------------------------------------------*/

var gulp        = require('gulp');
var package     = require('./package.json');
var plumber     = require('gulp-plumber');
var clean       = require('gulp-clean');
var cp          = require('child_process');
var concat      = require('gulp-concat');
var cssmin      = require('gulp-cssmin');
var imagemin    = require('gulp-imagemin');
var changed     = require('gulp-changed');
var header      = require('gulp-header');
var rename      = require('gulp-rename');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var gutil       = require('gulp-util');
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');
var reload      = browserSync.reload;


/*-------------------------------------------------------------------

    Config

-------------------------------------------------------------------*/

var dest = './assets/dist';
var src = './assets';
var config = {
  basePaths: {
    dest: dest,
    src: src
  },
  browsersync: {
    server: {
      baseDir: '_site'
    },
    notify: false
  },
  sass: {
    src: src + '/scss/**/*.scss',
    dest: dest,
    settings: {
      imagePath: '/images'
    }
  },
  scripts: {
    src: src + '/js/**/*.js',
    dest: dest
  },
  markup: {
    src: ['!node_modules/', '!bower_components/', '_config.yml', './**/*.html', 'index.html', '_layouts/*.html', '_posts/*', '_includes/*']
  },
  bowerjs:{
    base: './bower_components/'
  },
  images: {
    src: src + '/images/**',
    dest: dest + '/images'
  },
};


/*-------------------------------------------------------------------

    Banner

-------------------------------------------------------------------*/

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');


/*-------------------------------------------------------------------

    Tasks

-------------------------------------------------------------------*/

/**
 * Browser sync
 */

gulp.task('browsersync', ['jekyll-build', 'sass', 'scripts'], function() {
  browserSync(config.browsersync);
});


/**
 * Sass
 */

gulp.task('sass', ['images'], function () {
  return gulp.src(config.sass.src)
    .pipe(sass(config.sass.settings))
    .on('error', function(err) { gutil.log(err.message); })
    .pipe(prefix({ browsers: ['last 2 version'] }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package: package }))
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.reload({stream:true}));
});


/**
 * Scripts
 */

gulp.task('scripts', function() {
  return gulp.src([
      config.scripts.src
    ])
    .on('error', function(err) { gutil.log(err.message); })
    .pipe(concat(
      'main.js'
    ))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(header(banner, {
      package: package
    }))
    .pipe(gulp.dest(
      config.scripts.dest
    ));
});


/**
 * Images
 */

gulp.task('images', function() {
 return gulp.src(config.images.src)
   .pipe(changed(config.images.dest)) // Ignore unchanged files
   .pipe(imagemin()) // Optimize
   .pipe(gulp.dest(config.images.dest));
});


/**
 * Jekyll build
 */

gulp.task('jekyll-build', function (done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});


/**
 * Jekyll rebuild
 */

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browserSync.reload();
});


/**
 * Size of project
 */

gulp.task('size', function () {
  return gulp.src('_site/**')
    .pipe(size());
});


/**
 * Default
 */

gulp.task('default', ['browsersync', 'jekyll-build', 'watch']);


/*-------------------------------------------------------------------

    Watch

-------------------------------------------------------------------*/

gulp.task('setWatch', function() {
  global.isWatching = true;
});

gulp.task('watch', ['browsersync', 'setWatch'], function() {
  gulp.watch(config.sass.src,     ['sass', 'jekyll-rebuild']);
  gulp.watch(config.scripts.src,  ['scripts', 'jekyll-rebuild']);
  gulp.watch(config.images.src,   ['images', 'jekyll-rebuild']);
  gulp.watch(config.markup.src,   ['jekyll-rebuild']);
});
