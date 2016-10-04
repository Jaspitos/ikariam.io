/**
  *@author: Loren y Javier
  *@description Collection of controllers
  *@date:
  */

loginController = require('../controllers/login.controller'),
profileController = require('../controllers/profile.controller'),
adminController = require('../controllers/admin.controller');
postController = require('../controllers/post.controller');


module.exports = {
  autoLogin: autoLogin,
  manualLogin: manualLogin,
  getSignUp: getSignUp,
  signUp: signUp,
  getInicio: getInicio,
  chat: chat,
  getProfile: getProfile,
  changeImg: changeImg,
  admin: admin,
  deleteAdmin: deleteAdmin,
  savePost: savePost,
  logout: logout
}

function autoLogin(req, res) {
  loginController.autoLogin(req, res);
}

function manualLogin(req, res){
  loginController.manualLogin(req, res);
}

function getSignUp(req, res){
  loginController.getSignUp(req, res);
}

function signUp(req, res){
  loginController.signUp(req, res);
}

function getInicio(req, res) {
  profileController.getInicio(req, res);
}

function chat(req, res) {
  profileController.chat(req, res);
}

function getProfile(req, res){
  profileController.getProfile(req, res);
}

function changeImg(req, res) {
  profileController.changeImg(req, res);
}

function admin(req, res){
  adminController.admin(req, res);
}

function deleteAdmin(req, res){
  adminController.deleteAdmin(req, res);
}

function newPost(req,res){
  postController.newPost(req,res);
}

function savePost(req,res){
  postController.savePost(req,res);
}

function logout(req, res){
  req.session.destroy(function(e) {
    if(e)
      res.status(400).send(e);
    else
      res.status(200).send('deleted');
  });
}
