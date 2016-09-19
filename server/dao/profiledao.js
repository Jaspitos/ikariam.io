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

module.exports = function(db) {


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
            callback(o);
        } else
            callback(null);
    })

}


exports.changeImg = function(user, img, callback) {
        var buffer = new Buffer(img).toString('base64');
        cloudinary.uploader.upload("data:image/png;base64,"+buffer, function(result) { accounts.updateOne({username: user}, { $set: {profilePic: result.url}}, {upsert: true}); callback(true);},
          {
            public_id: user
          })

    }

  };
