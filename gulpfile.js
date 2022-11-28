const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const del = require('del');
const rename = require('gulp-rename');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

const html = () => {
    return gulp.src('src/html/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.stream());
}

exports.html = html;

const styles = () => {
    return gulp
        .src('./src/less/style.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(
            autoprefixer({
                cascade: false
            })
        )
        .pipe(gulp.dest('./build/css'))
        .pipe(cleanCSS())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream());
}

exports.styles = styles;

const svg_sprite = () => {
    return gulp
        .src('./src/svg/**/*.svg')
        .pipe(gulp.dest('./build/svg/'))
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg'
                    }
                }
            })
        )
        .pipe(gulp.dest('./build/svg/'));
}

exports.svg_sprite = svg_sprite;

const js = () => {
    return gulp
        .src('./src/js/*.js')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(gulp.dest('./build/js'));
}

exports.js = js;

const clean = () => {
    return del(['build/*']);
}

exports.clean = clean;

const watch = () => {
    browserSync.init({
        server: {
            baseDir: './build/'
        }
    });

    gulp.watch('./src/less/**/*.less', styles);
    gulp.watch('./src/svg/**/*.svg', svg_sprite);
    gulp.watch('./src/js/*.js', js);
    gulp.watch('./src/html/*.html', html);
}

exports.watch = watch;

const build = gulp.series(
    clean,
    gulp.parallel(
        html,
        styles,
        svg_sprite,
        js
    )
);

exports.build = build;

exports.dev = gulp.series(
    build,
    watch
);