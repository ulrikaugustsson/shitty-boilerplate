/// <reference path="../../../../tools/typings/customTypings.d.ts" />

exports.register = function (server, options, next) {

	var internals = {};

	next();
}

exports.register.attributes = {
	name: 'module',
	version: '1.0.0'
};
