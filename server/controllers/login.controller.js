require('dotenv').config();

logindao = require('../dao/logindao'),
profiledao = require('../dao/profiledao'),
Session = require('../models/session');

module.exports = {
  autoLogin: autoLogin,
  manualLogin: manualLogin,
  getSignUp: getSignUp,
  signUp: signUp
}

function autoLogin(req, res) {
  logindao.autoLogin(req.session.user, req.session.passwd, function(o, e) {
      if (o) {
          profiledao.getProfile(req.session.user, function(o, e) {
              if (e)
                res.status(400).send(e);
              else if (o) {
                  res.render('inicio', {
                      title: "Inicio",
                      profile: o
                  });
              } else {
                req.flash('session', 'removed');
                res.redirect('/');
              }
          });
      } else {
        var sess = req.flash('session')
        res.render('login', {
            title: 'Entrar',
            session: sess
        });
      }
  });
}

function manualLogin(req, res){
  logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(o, e) {
      if (e)
        res.status(400).send(e);
      else if (o) {
        Session.findOne({'session.user': o.username}, function(e, o) {
            if (e)
                res.status(400).send(e);
            else if (o) {
              Session.remove({'_id': o._id}, function(e, o) {
                  if (e)
                      res.status(400).send(e);
              });
            }
        });


        req.session.user = o.username;
        req.session.passwd = o.password;
        req.session.admin = o.admin;
        res.status(200).send(o);

      }


  });
}

function getSignUp(req, res){
  res.render('signup', {
      title: 'Registro'
  });
}

function signUp(req, res){
  logindao.checkKey(req.body['keyp'], function(ob, er) {
      if (ob == true) {
          logindao.checkUser(req.body['username'], function(obb, err) {
              if (obb == false) {
                  logindao.checkEmail(req.body['email'], function(obj, error) {
                      if (obj == false) {
                          // create a new user
                          logindao.signUp(req.body['email'], req.body['username'], req.body['pass'], function(o, e) {
                              if (!o)
                                  res.status(400).send(e);

                              else
                                  res.status(200).send(o);
                          });

                      } else res.status(400).send(error);
                  })

              } else res.status(400).send(err);
          })

      } else res.status(400).send(er);
  })
}
