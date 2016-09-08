var logindao = require('../dao/logindao');
var k = null;

module.exports = function (app){
	


      app.get('/', function(req, res) {
       // create a new user
       res.render('login', { title: 'Entrar' });
      });
	  
	  
	  /* Http post request to submit login */
	  app.post('/login', function(req, res){
							logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o){
								if (!o){
									res.status(400).send(e);
								}	else{
									//req.session.user = o;
									res.status(200).send(o);
								}
							});
						});
	  
	  app.get('/signup', function(req, res) {
		res.render('signup', { title: 'Registro' });
		k = req.query.key;
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
	  
};
