const browserSync  = require('browser-sync');
const gulp         = require('gulp'),
			sass         = require('gulp-sass')(require('sass')),
			bulk         = require('gulp-sass-bulk-importer'),
			map          = require('gulp-sourcemaps'),
			clean        = require('gulp-clean'),
			cleanCSS     = require('gulp-clean-css'),
			autoprefixer = require('gulp-autoprefixer'),
			rename       = require("gulp-rename"),
			htmlmin      = require('gulp-htmlmin'),
			concat       = require('gulp-concat'),
			uglify       = require('gulp-uglify'),
			imagemin 		 = require('gulp-imagemin'),
			fileinclude  = require('gulp-file-include');

const { STYLE_LIBS, JS_LIBS } = require('./gulp.config');

gulp.task('clean', function() {
	return gulp.src('dist', {allowEmpty: true}).pipe(clean()); // Удаляем папку dist перед сборкой
});

gulp.task('server', function() {
	browserSync({
		server: {
			baseDir: "dist"
		},
		open: false
	});
	gulp.watch("src/component/**/*.html").on('change', browserSync.reload);
	gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles-vendor', function () {
	return gulp.src([...STYLE_LIBS])
	.pipe(autoprefixer())
	.pipe(cleanCSS({ compatibility: 'ie8' }))
	.pipe(concat("vendor.min.css"))
	.pipe(gulp.dest("dist/css"))
	.pipe(browserSync.stream());
});

gulp.task('styles-main', function () {
	return gulp.src("src/sass/**/*.+(scss|sass)")
	.pipe(map.init())
	.pipe(bulk())
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(rename({ suffix: '.min', prefix: '' }))
	.pipe(autoprefixer())
	.pipe(cleanCSS({compatibility: 'ie8' }))
	.pipe(map.write('../sourcemaps/'))
	.pipe(gulp.dest("dist/css"))
	.pipe(browserSync.stream());
});

gulp.task('watch', function () {
	gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles-vendor'));
	gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles-main'));
	gulp.watch("src/*.html").on('change', gulp.parallel('html'));
	gulp.watch("src/component/**/*.html").on('change', gulp.parallel('html'));
	gulp.watch('src/js/**/*.js').on('change', gulp.parallel('scripts'));
	gulp.watch('src/media/**/*.*').on('change', gulp.parallel('images'));
});

gulp.task('html', function () {
	return gulp
	.src("src/*.html")
	.pipe(fileinclude({
		prefix: '@@',
		basepath: '@file',
	}))
	.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
	.pipe(gulp.dest("dist/"));
});

gulp.task('scripts', function () {
	return gulp.src('src/js/**/*.js')
	.pipe(uglify())
	.pipe(concat('main.min.js'))
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.stream());
});

gulp.task('fonts', function () {
	return gulp.src("src/fonts/**/*")
	.pipe(gulp.dest("dist/fonts"));
});

gulp.task('icons', function () {
	return gulp.src("src/media/icons/*")
	.pipe(gulp.dest("dist/media/icons"));
});

gulp.task('images', function () {
	return gulp.src("src/media/images/*")
	.pipe(imagemin())
	.pipe(gulp.dest("dist/media/images"))
	.pipe(browserSync.stream());
});

gulp.task('default',
	gulp.parallel(
		'watch',
		'server',
		'styles-main',
		'styles-vendor',
		'scripts',
		'fonts',
		'icons',
		'images',
		'html',
	),
);
