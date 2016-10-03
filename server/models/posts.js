/**
 *@Author: Javier y Loren
 *@Desc: Model for list of posts
 */

var mongoose      = require('mongoose')
    schema        = mongoose.schema;



/*defining schema*/
var postsSchema = new schema({

    id: { type: Schema.Types.ObjectId, ref: 'Id' },
    tag: String

});

var Posts = mongoose.model('Posts',postsSchema);

export.module = Posts;
