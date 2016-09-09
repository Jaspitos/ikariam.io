
/**
 *@Author: Javier y Lorenzo
 *@Desc: Starts up web app
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
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

app.engine('html', require('ejs').renderFile);

/*
  Defining App use
 */
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


 //Module of routes conf
 require('./server/routes/routes')(app);

 //Starts general Chat
 io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

//Starts server
 http.listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });
