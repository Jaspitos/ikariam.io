var logindao = require('../dao/logindao');

module.exports = function (app){

      / Http get request to signup page /
      app.get('/', function(req, res) {
       // create a new user
       res.render('signup', { title: 'Registro' });
      });
	  
	  /* Http post request to submit login */
	  app.post('/login', function(req, res){
	  console.log(req.body['userLogin']);
	  console.log(req.body['passLogin']);
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
	  });
	  
	  / Http post request to signup new user /
      app.post('/signup', function(req, res) {

       // create a new user
       logindao.signUp(req.body['name'], req.body['e-mail'], req.body['username'], req.body['pass'], function(e, o){

        if (!o){
         res.status(400).send(e);
        } else{
		 //mailer.sendEmail(req.body['e-mail']);
         res.status(200).send(o);
        }
       });

      });
	  
};