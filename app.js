/**
 *@Author: Javier
 *@Desc: Starts up web app
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbprop = require('./server/properties/db-properties');
var io = require('socket.io')(http);



//Defining eviroment variables
if(app.get('env') == 'development')
	process.env.NODE_ENV = 'development';
		else
			process.env.NODE_ENV = 'production';



//App settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'html');
app.set('view cache', true);

//
app.engine('html', require('ejs').renderFile);

//Defining App use
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


 	dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);
 	var dbHost = dbprop['app'].dbHost;
 	var dbPort = dbprop.dbPort;
 	var dbName = dbprop.dbName;

 	//TODO
 	var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
 	if (app.get('env') == 'production'){
 	dbURL = 'mongodb://devel:vivaeta@ds021036.mlab.com:21036/ikariam';
 	}


	//Defining session variable
	var sessionMiddleware = session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge:86400000},
	store: new MongoStore({ url: dbURL })
	});

	io.use(function(socket, next) {
	    sessionMiddleware(socket.request, socket.request.res, next);
	});

	app.use(sessionMiddleware);

 //Module of routes conf
 require('./server/routes/routes')(app);

 //Starts general Chat
 io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message',socket.request.session.user+": " +msg);
  });
});

//Starts server
 http.listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });
