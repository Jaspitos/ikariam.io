/**
 *@Author:Lorenzo y Javier Gay
 *@Desc:Defines http routes
 */

//Scope variables
var logindao = require('../dao/logindao');

module.exports = function(app) {

  / Http get request to signup page /
  app.get('/', function(req, res) {

    // attempt automatic login //
    logindao.autoLogin(req.session.user, req.session.passwd, function(o){
      if (o){
         res.render('inicio', {title:"Inicio"});
      }	else{
        res.render('login', { title: 'Entrar' });
      }
    });

  });

  /* Http post request to submit login */
  app.post('/', function(req, res){
            logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o){
              console.log(req.body.userLogin);
              console.log(o);
              if (!o){
                res.status(400).send(e);
              }	else{

                req.session.user = o.username;
                req.session.passwd = o.password;
                //res.cookie('user', o.username, { maxAge: 900000 });
                res.status(200).send(o);
              }
            });
          });

  app.get('/signup', function(req, res) {
      res.render('signup', {title: 'Registro'});
  });

    app.post('/signup', function(req, res) {

        logindao.checkUser(req.body['username'], function(er, ob) {
            if (ob == false) {
                logindao.checkEmail(req.body['email'], function(err, obb) {
                    if (obb == false) {
                        logindao.checkKey(req.body['keyp'], function(error, obj) {
                            if (obj == true) {
                                // create a new user
                                logindao.signUp(req.body['email'], req.body['username'], req.body['pass'], function(e, o) {
                                    if (!o) {
                                        res.status(400).send(e);
                                    } else {
                                        //mailer.sendEmail(req.body['e-mail']);
                                        res.status(200).send(o);
                                    }
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
       console.log(req.session);
       res.render('inicio', { title: 'Inicio' });

      });

      app.post('/logout', function(req, res){
        req.session.destroy(function(e) {res.status(200).send('deleted'); });
      })


};
