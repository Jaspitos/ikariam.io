require('dotenv').config();
/**
 *@Author: Javier y Lorenzo
 *@Desc: Starts up web app
 */

//Importing modules
var express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    MongoStore = require('connect-mongo')(session),
    dbprop = require('./server/properties/db-properties'),
    io = require('socket.io')(http),
    chat = io.of('/chatNsp'),
    inicio = io.of('/inicioNsp'),
    chalk = require('chalk');


require('./server/utils/artchar')();

//Defining eviroment variables
if (app.get('env') == 'development')
    process.env.NODE_ENV = 'development';
else
    process.env.NODE_ENV = 'production';


console.log(chalk.bold.green('Entorno elegido ----> ') + chalk.bold.yellow(process.env.NODE_ENV));

mongoose.Promise = global.Promise;
/*Check enviromemnt*/
if(process.env.NODE_ENV == 'development')
{
  mongoose.connect(process.env.DBL_URI);
  console.log(chalk.bold.bgGreen('mongo :: connected to database :: ikariam'));
}
else{
  mongoose.connect(process.env.DBC_URI);
}


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

var dbURL = process.env.DBL_URI;
if (app.get('env') == 'production') {
    dbURL = process.env.DBC_URI;
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
inicio.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});


//Module of routes conf
app.use(require('./server/routes/routes'));


//Clients list connection
var allClientsChat = [],
  allClientsInicio = [];;


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
        socket.disconnect();
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
inicio.on('connection', function(socket) {
    //Defining message object to be send to client chat

    var user = socket.request.session.user;
    var yaExiste = false;

    if (allClientsInicio.indexOf(user) == -1) //Si encuentra el usuario devolvera su indice, si no lo encuentra devuelve -1
    {
        allClientsInicio.unshift(user); //Se inserta el usuario en el array por el principio			unshift --> array <-- push
        inicio.emit('newConnection', user, allClientsInicio);
    } else {
        yaExiste = true;
        socket.disconnect();
    }

    socket.on('disconnect', function() {
        if (!yaExiste)
            allClientsInicio.splice(allClientsInicio.indexOf(user), 1);

        inicio.emit('disconnect', user, allClientsInicio);
    });

});

//----------------------------------------------------------------------------------------------------------------//

//Starts server
http.listen(app.get('port'), function() {
    console.log(chalk.bold.bgGreen(`Express server listening on port: ${app.get('port')}`));
});
