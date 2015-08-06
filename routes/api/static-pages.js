exports.register = function (server, options, next) {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        return reply.view('index');
      }
    },
    {
      method: 'GET',
      path: '/home',
      handler: function(request, reply) {
        return reply.view('home');
      }
    },
    {
      method: 'GET',
      path: '/public/{path*}',
      handler: {
        directory: {
          path: 'public'
        }
      }
    },
    {
      method: 'GET',
      path: '/admin',
      handler: function(request, reply) {
        return reply.view('admin');
      }
    }
  ]);
  next();
}

exports.register.attributes = {
  name: 'static-pages-route',
  version: '0.0.1'
}