/**
 *@author: Loren y Javi
 *@description: post controller
 *@date: 05/10/2016
 */

var postdao = require('../dao/postdao');

module.exports = {
    newPost: newPost,
    savePost: savePost
}

function newPost(req, res) {
  //TODO: te lleva la vista de newpost.html
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e)
          res.status(400).send(e);
      else if (o) {
          res.render('newpost', {
              title: "newpost",
              profile: o
          });
      } else {
        req.flash('session', 'removed');
        res.redirect('/');
      }

  })
}

function savePost(req, res) {
    var bodycontent = []; //TODO Body content que rellenaremos con el req.body['']
    postdao.savePost(req.session.user, bodycontent, function(o, e) {

    });
}
