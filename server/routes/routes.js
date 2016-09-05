module.exports = function (app){

      / Http get request to signup page /
      app.get('/', function(req, res) {
       // create a new user
       res.render('test', { title: 'Test' });
      });
	  
};