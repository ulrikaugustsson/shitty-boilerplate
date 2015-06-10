var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var riotify = require('riotify');

gulp.task('client:js', function () {
	var bundler = browserify({
		entries: './.tmp/client/index.js',
	});

	bundler.on('log', gutil.log);
	bundler
		.transform(riotify);

	bundle(bundler);
});

gulp.task('client:watch', function () {
	var bundler = watchify(browserify(watchify.args));

	bundler.add('./.tmp/client/index.js');
	bundler.on('update', bundle.bind(null, bundler));
	bundler.on('log', gutil.log);

	bundler
		.transform(riotify);

	bundle(bundler);
});

function bundle(bundler) {
	return bundler.bundle()
		// log errors if they happen
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('index.js'))
		// optional, remove if you dont want sourcemaps
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
		.pipe(sourcemaps.write('./')) // writes .map file
		//
		.pipe(gulp.dest('./dist/public'));
}
