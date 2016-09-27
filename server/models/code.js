/**
 *@Author: Javier
 *@Desc: Model for user
 */

 var mongoose = require('mongoose');
 var schema = mongoose.Schema;


 /*defining schema*/
 var codeSchema = new schema({

	code: String

 });


 /*create model*/
 var code = mongoose.model('Code', codeSchema);

 module.exports = code;
