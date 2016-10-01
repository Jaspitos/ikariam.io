require('dotenv').config();

logindao = require('../dao/logindao'),
profiledao = require('../dao/profiledao'),
admindao = require('../dao/admindao'),
Session = require('../models/session');


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
              if (e) res.redirect('/');
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
      if (e) {
          res.status(400).send(e);
      } else if(o) {
        Session.findOne({'session.user': o.username}, function(e, o) {
            if (e) {
                res.status(400).send(e);
            }
            if(o) {
              Session.remove({'_id': o._id}, function(e, o) {
                  if (e) {
                      res.status(400).send(e);
                  }
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

function getInicio(req, res) {
  res.render('/');
}

function chat(req, res) {
  // create a new user
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e) res.redirect('/');
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
      if (e) res.redirect('/');
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
            if (e) res.redirect('/');
            else if (o) {
                res.render('profile', {
                    title: "Perfil",
                    profile: o
                });
            }
          })
      }
  })
}

function admin(req, res){
  if (req.session.admin == true) {
      admindao.getUserlist(req.session.user, function(o, e) {
          if (o) {
              profiledao.getProfile(req.session.user, function(ob, err) {
                if (e) res.redirect('/');
                else if (o) {
                  res.render('admin', {
                      title: "Panel de admin",
                      userlist: o,
                      profile: ob
                  });
                }
              })
          }

      });
  } else res.redirect('/');
}

function deleteAdmin(req, res){
      admindao.removeUser(req.body['user'], function(o, e) {
          if (o) {
              res.redirect('/admin');
          }
          else res.redirect('/');
      });
}

function logout(req, res){
  req.session.destroy(function(e) {
    if(e)
      res.status(400).send(e);
    else
      res.status(200).send('deleted');
  });
}
