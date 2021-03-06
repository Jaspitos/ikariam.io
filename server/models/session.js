/**
 *@Author: Javier
 *@Desc: Model for user
 */

 var mongoose = require('mongoose');
 var schema = mongoose.Schema;


 /*defining schema*/
 var sessionSchema = new schema({

  _id: String,
	session: {
    user: String,
  },
  expires: Date
 });


 /*create model*/
 var Session = mongoose.model('Session', sessionSchema);

 module.exports = Session;
