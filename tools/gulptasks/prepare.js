var gulp = require('gulp');
var ts = require('gulp-typescript');
var inject = require('gulp-inject');
var sort = require('gulp-sort');
var changed = require('gulp-changed');

var tsProject = ts.createProject({
	removeComments: 	true,
	noImplicitAny: 		false,
	target: 			'ES5',
	module: 			'commonjs',
	declarationFiles: 	false,
	typescript:			require('typescript')
});

gulp.task('prepare', ['prepare:typescript', 'prepare:javascript','prepare:tag']);

gulp.task('prepare:typescript', ['prepare:typings'], function () {
	var tsResult = gulp.src(['src/**/*.ts'])
		.pipe(changed('.tmp'))
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest('.tmp'));
});

gulp.task('prepare:javascript', function () {
	return gulp.src(['src/**/*.js'])
		.pipe(changed('.tmp'))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('prepare:typings', function () {
	var targetFolder = 'tools/typings';
	var targetFilename = targetFolder + '/customTypings.d.ts';
	var typescriptMatcher = [
		'./src/**/*.ts'
	];

	var target = gulp.src(targetFilename);
	var tsFiles = gulp.src(typescriptMatcher)
			.pipe(sort());

	return target
			.pipe(inject(tsFiles, {
				starttag:  '//{',
				endtag:    '//}',
				transform: function (filepath) {
					return '/// <reference path="../..' + filepath + '" />';
				}
			}))
			.pipe(gulp.dest(targetFolder));
});
