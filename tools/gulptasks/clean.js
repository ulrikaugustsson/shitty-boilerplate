var del = require('del');
var gulp = require('gulp');

gulp.task('clean', ['clean:tmp', 'clean:dist']); 

gulp.task('clean:tmp', function (cb) {
	return del(['.tmp/**/*'], cb);
});

gulp.task('clean:dist', function (cb) {
	return del(['dist/**/*'], cb);
});