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
		},
		{
			method: "PUT",
			path: "/api/users/club",
			handler: function(request, reply) {
				var db = request.server.plugins['hapi-mongodb'].db;
				var session = request.session.get('cluboard_session');
				db.collection('clubs').findOne({clubcode: request.clubcode}, function(err, targetClub) {
					if (err) {return reply('opsss!')}
					db.collection('users').findOne({username: session.session.username}, function (err,targetUser) {
						if (err) {return reply('Can\'t find it!')}
						targetUser.clublist.push(targetClub.clubname);
						reply(targetUser.clublist);
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