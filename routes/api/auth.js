module.exports = {};

module.exports.authenticated = function(request, callback) {
	var session = request.session.get('cluboard_session');
	var db = request.server.plugins['hapi-mongodb'].db;

	if (!session) {
		return callback({authenticated:false})
	}

	db.collection('sessions').findOne({"session_id": session.session_id}, function (err, result){
		if (result === null) {
			return callback({
				authenticated: false,
			})
		} else {
			return callback ({
				authenticated: true,
				session: session
			})
		}
	})
}