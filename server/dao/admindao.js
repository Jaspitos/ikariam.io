/**
 *@Author: Lorenzo y Javier
 *@Desc: Admin will have privilage to mage certain staff
 */

 /*Instance of needed modules*/
 var dbConfig = require('../properties/dbConfig');
 var accounts = dbConfig.db.collection('users');

exports.getUserlist = function(user,callback){
//TODO:Comprueba si el usuario es admin, tambien lo comprueba en el routes
  accounts.find({}, {'username': true}).toArray(function(err, results) {
    var usuarios = [];
    for (var i = 0; i < results.length; i++) {
      usuarios.push(results[i].username);
    }
    console.dir(usuarios);

    if(err) callback(err,"Fallo la obtencion de los usuarios");
    else callback(usuarios);
});

}
