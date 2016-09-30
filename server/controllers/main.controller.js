require('dotenv').config();

logindao = require('../dao/logindao'),
profiledao = require('../dao/profiledao'),
admindao = require('../dao/admindao');

module.exports = {
  autoLogin: autoLogin,
  manualLogin: manualLogin,
  getSignUp: getSignUp,
  signUp: signUp,
  getInicio: getInicio,
  chat: chat,
  getProfile: getProfile,
  changeImg: changeImg,
  admin: admin,
  deleteAdmin: deleteAdmin,
  logout: logout
}

function autoLogin(req, res)
{
  logindao.autoLogin(req.session.user, req.session.passwd, function(o, e) {
      if (o) {
          profiledao.getProfile(req.session.user, function(o, e) {

              //if (e) res.render('/');
              if (o) {
                  res.render('inicio', {
                      title: "Inicio",
                      profile: o
                  });
              }
          });
      } else {
          res.render('login', {
              title: 'Entrar'
          });
      }
  });
}

function manualLogin(req, res){
  logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(o, e) {
      if (!o) {
          res.status(400).send(e);
      } else {

          if (req.session.user == o.username && req.session.passwd == o.password)
          {
            res.status(200).send(o);
          }

          else {
              req.session.user = o.username;
              req.session.passwd = o.password;
              req.session.admin = o.admin;
              res.status(200).send(o);

          }
      }
  });
}

function getSignUp(req, res){
  res.render('signup', {
      title: 'Registro'
  });
}

function signUp(req, res){
  logindao.checkKey(req.body['keyp'], function(er, ob) {
      if (ob == true) {
          logindao.checkUser(req.body['username'], function(err, obb) {
              if (obb == false) {
                  logindao.checkEmail(req.body['email'], function(error, obj) {
                      if (obj == false) {
                          // create a new user
                          logindao.signUp(req.body['email'], req.body['username'], req.body['pass'], function(e, o) {
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

function getInicio(req, res) {
  res.render('/');
}

function chat(req, res) {
  // create a new user
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e) res.render('/');
      else if (o) {
          res.render('chat', {
              title: "Chat",
              profile: o
          });
      }

  })
}

function getProfile(req, res){
  // create a new user
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e) res.render('/');
      else if (o) {
          res.render('profile', {
              title: "Perfil",
              profile: o
          });
      }
  })
}

function changeImg(req, res) {
  profiledao.changeImg(req.session.user, req.file.buffer, function(o, e) {
      if (o) {
          profiledao.getProfile(req.session.user, function(o, e) {
              res.render('profile', {
                  title: "Perfil",
                  profile: o
              });
          })
      }
  })
}

function admin(req, res){
  if (req.session.admin == true) {
      admindao.getUserlist(req.session.user, function(o, e) {
          if (o) {
              profiledao.getProfile(req.session.user, function(ob, err) {
                  res.render('admin', {
                      title: "Panel de admin",
                      userlist: o,
                      profile: ob
                  });
              })
          }

      });
  } else res.redirect('/');
}

function deleteAdmin(req, res){
  if (req.session.admin == true) {
      admindao.removeUser(req.body['user'], function(o, e) {
          if (o) {
              res.redirect('/admin');
          }
      });
  } else res.redirect('/');
}

function logout(req, res){
  req.session.destroy(function(e) {
      res.status(200).send('deleted');
  });
}
