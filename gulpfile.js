const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

// JS Dev
gulp.task('js:dev', function () {
    // set up the browserify instance on a task basis
    const b = browserify({
        entries: './src/js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/js/'));
});
// CSS Dev
gulp.task('css:dev', function () {
    return gulp.src('src/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
// HTML Dev
gulp.task('html:dev', function () {
    return gulp.src('public/*.html')
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Clean Build
gulp.task('clean', function () {
    return del('build/*');
});

// JS Build
gulp.task('js:build', function () {
    // set up the browserify instance on a task basis
    const b = browserify({
        entries: './src/js/app.js',
        debug: true
    });

    return b.bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'));
});
// CSS Build
gulp.task('css:build', function () {
    return gulp.src('src/scss/app.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});
// HTML Build
gulp.task('html:build', function () {
    return gulp.src('public/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build'));
});
// Images Build
gulp.task('images:build', function () {
    return gulp.src('public/images/**/*.{jpg,jepg,png,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'));
});

// Final Tasks
gulp.task('dev', function () {
    browserSync.init({
        server: {
            baseDir: 'public'
        },
    })
    gulp.watch('src/js/**/*.js', { ignoreInitial: false }, gulp.series(['js:dev']));
    gulp.watch('src/scss/**/*.scss', { ignoreInitial: false }, gulp.series(['css:dev']));
    gulp.watch('public/**/*.html', { ignoreInitial: false }, gulp.series(['html:dev']));
});
gulp.task('build', gulp.series(['clean', 'js:build', 'css:build', 'html:build', 'images:build']));