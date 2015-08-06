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
        db.collection('clubs').insert(club, function(err, writeResult){
          if (err) {return reply({addclub: false})};
          reply({addclub: true})
        })
      }
    },
    {
      method: 'GET',
      path: '/api/clubs',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('clubs').find().toArray(function(err, clubs){
          if(err) {return reply('Can\'t retrieve clublist')}
          reply(clubs);
        })
      }
    },
    {
      method: "POST",
      path: '/api/admin/club',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var code = request.payload.input;
        db.collection('clubs').findOne({'clubcode': code}, function(err, writeResult){
          if (err) {return reply({getHint: false})};
          reply({hint: writeResult.clubname});
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