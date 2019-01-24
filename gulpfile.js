var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    clean = require('gulp-clean');

    gulp.task('serve', function(){ 
      browserSync.init({ server: 'build' }); 
      browserSync.watch('build/**/*.*').on('change', browserSync.reload); 
    });

    gulp.task('html', function() { 
      return gulp.src('src/static/**/*.html')
      .pipe(gulp.dest('build')) 
    });

    gulp.task('sass', function() { 
      return gulp.src('src/static/styles/**/*.scss') 
      .pipe(sass({
        includePaths: require('node-normalize-scss').includePaths
      })) 
      .pipe(autoprefixer({
        browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
        cascade: false
      }))
      .pipe(cssnano())
      .pipe(rename({ suffix: '.min' }))
      .on("error", notify.onError({
        title: "Error running something"
      }))
      .pipe(gulp.dest('build/styles')) 
    });

    gulp.task('js-libs', function () {
      return gulp.src([
          'node_modules/jquery/dist/jquery.min.js',
          'node_modules/slick-carousel/slick/slick.min.js',
      ], { allowEmpty: true })
          .pipe(concat('libs.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('build/js'))
    });

    gulp.task('js', function () {
      return gulp.src([
          'src/static/js/main.js',
      ], { allowEmpty: true })
          .pipe(concat('main.min.js'))
          .pipe(uglify())
          .pipe(gulp.dest('build/js'))
    });

    gulp.task('img', function (done) {
      gulp.src('src/static/img/**/*')
      .pipe(imagemin([
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      ]))
      .pipe(gulp.dest('build/img'));
      done();
      });

    gulp.task('watch', function() {
      gulp.watch('src/static/styles/**/*.scss', gulp.series('sass'));
      gulp.watch('src/static/**/*.html', gulp.series('html'));
      gulp.watch('src/static/js/**/*.js', gulp.series('js'));
    });

    gulp.task('clean', function () {
      return gulp.src('build', { allowEmpty: true })
          .pipe(clean({ force: true }));
    });

    gulp.task('default', gulp.series(
      'clean',
      'html',
      'sass',
      'js',
      gulp.parallel('js-libs','img'),
      gulp.parallel('watch','serve')
    ));



