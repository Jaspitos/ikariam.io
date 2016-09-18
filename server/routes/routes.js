/**
 *@Author:Javier
 *@Desc:Defines http routes
 */

//Scope variables
var multer = require('multer');
var fileUpload = multer();
var logindao = require('../dao/logindao');
var profiledao = require('../dao/profiledao');

module.exports = function(app) {

        /*Http get request to signup page*/
        app.get('/', function(req, res) {

                // attempt automatic login //
                logindao.autoLogin(req.session.user, req.session.passwd, function(o) {
                        if (o) {
                          profiledao.getProfile(req.session.user, function(o, e) {
                              if (e) res.render('/');
                              else if (o) {
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
                });

            /* Http post request to submit login */
            app.post('/', function(req, res) {
                logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o) {
                    if (!o) {
                        res.status(400).send(e);
                    } else {
                        if (req.session.user == o.username && req.session.passwd == o.password)
                            res.status(200).send(o);
                        else {
                            req.session.user = o.username;
                            req.session.passwd = o.password;
                            res.status(200).send(o);
                        }


                    }
                });
            });

            app.get('/signup', function(req, res) {
                res.render('signup', {
                    title: 'Registro'
                });
            });

            app.post('/signup', function(req, res) {

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

            });




            app.get('/inicio', function(req, res) {
                // create a new user
                profiledao.getProfile(req.session.user, function(o, e) {
                    if (e) res.render('/');
                    else if (o) {
                        res.render('inicio', {
                            title: "Inicio",
                            profile: o
                        });
                    }

                })

            });

            app.get('/chat', function(req, res) {
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
            });

            app.get('/profile', function(req, res) {
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

            });

            app.post('/profile', fileUpload.single('profilepic'), function (req, res) {

                  
              var buffer = new Buffer(req.file.buffer.toString(), 'base64')
              profiledao.changeImg(buffer, function (o, e) {
                  if(e)
                  {
                    console.log("error");
                    res.status(200).send(e);

                  }
                  else if (o) {
                    console.log("correcto");
                    res.status(400).send(o);

                  }
                  else {
                    console.log("else");
                      res.status(200).send(e);
                  }


              })
            });

            app.post('/logout', function(req, res) {
                req.session.destroy(function(e) {
                    res.status(200).send('deleted');
                });
            })


        };
