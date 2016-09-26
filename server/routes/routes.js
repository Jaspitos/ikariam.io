/**
 *@Author:Javier y Lorenzo
 *@Desc:List of http routes
 */

//Scope variables
const multer = require('multer'),
    fileUpload = multer(),
    logindao = require('../dao/logindao'),
    profiledao = require('../dao/profiledao'),
    admindao = require('../dao/admindao');

module.exports = function(app) {

    /**
     * @Route: principal.html
     * @Desc: Singn up a new user
     * @Http-type: GET
     */
    app.get('/', (req, res) => {

        // attempt automatic login //
        logindao.autoLogin(req.session.user, req.session.passwd, function(o) {
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
    });

    /*
     * @Route: principal.html
     * @Desc: Submit login
     * @Http-type: POST
     */
    app.post('/', (req, res) => {
        logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o) {
            if (!o) {
                res.status(400).send(e);
            } else {
                if (req.session.user == o.username && req.session.passwd == o.password)
                    res.status(200).send(o);
                else {
                    req.session.user = o.username;
                    req.session.passwd = o.password;
                    req.session.admin = o.admin;
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
    app.get('/signup', (req, res) => {
        res.render('signup', {
            title: 'Registro'
        });
    });

    /*
     * @Route: signup.html
     * @Desc: Submits signup credentials
     * @Http-type: POST
     */
    app.post('/signup', (req, res) => {

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

    /*
     * @Route: inicio.html
     * @Desc: Redirects you to app.get('/')
     * @Http-type: GET
     */
    app.get('/inicio', (req, res) => {
        res.render('/');
    });

    /*
     * @Route: chat.html
     * @Desc: Takes your to chat view
     * @Http-type: GET
     */
    app.get('/chat', (req, res) => {
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

    /*
     * @Route: profile.html
     * @Desc: Takes you to profile view
     * @Http-type: GET
     */
    app.get('/profile', (req, res) => {
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

    /*
     * @Route: profile.html
     * @Desc: Updates user picture
     * @Http-type: POST
     */
    app.post('/profile', fileUpload.single('profilepic'), (req, res) => {
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
    });

    /*
     * @Route: admin.html
     * @Desc: Shows admin panel
     * @Http-type: GET
     */
    app.get('/admin', (req, res) => {
        //TODO: COMPROBAR SI ES ADMIN ES TRUE
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
    });

    /*
     * @Route: admin.html
     * @Desc: Removes a select user then redirects to app.get('/admin')
     * @Http-type: post
     */
    app.post('/admin', (req, res) => {
        if (req.session.admin == true) {
            admindao.removeUser(req.body['user'], function(o, e) {
                if (o) {
                    res.redirect('/admin');
                }
            });
        } else res.redirect('/');

    });

    /*
     * @Route: inicio.html
     * @Desc: Kills user session
     * @Http-type: POST
     */
    app.post('/logout', (req, res) => {
        req.session.destroy(function(e) {
            res.status(200).send('deleted');
        });
    })


};
