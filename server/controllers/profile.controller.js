profiledao = require('../dao/profiledao');

module.exports = {
  getInicio: getInicio,
  chat: chat,
  getProfile: getProfile,
  changeImg: changeImg
}

function getInicio(req, res) {
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e)
        res.status(400).send(e);
      else if (o) {
          res.render('inicio', {
              title: "Inicio",
              profile: o
          });
      } else {
        req.flash('session', 'removed');
        res.redirect('/');
      }
  });
}

function chat(req, res) {
  // create a new user
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e)
          res.status(400).send(e);
      else if (o) {
          res.render('chat', {
              title: "Chat",
              profile: o
          });
      } else {
        req.flash('session', 'removed');
        res.redirect('/');
      }

  })
}

function getProfile(req, res){
  // create a new user
  profiledao.getProfile(req.session.user, function(o, e) {
      if (e)
        res.status(400).send(e);
      else if (o) {
          res.render('profile', {
              title: "Perfil",
              profile: o
          });
      } else {
        req.flash('session', 'removed');
        res.redirect('/');
      }
  })
}

function changeImg(req, res) {
  profiledao.changeImg(req.session.user, req.file.buffer, function(o, e) {
      if (o) {
          profiledao.getProfile(req.session.user, function(o, e) {
            if (e)
              res.status(400).send(e);
            else if (o) {
                res.render('profile', {
                    title: "Perfil",
                    profile: o
                });
            } else {
              req.flash('session', 'removed');
              res.redirect('/');
            }
          })
      }
  })
}
