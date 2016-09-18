/**
 * @Author: Javier y Lorenzo
 * @Desc: Profile data access object
 */

 /*Instance of needed modules*/
 var MongoDB = require('mongodb').Db;
 var user = require('../models/user');
 var Server = require('mongodb').Server;
 var dbprop = require('../properties/db-properties');



 dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);




 /* establish the database connection */
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
                     console.log('mongo :: error: not authenticated', e);
                 } else {
                     console.log('mongo :: authenticated and connected to database :: "' + dbprop.dbName + '"');
                 }
             });
         } else {
             console.log('mongo :: connected to database :: "' + dbprop.dbName + '"');
         }
     }
 });


 //Colection we want to play with
 var accounts = db.collection('users');

/*Retreives user personal information */
exports.getProfile = function(username, callback) {
    accounts.findOne({
        username: username
    }, function(e, o) {
        if (o) {
            //console.log(o);
            callback(o);
        } else
            callback(null);
    })


}
