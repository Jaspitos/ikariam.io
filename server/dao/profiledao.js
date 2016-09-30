/**
 * @Author: Javier y Lorenzo
 * @Desc: Profile data access object
 */

/*Instance of needed modules*/
var cloudinary = require('cloudinary');
var User = require('../models/user');

//Se conecta al cdn cloudinary
cloudinary.config({
    cloud_name: 'dvy0ekqee',
    api_key: '543871316948421',
    api_secret: '8BsClfdwloSRbG_Y92Qg4mvsvSg'
});

/*Retreives user personal information */

exports.getProfile = function(username, callback) {

    User.findOne({
        username: username
    }, function(e, o) {
        if (o) {
            callback(o, false);
        } else
            callback(null, true);
    })

}

exports.changeImg = function(u, img, callback) {

    var buffer = new Buffer(img).toString('base64');
    cloudinary.uploader.upload("data:image/png;base64," + buffer, function(result) {
      User.findOne({username: u}, (err, user) => {
        user.profilePic = result.url;

        user.save((err) => {
          if(err)
            throw err;
            else {
              callback(true);
            }
        });


      });

    }, {public_id: u});



  }
