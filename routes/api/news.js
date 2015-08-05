exports.register = function (server, option, next) {
  server.route([
    {
      method: 'POST',
      path: '/api/news',
      handler: function (request, reply) {
        var db = request.server.plugins['hapi-mongodb'].db;
        var news = {
          title: request.payload.title,
          content: request.payload.title,
          clubname: request.payload.clubname,
          createDate: new Date()
        }
      }
    }







  ])
  next();
}

exports.register.attributes = {
  name: 'news-route',
  version: '0.0.1'
}