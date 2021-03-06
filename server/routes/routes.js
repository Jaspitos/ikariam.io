/**
 *@author: Javier y Lorenzo
 *@desc: List of http routes
 *@date: 05/10/2016
 */

const express = require('express'),
    router = express.Router(),
    mainControler = require('../controllers/main.controller'),
    multer = require('multer'),
    fileUpload = multer();

module.exports = router;

/**
 * @Route: principal.html
 * @Desc: Singn up a new user
 * @Http-type: GET
 */
router.get('/', mainControler.autoLogin);

/**
 * @Route: principal.html
 * @Desc: Submit login
 * @Http-type: POST
 */
router.post('/', mainControler.manualLogin);

/**
 * @Route: signup.html
 * @Desc: Takes you to signup view
 * @Http-type: GET
 */
router.get('/signup', mainControler.getSignUp);

/**
 * @Route: signup.html
 * @Desc: Submits signup credentials
 * @Http-type: POST
 */
router.post('/signup', mainControler.signUp);

/**
 * @Route: signup.html
 * @Desc: Takes you to signup view
 * @Http-type: GET
 */
router.get('/inicio', mainControler.getInicio);

/**
 * @Route: chat.html
 * @Desc: Takes your to chat view
 * @Http-type: GET
 */
router.get('/chat', mainControler.chat);

/**
 * @Route: profile.html
 * @Desc: Takes you to profile view
 * @Http-type: GET
 */
router.get('/profile', mainControler.getProfile);

/**
 * @Route: profile.html
 * @Desc: Updates user picture
 * @Http-type: POST
 */
router.post('/profile', fileUpload.single('profilepic'), mainControler.changeImg);

/**
 * @Route: admin.html
 * @Desc: Shows admin panel
 * @Http-type: GET
 */
router.get('/admin', mainControler.admin);

/**
 * @Route: admin.html
 * @Desc: Removes a select user then redirects to app.get('/admin')
 * @Http-type: POST
 */
router.get('/admin', mainControler.deleteAdmin);

/**
 * @Route: newpost.html
 * @Desc: Takes you to create new post view
 * @Http-type: GET
 */
router.get('/npost', mainControler.newPost);

/**
 * @Route: post.html
 * @Desc: Saves to db a created post
 * @Http-type: POST
 */
router.post('/spost', mainControler.savePost);

/**
 * @Route: inicio.html
 * @Desc: Kills user session
 * @Http-type: POST
 */
router.post('/logout', mainControler.logout);
