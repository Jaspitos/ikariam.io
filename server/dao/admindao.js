/**
 *@Author: Lorenzo y Javier
 *@Desc: Admin will have privilage to manage certain staff
 */

/*Instance of needed modules*/
var User = require('../models/user');

/**
 *@desc: get a list of users from account bd
 *@param: user
 *@return: list of users
 */
exports.getUserlist = function(user, callback) {
  User.findOne({username: user}, (err, res) => {
    if (err)
      callback(null, err);
    else if (res && res.admin) {
        User.find({}, (err, results) => {
            var usuarios = [];
            var usuario = null;
            for (var i = 0; i < results.length; i++) {
                usuario = {
                    "username": results[i].username,
                    "email": results[i].email,
                    "profilePic": results[i].profilePic,
                    "admin": results[i].admin
                };
                usuarios.push(usuario);
                callback(usuarios, null);
            }
        });
    } else
      callback(null);
  });

}

/**
 *@desc: remove a user selected
 *@param: user
 *@return: boolean value
 */
exports.removeUser = function(user, callback) {

    User.remove({'username': user}, function(o, e) {
        if (e) {
            callback(e, false);
        } else
            callback(null, true);

    });
}
