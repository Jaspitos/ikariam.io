/**
 *@Author:Lorenzo y Javier Gay
 *@Desc:Defines http routes
 */

//Scope variables
var logindao = require('../dao/logindao');

var k = null;

module.exports = function(app) {

	 /*
		 @Route:
		 @Http-type: GET
		 @Desc:
	 */
    app.get('/', function(req, res) {
        // create a new user
        res.render('login', {title: 'Entrar'});
    });


    /*
		 @Route: Login
		 @Http-type: POST
		 @Desc: Http post request to submit login
		*/
    app.post('/login', function(req, res) {
        logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o) {
            if (!o) {
                res.status(400).send(e);
            } else {
                //req.session.user = o;
                res.status(200).send(o);
            }
        });
    });

		/*
 		 @Route:
 		 @Http-type: GET
 		 @Desc:
 	  */
    app.get('/signup', function(req, res) {

			  k = req.query.key;
        res.render('signup', {title: 'Registro', key: k});
    });

		/*
 		 @Route:
 		 @Http-type: GET
 		 @Desc:
 	  */
    app.post('/signup', function(req, res) {

        logindao.checkUser(req.body['username'], function(er, ob) {
            if (ob == false) {
                logindao.checkEmail(req.body['email'], function(err, obb) {
                    if (obb == false) {
                        logindao.checkKey(k, function(error, obj) {
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

      / Http get request to signup page /
      app.get('/', function(req, res) {
       //If session is live then redirect to index
							if(req.session.user != null){
								 res.render('inicio',{title:"Inicio"});
							}

							//Checks if the credentials are saved in clients cookies
							else if(req.cookies.user == undefined || req.cookies.pass == undefined){
								res.render('login', { title: 'Entrar'});
								//console.log("Cookies Not available");
							}
							else{
							// attempt automatic login //
							logindao.autoLogin(req.cookies.user, req.cookies.pass, function(o){
								if (o != null){
									req.session.user = o;
									 res.render('inicio', {title:"Inicio"});
								}	else{
									res.render('login', { title: 'Entrar' });
								}
							});
						}
      });


	  /* Http post request to submit login */
	  app.post('/login', function(req, res){
							logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o){
								if (!o){
									res.status(400).send(e);
								}	else{
									req.session.user = o;
									if (req.body['remember-me'] == 'true'){
										res.cookie('user', o.user, { maxAge: 900000 });
										res.cookie('pass', o.pass, { maxAge: 900000 });
									}
									res.status(200).send(o);
								}
							});
						});

	  app.get('/signup', function(req, res) {
		    res.render('signup', {title: 'Registro'});
	  });
	  /* Http get request to check ur login state */
						app.get('/',function(req,res){

							//If session is live then redirect to index
							if(req.session.user != null){
								 res.render('inicio',{title:"Inicio"});
							}

							//Checks if the credentials are saved in clients cookies
							else if(req.cookies.user == undefined || req.cookies.pass == undefined){
								res.render('login', { title: 'Log In'});
								//console.log("Cookies Not available");
							}
							else{
							// attempt automatic login //
							logindao.autoLogin(req.cookies.user, req.cookies.pass, function(o){
								if (o != null){
									req.session.user = o;
									res.render('inicio',{title:"Inicio"});
								}	else{
									res.render('login', { title: 'Inicio' });
								}
							});
						}


					});

	  / Http post request to signup new user /
      app.post('/signup', function(req, res) {

			logindao.checkUser(req.body['username'],function(er,ob)
			{
				if(ob == false)
				{
					logindao.checkEmail(req.body['email'],function(err,obb)
					{
						if(obb == false)
						{
							logindao.checkKey(k, function(error, obj)
							{
								if(obj == true)
								{
									// create a new user
									logindao.signUp(req.body['email'], req.body['username'], req.body['pass'], function(e, o){
										if (!o){
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
       res.render('inicio', { title: 'Inicio' });
      });
		/*
 		 @Route:
 		 @Http-type: GET
 		 @Desc:
 	  */
    app.get('/inicio', function(req, res) {
        // create a new user
        res.render('inicio', {
            title: 'Inicio'
        });
    });

};
