/**
 *@Author: Javier y Loren
 *@Desc: Model for list of posts
 */

 var mongoose = require('mongoose');
 var schema = mongoose.Schema;


/*defining schema*/
var postSchema = new schema({

    user: String,
    title: String,
    description: String,
    content: String,
    date: Date,
    comments: []

});



var Post = mongoose.model('Post',postSchema);

module.exports = Post;
