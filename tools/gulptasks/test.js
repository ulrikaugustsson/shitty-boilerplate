/*var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('test:services', function (cb) {
	gulp.src(['./static/services/*.js', '!./static/services/index.js'])
		.pipe(istanbul({
			includeUntested: true,
			reporters: ['html']
		}))
		.pipe(istanbul.hookRequire())
		.on('finish', function () {
			return gulp.src('./test/unit/services/*.js', {read: false})
			.pipe(mocha())
			.pipe(istanbul.writeReports()) // Creating the reports after tests runned
			.on('end', cb);
		});
});

gulp.task('test', ['test:services']);*/
