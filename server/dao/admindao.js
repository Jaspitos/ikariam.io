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
    //TODO:Comprueba si el usuario es admin, tambien lo comprueba en el routes
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
        }
        if (err) callback(err, "Falló la obtencion de los usuarios");
        else callback(usuarios);
    });
}

/**
 *@desc: remove a user selected
 *@param: user
 *@return: boolean value
 */
exports.removeUser = function(user, callback) {

    User.remove({'username': user}, function(e, o) {
        if (e) {
            callback(null, e);
        } else
            callback('usuario borrado', true);
    });
}
