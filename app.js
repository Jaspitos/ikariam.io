var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'html');
app.set('view cache', true);

app.engine('html', require('ejs').renderFile);

/*
  Defining App use
 */
 app.use(cookieParser());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(express.static(__dirname + '/public')); //Defines public folder files as static (css,js,img..)

 //Module of routes conf
 require('./server/routes/routes')(app);
 
//Starts server
 var server = require('http').createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });
 
