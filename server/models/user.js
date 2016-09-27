/**
 *@Author: Javier
 *@Desc: Model for user
 */

 var mongoose = require('mongoose');
 var schema = mongoose.Schema;


 /*defining schema*/
 var userSchema = new schema({

	email: String,
 	username: String,
 	password: String,
  profilePic: String,
 	admin: Boolean

 });


 /*create model*/
 var User = mongoose.model('User',userSchema);

 module.exports = User;
