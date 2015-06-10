var Path = require('path');

var Hapi = require('hapi');

var server = new Hapi.Server({});

server.connection({port: 8000});

var options = {
	goodOptions: {
		opsInterval: 1000,
		reporters: [{
			reporter: require('good-console'),
			events: {log: '*', response: '*'}
		}]
	}
};

server.views({
	engines: {
		html: require('handlebars')
	},
	path: Path.join(__dirname, '../public')
});

server.register({
	register: require('good'),
	options: options.goodOptions
}, function (err) {
	if (err) {
		console.error(err);
	}
});

server.start(function () {
	console.log('Server running at:', server.info.uri);
});
