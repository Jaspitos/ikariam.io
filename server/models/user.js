/**
 *@Author: Javier
 *@Desc: Model for user
 */

 var mongoose = require('mongoose');
 var schema = mongoose.Schema;


 /*defining schema*/
 var userSchema = new schema({
 
 	username: { type: String, required: true, unique: true},
 	password: {type: String, required: true, unique: true},
	email: String,
 	admin: Boolean

 });


 /*create model*/
 var User = mongoose.model('User',userSchema);

 module.exports = User;