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
        var db       = request.server.plugins['hapi-mongodb'].db;
        var session  = request.session.get('cluboard_session');
        var username = session.username;
        var clubcode = request.payload.clubcode;

        db.collection('clubs').count({'clubcode': clubcode}, function(err, num) {
          if (num === 1) {
            // check duplication
            db.collection('users').count({ $and: 
              [
                {'username': username},
                {clubList: {$in: [clubcode]}}
              ]}, function (err, count){
              if (count > 0){
                return reply({fail: true})
              } else {
                db.collection('users').update({'username': username}, {$push: {'clubList':clubcode}}, function (err, updateResult) {
                  return reply(updateResult);
                })  
              }
            })
          } else {
            reply({fail: true})
          }
        })
      }
    },
    {
      method: "GET",
      path: "/api/users/club",
      handler: function (request, reply) {
        var db        = request.server.plugins['hapi-mongodb'].db;
        var session   = request.session.get('cluboard_session');
        var username  = session.username;
        var clubs     = [];

        db.collection('users').findOne({'username': username}, function (err, result){
          var clublist = result.clubList;
          for (var i = 0; i < clublist.length; i++) {
            db.collection('clubs').findOne({'clubcode': clublist[i]}, function(err, writeResult) {
              clubs.push(writeResult.clubname)
            })
        }
        setTimeout(function(){
          return reply(clubs);
        }, 10);
        });
      }
    },
    {
      method: "DELETE",
      path: "/api/users/club/{clubname}",
      handler: function (request, reply) {
        var clubname  = encodeURIComponent(request.params.clubname);
        console.log(clubname);
        var db        = request.server.plugins['hapi-mongodb'].db;
        var session   = request.session.get('cluboard_session');
        var username  = session.username;
        db.collection('users').findOne({'username': username}, function (err, result){
          if (err){return reply({deleteItem: false})};
          var clublist = result.clubList;
          db.collection('clubs').findOne({'clubname': clubname}, function (err, clubResult){
            var clubCode = clubResult.clubcode;
            var deleteIndex = clublist.indexOf(clubCode);
            clublist.splice(deleteIndex, 1);
            db.collection('users').update({'username': username}, {$set: {'clubList': clublist}}, function(err, response){
            if (err){return reply({deleteItem: false})};
              reply({deleteItem: true})
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