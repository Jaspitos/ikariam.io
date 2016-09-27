/**
 *@Author: Javier y Lorenzo
 *@Desc: Starts up web app
 */

//Importing modules
var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var dbprop = require('./server/properties/db-properties');
var io = require('socket.io')(http);
var chat = io.of('/chatNsp');
var zaros = io.of('/inicioNsp');
var chalk = require('chalk');


require('./server/utils/artchar')();


//Clients list connection
var allClientsChat = [];
var allClientsInicio = [];

//Defining eviroment variables
if (app.get('env') == 'development')
    process.env.NODE_ENV = 'development';
else
    process.env.NODE_ENV = 'production';


console.log(chalk.bold.green('Entorno elegido ----> ') + chalk.bold.yellow(process.env.NODE_ENV));


//App settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/server/views');
app.set('view engine', 'html');
app.set('view cache', true);

//App engine interpetrer
app.engine('html', require('ejs').renderFile);

//App use
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);
var dbHost = dbprop['app'].dbHost;
var dbPort = dbprop.dbPort;
var dbName = dbprop.dbName;

//TODO
var dbURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
if (app.get('env') == 'production') {
    dbURL = 'mongodb://devel:vivaeta@ds021036.mlab.com:21036/ikariam';
}

//Defining session variable
var sessionMiddleware = session({
    secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000
    },
    store: new MongoStore({
        url: dbURL
    })
});

app.use(sessionMiddleware);

//Une sessions con socket.io
chat.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

//Une sessions con socket.io
zaros.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


//Module of routes conf
app.use(require('./server/routes/routes'));

//Starts general Chat
chat.on('connection', function(socket) {
    //Defining message object to be send to client chat

    var user = socket.request.session.user;
    var yaExiste = false;

    if (allClientsChat.indexOf(user) == -1) //Si encuentra el usuario devolvera su indice, si no lo encuentra devuelve -1
    {
        allClientsChat.unshift(user); //Se inserta el usuario en el array por el principio			unshift --> array <-- push
        chat.emit('newConnection', user, allClientsChat);
    } else {
        yaExiste = true;
    }

    socket.on('chat message', function(msg) {
        var text = msg;
        chat.emit('chat message', {
            user,
            text
        });
    });

    socket.on('disconnect', function() {
        if (!yaExiste)
            allClientsChat.splice(allClientsChat.indexOf(user), 1);

        chat.emit('disconnect', user, allClientsChat);
    });

});

//---------------------------------------------------------------------------------------------------------------------------------//

//Usuarios conectados en /inicio
zaros.on('connection', function(socket) {
    //Defining message object to be send to client chat

    var user = socket.request.session.user;
    var yaExiste = false;

    if (allClientsInicio.indexOf(user) == -1) //Si encuentra el usuario devolvera su indice, si no lo encuentra devuelve -1
    {
        allClientsInicio.unshift(user); //Se inserta el usuario en el array por el principio			unshift --> array <-- push
        zaros.emit('newConnection', user, allClientsInicio);
    } else {
        yaExiste = true;
        socket.disconnect();
    }

    socket.on('disconnect', function() {
        if (!yaExiste)
            allClientsInicio.splice(allClientsInicio.indexOf(user), 1);

        zaros.emit('disconnect', user, allClientsInicio);
    });

});

//----------------------------------------------------------------------------------------------------------------//

//Starts server
http.listen(app.get('port'), function() {
    console.log(chalk.bold.green('Express server listening on port ' + app.get('port')));
});
