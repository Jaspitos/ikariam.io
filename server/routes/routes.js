/**
 *@Author:Javier y Lorenzo
 *@Desc:List of http routes
 */

//Scope variables
var multer = require('multer');
var fileUpload = multer();
var logindao = require('../dao/logindao');
var profiledao = require('../dao/profiledao');

module.exports = function(app,db) {

    /*
     * @Route: principal.html
     * @Desc: Singn up a new user
     * @Http-type: GET
     */
    app.get('/', function(req, res) {

        // attempt automatic login //
        logindao.autoLogin(req.session.user, req.session.passwd,db, function(o) {
            if (o) {
                profiledao.getProfile(req.session.user,db, function(o, e) {
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

    /*
     * @Route: principal.html
     * @Desc: Submit login
     * @Http-type: POST
     */
    app.post('/', function(req, res) {
        logindao.manualLogin(req.body['userLogin'], req.body['passLogin'],db, function(e, o) {
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

    /*
     * @Route: signup.html
     * @Desc: Takes you to signup view
     * @Http-type: GET
     */
    app.get('/signup', function(req, res) {
        res.render('signup', {
            title: 'Registro'
        });
    });

    /*
     * @Route: signup.html
     * @Desc: Submits signup credentials
     * @Http-type: POST
     */
    app.post('/signup', function(req, res) {

        logindao.checkKey(req.body['keyp'],db, function(er, ob) {
            if (ob == true) {
                logindao.checkUser(req.body['username'],db, function(err, obb) {
                    if (obb == false) {
                        logindao.checkEmail(req.body['email'],db, function(error, obj) {
                            if (obj == false) {
                                // create a new user
                                logindao.signUp(req.body['email'], req.body['username'], req.body['pass'], db, function(e, o) {
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

    /*
     * @Route: inicio.html
     * @Desc: Redirects you to app.get('/')
     * @Http-type: GET
     */
    app.get('/inicio', function(req, res) {
        res.render('/');
    });

    /*
     * @Route: chat.html
     * @Desc: Takes your to chat view
     * @Http-type: GET
     */
    app.get('/chat', function(req, res) {
        // create a new user
        profiledao.getProfile(req.session.user,db, function(o, e) {
            if (e) res.render('/');
            else if (o) {
                res.render('chat', {
                    title: "Chat",
                    profile: o
                });
            }

        })
    });

    /*
     * @Route: profile.html
     * @Desc: Takes you to profile view
     * @Http-type: GET
     */
    app.get('/profile', function(req, res) {
        // create a new user
        profiledao.getProfile(req.session.user,db, function(o, e) {
            if (e) res.render('/');
            else if (o) {
                res.render('profile', {
                    title: "Perfil",
                    profile: o
                });
            }
        })
    });

    /*
     * @Route: profile.html
     * @Desc: Updates user picture
     * @Http-type: POST
     */
    app.post('/profile', fileUpload.single('profilepic'), function(req, res) {
        profiledao.changeImg(req.session.user,req.file.buffer,db, function(o, e) {
            if (o) {
                profiledao.getProfile(req.session.user,db, function(o, e) {
                    res.render('profile', {
                        title: "Perfil",
                        profile: o
                    });
                })
            }
        })
    });

   /*
    * @Route: inicio.html
    * @Desc: Kills user session
    * @Http-type: POST
    */
    app.post('/logout', function(req, res) {
        req.session.destroy(function(e) {
            res.status(200).send('deleted');
        });
    })


};
