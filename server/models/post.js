/**
 *@Author: Javier y Loren
 *@Desc: Model for list of posts
 */

var mongoose      = require('mongoose')
    schema        = mongoose.schema;


/*defining schema*/
var postSchema = new schema({

    postId: { type: Schema.Types.ObjectId, ref: 'Posts' },
    user: {String, required : true},
    title: {String, required : true},
    description: String,
    content: {String, require : true},
    date: Date,
    comments: []


});



var Post = mongoose.model('Post',postSchema);

export.module = Post;
