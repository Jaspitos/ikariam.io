admindao = require('../dao/admindao');
profiledao = require('../dao/profiledao');

module.exports = {
  admin: admin,
  deleteAdmin: deleteAdmin,
}

function admin(req, res){
      admindao.getUserlist(req.session.user, function(o, e) {
        if(e)
          res.status(400).send(e);
        else if (o) {
              profiledao.getProfile(req.session.user, function(ob, err) {
                if (e)
                  res.status(400).send(e);
                else if (ob) {
                  res.render('admin', {
                      title: "Panel de admin",
                      userlist: o,
                      profile: ob
                  });
                } else {
                  req.flash('session', 'removed');
                  res.redirect('/');
                }
              })
          } else
              res.redirect('/');

      });
}

function deleteAdmin(req, res){
      admindao.removeUser(req.body['user'], function(o, e) {
          if (o) {
              res.redirect('/admin');
          }
          else res.redirect('/');
      });
}
