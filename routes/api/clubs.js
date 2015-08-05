exports.register = function (server, option, next) {
	server.route([
		{
			method: 'POST',
			path: '/api/clubs',
			handler: function (request, reply) {
				var db = request.server.plugins['hapi-mongodb'].db;
				var club = {
					"clubname": request.payload.club.clubname,
					"clubcode": request.payload.club.clubcode
				}
				db.collection('clubs').insert(club, function(err, result){
					if (err) {return reply('Can\'t add a club!')};
					reply('added!')
				})
			}
		},
		{
			method: 'GET',
			path: '/api/clubs',
			handler: function (request, reply) {
				var db = request.server.plugins['hapi-mongodb'].db;
				db.collection('clubs').find().toArray(function(err, result){
					if(err) {return reply('Can\'t retrieve clublist')}
					reply(result);
				})
			}
		}



	])
	next();
}

exports.register.attributes = {
	name: 'clubs-route',
	version: '0.0.1'
}