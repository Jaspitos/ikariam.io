/**
 * @Author: Javier y Lorenzo
 * @Desc: Profile data access object
 */

/*Instance of needed modules*/
var cloudinary = require('cloudinary');

//Se conecta al cdn cloudinary
cloudinary.config({
    cloud_name: 'dvy0ekqee',
    api_key: '543871316948421',
    api_secret: '8BsClfdwloSRbG_Y92Qg4mvsvSg'
});

/*Retreives user personal information */
exports.getProfile = function(username, db, callback) {
    var accounts = db.collection('users');
    accounts.findOne({
        username: username
    }, function(e, o) {
        if (o) {
            callback(o);
        } else
            callback(null);
    })

}


exports.changeImg = function(user, img, db, callback) {
    var accounts = db.collection('users');
    var buffer = new Buffer(img).toString('base64');
    cloudinary.uploader.upload("data:image/png;base64," + buffer, function(result) {
        accounts.updateOne({
            username: user
        }, {
            $set: {
                profilePic: result.url
            }
        }, {
            upsert: true
        });
        callback(true);
    }, {
        public_id: user
    })

}
