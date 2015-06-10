var gulp = require('gulp');
var myth = require('gulp-myth');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');

var tasks = requireDir('./tools/gulptasks');

gulp.task('default', ['clean'], function () {
	runSequence('prepare', ['client:html', 'client:styles', 'client:js', 'server']);
});

gulp.task('server', function () {
	return gulp.src('./.tmp/server/**/*.js')
		.pipe(changed('./dist/server'))
		.pipe(gulp.dest('./dist/server'));
});

gulp.task('models', function () {
	return gulp.src('./.tmp/models/**/*.js')
		.pipe(changed('./dist/models'))
		.pipe(gulp.dest('./dist/models'));
});

gulp.task('client:html', function () {

	return gulp.src('./src/client/*.html')
		.pipe(gulp.dest('dist/public'));
});

gulp.task('client:styles', function() {
	return gulp.src('./src/client/app.css')
		.pipe(myth({
			browsers: 'last 3 version'
		}))
		.pipe(gulp.dest('dist/public'));
});

gulp.task('watch', function () {
	runSequence(
		'clean',
		'prepare',
		['client:html', 'client:styles', 'server', 'models', 'global'],
		['client:watch', 'watchers']
	);
});

gulp.task('watchers', function () {
	gulp.watch(['./src/**/*.js'], ['prepare:javascript']);
	gulp.watch(['./src/**/*.ts'], ['prepare:typescript']);
	gulp.watch(['./src/**/*.html'], ['client:html']);
	gulp.watch(['./src/**/*.css'], ['client:styles']);

	gulp.watch(['./.tmp/models/**/*.js'], ['models']);
	gulp.watch(['./.tmp/server/**/*.js'], ['server']);
});
