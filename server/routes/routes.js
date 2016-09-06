var logindao = require('../dao/logindao');

module.exports = function (app){

      / Http get request to signup page /
      app.get('/', function(req, res) {
       // create a new user
       res.render('login', { title: 'Entrar' });
      });
	  
	  
	  /* Http post request to submit login */
	  app.post('/login', function(req, res){
							logindao.manualLogin(req.body['userLogin'], req.body['passLogin'], function(e, o){
								if (!o){
									res.status(400).send(e);
									console.log("no existe el user");
								}	else{
									//req.session.user = o;
									res.status(200).send(o);
								}
							});
						});
	  
	  app.get('/signup', function(req, res) {
		res.render('signup', { title: 'Registro' });
	  });
	  
	  / Http post request to signup new user /
      app.post('/signup', function(req, res) {

       // create a new user
       logindao.signUp(req.body['username'], req.body['pass'], req.body['email'], req.body['repass'], function(e, o){

        if (!o){
         res.status(400).send(e);
		 
        } else if(req.body['pass'] !== req.body['repass']){
		 res.status(400).send(e);
		 console.log("no coinciden las pass");
        } else {
		//mailer.sendEmail(req.body['e-mail']);
         res.status(200).send(o);
		}
       });

      });
	  
};
