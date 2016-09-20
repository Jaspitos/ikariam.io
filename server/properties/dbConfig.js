var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var dbprop = require('../properties/db-properties');
var chalk = require('chalk');

dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);
var dbHost = dbprop['app'].dbHost;
var dbPort = dbprop.dbPort;
var dbName = dbprop.dbName;

var db = new MongoDB(dbprop.dbName, new Server(dbprop['app'].dbHost, dbprop.dbPort, {
    auto_reconnect: true
}), {
    w: 1
});


db.open(function(e, d) {
        if (e) {
            console.log(e);
        } else {
            if (process.env.NODE_ENV == 'production') {
                db.authenticate('devel', 'vivaeta', function(e, res) {
                    if (e) {
                        console.log(chalk.bold.bgRed('mongo :: error: not authenticated'), e);
                    } else {
                        console.log(chalk.bold.bgGreen('mongo :: authenticated and connected to database :: "' + dbprop.dbName + '"'));
                    }
                });
            } else {
                console.log(chalk.bold.bgGreen('mongo :: connected to database :: "' + dbprop.dbName + '"'));
         }
      }
 });

module.exports.db = db;

//so easy becario haha
