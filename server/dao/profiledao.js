/**
 * @Author: Javier y Lorenzo
 * @Desc: Profile data access object
 */

/*Instance of needed modules*/
var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;
var dbprop = require('../properties/db-properties');
var cloudinary = require('cloudinary');
var fs = require('fs');

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

//Se conecta al cdn cloudinary
cloudinary.config({
    cloud_name: 'dvy0ekqee',
    api_key: '543871316948421',
    api_secret: '8BsClfdwloSRbG_Y92Qg4mvsvSg'
});

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

        exports.changeImg = function(img, callback) {
          cloudinary.uploader.upload(img, function(result) {
            console.log(result);
          
          });
        }
