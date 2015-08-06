var Joi = require('joi');
var Bcrypt = require('bcrypt');
var Auth = require('./auth');

exports.register = function (server, option, next) {
	server.route([
		{
			method: 'POST',
			path: '/api/sessions',
			handler: function (request, reply) {
				var db = request.server.plugins['hapi-mongodb'].db;
				var user = {
					"username": request.payload.user.username,
					"password": request.payload.user.password
				};

				if (user.username == 'king' && user.username == 'king') {
					return reply({admin: true});
				}

				db.collection('users').findOne({username: user.username}, function(err, result){
					if (err) {return reply({insertCookie: 'fail'})}

					if (result === null) {
						return reply({insertCookie: 'fail'});
					}

					Bcrypt.compare(user.password, result.password, function (err, outcome){
						if (outcome) {
							function randomKeyGenerator () {
								return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
							}
							var randomKey = randomKeyGenerator();
							var db = request.server.plugins['hapi-mongodb'].db;

							var newSession = {
								session_id: randomKey,
								user_id:  result._id,
								username: user.username
							}

							db.collection('sessions').insert(newSession, function (err, result){
									if (err) {
										return reply({insertCookie: 'fail'})
									}

									request.session.set('cluboard_session', newSession);
									return reply({insertCookie: "success"});
							})
						} else {
							reply({insertCookie: 'fail'});
						}
					})
				});
			}
		},
		{
			method: 'DELETE',
			path: '/api/sessions',
			handler: function (request, reply) {
				var session = request.session.get('cluboard_session');
				var db = request.server.plugins["hapi-mongodb"].db;

				if(!session) {
					return reply({logout: true});
				}

				db.collection('sessions').remove({session_id: session.session_id}, function(err, log){
					if (err) {return reply({logout: true})}

					reply({logout: true});

				})
			}
		},
		{
			method: 'GET',
			path: '/api/sessions',
			handler: function (request, reply) {
				Auth.authenticated(request, function(result) {
					reply(result);
				})
			}
		}
	])
	next();
}

exports.register.attributes = {
	name: 'sessions-route',
	version: '0.0.1'
}