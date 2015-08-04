var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server();

server.connection({
	host: '0.0.0.0',
	port: process.env.PORT || 3000,
	routes: {
		cors: {
			headers: ["Access-Control-Allow-Credentials"],
			credentials: true
		}
	}
})

server.views({
	engines: {
		html: require('handlebars')
	},
	path: Path.join(__dirname, "templates")
});

var plugins = [
	{ register: require('./routes/api/users.js')},
	{ register: require('./routes/api/sessions.js')},
	{ register: require('./routes/api/static-pages.js')},
	{ register: require('hapi-mongodb'),
		options: {
			url: process.env.MONGOLAB_URI || "mongodb://127.0.0.1:27017/cluboard",
			settings: {
				db: {
					"native_parser": false
				}
			}
		}
	},
	{
		register: require('yar'),
		options: {
			cookieOptions: {
				password: process.env.COOKIE_PASSWORD || "asdasdasd",
				isSecure: false
			}
		}
	}
]

server.register(plugins, function(err){
	if (err) {
		throw err;
	}

	server.start(function(){
		console.log('info', 'Server running at: ' + server.info.uri);
	})
})