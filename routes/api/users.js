var Joi = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function (server, option, next) {
	server.route([
		{
			method: 'GET',
			path: '/api/users',
			handler: function (request, reply) {
				var db = request.server.plugins["hapi-mongodb"].db;
				db.collection('users').find().toArray(function(err, userslist) {
					if (err) {return reply({create: false})}
					reply(userslist);
				})

			}
		},
		{
			method: 'GET',
			path: '/api/users/',
			handler: function (request, reply) {
				var db = request.server.plugins["hapi-mongodb"].db;
				db.collection('users').findOne({_id: encodeURIComponent(request.params.id)}, function (err, writeResult){
					if (err) {return reply({fail: true})};
					reply(writeResult);
				});
			}
		},
		{
			method: 'POST',
			path: '/api/users',
			handler: function(request, reply) {
				var db = request.server.plugins["hapi-mongodb"].db;
				
				var user = {
					username: request.payload.user.username,
					password: request.payload.user.password,
					clubList: [],
					createDate: new Date()
				}

				var uniqueNameQuery = {username: user.username};
				
				db.collection('users').count(uniqueNameQuery, function (err, doc){
					
					if (doc >= 1) { 
						return reply({create: false})
					}

					Bcrypt.genSalt(10, function (err, salt){
						Bcrypt.hash(user.password, salt, function (err, hash) {
							user.password = hash;
							db.collection('users').insert(user, function (err, doc) {
								if (err) {return reply({create: false})}
								return reply({create: true})
							})
						})
					})
				})
			}
		}
	])
	next();
};

exports.register.attributes = {
	name: 'users-route',
	version: '0.0.1'
}