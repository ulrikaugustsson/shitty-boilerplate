var Path = require('path');

var Hapi = require('hapi');
var hapiSwaggered = require('hapi-swaggered')
var hapiSwaggeredUi = require('hapi-swaggered-ui')

var db = require('./database')();
var Article = require('./models/Article');
var Category = require('./models/Category');
var Shopcart = require('./models/Shopcart');

var azureAccount = [
	'DefaultEndpointsProtocol=',
	'http;',
	'AccountName=',
	process.env.AZURE_STORAGE_ACCOUNT,
	';AccountKey=',
	process.env.AZURE_STORAGE_ACCESS_KEY,
	';'
];

var server = new Hapi.Server({
	cache: [
		{
			name: 'azureTables',
			engine: require('catbox-azure-table'),
			connection: azureAccount.join(''),
			partition: 'stridhmediastore',
			ttl_interval: 1 * 60 * 60 * 1000
		}
	]
});

server.connection({ port: 8000 });

var options = {
	goodOptions: {
		opsInterval: 1000,
	    reporters: [{
	        reporter: require('good-console'),
	        events: { log: '*', response: '*' }
	    }]
	},
    yarOptions: {
		cache: {
			cache: 'azureTables' 
		},
		cookieOptions: {
        	password: 'password',
			isSecure: false
    	}
	},
	swaggeredOptions: {
		supportedMethods: ['get', 'post'],
		info: {
			title: 'Stridhmedia',
			description: 'Stridhmedia',
			version: '0.5'
		}
	},
	swaggeredUiOptions: {
		title: 'Stridhmedia',
		swaggerOptions: {}, // see above
		authorization: { // see above
			field: 'apiKey',
			scope: 'query' // header works as well
			// valuePrefix: 'bearer '// prefix incase
		}
    }
};

server.views({
	engines: {
		html: require('handlebars')
	},
	path: Path.join(__dirname, '../public')
});

var models = db.sequelize.models;

// Add models
var article = new Article({models: models});
var category = new Category({models: models});
var shopcart = new Shopcart();

var myModels = {article: article, category: category, shopcart: shopcart};

server.register({
    register: require('good'),
    options: options.goodOptions
}, function (err) {
    if (err) {
        console.error(err);
    }
});

server.register({
    register: require('yar'),
    options: options.yarOptions
}, function (err) {
	console.error(err);
});

server.register(
	[{
		register: require('hapi-documentdb'),
		options: {
			endpoint: process.env.AZURE_DOCUMENTDB_ENDPOINT,
			masterKey: process.env.AZURE_DOCUMENTDB_MASTERKEY
		}
	}],
	function (err) {
		if (err) {
	        console.error(err);
	    }
	}
);

server.register(require('hapi-auth-cookie'), function (err) {
    server.auth.strategy('admin', 'cookie', {
        password: process.env.COOKIE_PASSWORD || 'secret',
        cookie: 'stridhmedia-admin',
        redirectTo: '/admin/login',
        isSecure: false
    });
});

server.register(
	{
		register: hapiSwaggered,
		options: options.swaggeredOptions
	}, {
		routes: {
			prefix: '/swagger'
		}
	}, function (err) {
		console.error(err);
	}
);

server.register(
	{
		register: hapiSwaggeredUi,
		options: options.swaggeredUiOptions
	}, {
		routes: {
			prefix: '/docs'
		}
	}, function (err) {
		console.error(err);
	}
);

server.register(
	[
		{
			register: require('./api-routes.js'),
			options: {models: myModels}
		},
		{
			register: require('./modules/article')
		},
		{
			register: require('./modules/category')
		}
	],
	{
		routes: {
			prefix: '/api'
		}
	},
	function (err)
	{
		if (err)
		{
			server.log('ERROR', 'Failed to load API routes');
			return;
		}
		server.log('INFO', 'Loaded API routes')
	}
);
	
server.register(
	[
		{
			register: require('./routes.js'),
			options: {models: myModels}
		},
		{
			register: require('./modules/admin')
		}
	],
	function (err)
	{
		if (err)
		{
			server.log('ERROR', 'Failed to load routes');
			return;
		}
		server.log('INFO', 'Loaded routes')
	}
);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
