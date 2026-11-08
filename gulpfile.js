const { src, dest, series, parallel, watch } = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

// Таск для обробки HTML (з підтримкою include)
function html() {
    return src('src/app/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
}

// Таск для компіляції SCSS у єдиний мінімізований index.min.css
function styles() {
    return src('src/app/scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rename('index.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Таск для копіювання мініфікованого CSS Bootstrap у dist/css
function bootstrapCss() {
    return src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

// Таск для копіювання мініфікованого JS Bootstrap у dist/js
function bootstrapJs() {
    return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// Таск для обробки власного JavaScript
function scripts() {
    return src('src/app/js/**/*.js')
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

// Таск для зображень
function images() {
    return src('src/app/imgs/**/*.*', { allowEmpty: true, encoding: false })
        .pipe(dest('dist/imgs'))
        .pipe(browserSync.stream());
}

// Таск для локального сервера та відстеження змін
function serve() {
    browserSync.init({
        server: { baseDir: './dist' },
        browser: "chrome"
    });

    watch('src/app/**/*.html', html);
    watch('src/app/scss/**/*.scss', styles);
    watch('src/app/js/**/*.js', scripts);
    watch('src/app/imgs/**/*', images);
}

// Експорт тасків за замовчуванням
exports.default = series(
    parallel(html, styles, bootstrapCss, bootstrapJs, scripts, images),
    serve
);