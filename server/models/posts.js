/**
 *@Author: Javier y Loren
 *@Desc: Model for list of posts
 */

 var mongoose = require('mongoose');
 var schema = mongoose.Schema;



/*defining schema*/
var postsSchema = new schema({

    tag: String

});

var Posts = mongoose.model('Posts',postsSchema);

module.exports = Posts;
