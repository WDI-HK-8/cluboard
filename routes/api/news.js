exports.register = function (server, option, next) {
  server.route([
    {
      method: 'POST',
      path: '/api/news',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        db.collection('clubs').findOne({'clubcode': request.payload.clubcode}, function (err, club){
          if (err){return reply({insertfail: true})}
          var news = {
            title: request.payload.title,
            content:  request.payload.content,
            clubcode: request.payload.clubcode,
            clubname: club.clubname,
            createDate: new Date()
          }

          db.collection('news').insert(news, function (err, writeResult){
            if (err) {return reply({insertfail: true})};

            reply ({insertfail: false});
          });
        });
      }
    },
    {
      method: 'GET',
      path: '/api/users/news',
      handler: function (request, reply){
        var db      = request.server.plugins['hapi-mongodb'].db;
        var session = request.session.get('cluboard_session');
        
        db.collection('users').findOne({'username': session.username}, function (err, user){
          if (err) { return reply({getNews: false}) };

          db.collection('news').find({"clubcode": {$in: user.clubList}}).sort({createDate: -1}).toArray(function (err, news){
            if (err) { return reply({getNews: false}) };
            return reply(news);
          })
        })
      }
    },
    {
      method: 'GET',
      path: '/api/users/news/search/{query}',
      handler: function (request, reply){
        var db         = request.server.plugins['hapi-mongodb'].db;
        var session    = request.session.get('cluboard_session');
        var searchTerm = encodeURIComponent(request.params.query).toString();
        


        db.collection('users').findOne({'username': session.username}, function (err, user){
          if (err) { return reply({getNews: false}) };
          db.collection('news').find({$and: [{"clubcode": {$in: user.clubList}}
            ,
            {"title": {$regex: new RegExp(searchTerm,"i")}}
            ]}).sort({createDate: -1}).toArray(function (err, news){
            if (err) { return reply({getNews: false}) };
            return reply(news);
          })
        })
      }
    }

  ])
  next();
}

exports.register.attributes = {
  name: 'news-route',
  version: '0.0.1'
}