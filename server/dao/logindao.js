			/**
			 * @Author: Javier y Loren
			 * @Desc: Login data access object
			 */

			/*Instance of needed modules*/
			var User = require('../models/user');
			var chalk = require('chalk');
			var Codes = require('../models/code')

			//dao loggin checking cookies
			exports.autoLogin = function(user, pass, callback) {
			    User.findOne({
			        username: user
			    }, function(e, o) {
			        if (o) {
			            o.password == pass ? callback(o) : callback(null);
			        } else
			            callback(null);
			    })
			}


			//dao login when we use manual logins
			exports.manualLogin = function(user, pass, callback) {
			    User.findOne({
			        username: user
			    }, function(e, o) {

			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback('invalidLogin');


			        } else {
			            validatePassword(pass, o.password, function(err, res) {
			                if (res) {
			                    callback(null, o);
			                } else {
			                    callback('invalidLogin');
			                }
			            });
			        }
			    });
			}

			exports.checkUser = function(user, callback) {

			    User.findOne({
			        username: user
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback(null, false);
			        } else
			            callback('userExists', true);

			    });
			}

			exports.checkEmail = function(mail, callback) {

			    User.findOne({
			        email: mail
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback(null, false);
			        } else
			            callback('emailExists', true);

			    });
			}

			exports.checkKey = function(clave, callback) {

			    Codes.findOne({
			        key: clave
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback('invalidKey', false);
			        } else {
			            if (clave != "zaroskey") {
			                try {
			                    Codes.deleteOne({
			                        "key": clave
			                    });
			                    callback(null, true);
			                } catch (e) {
			                    console.log(e);
			                }

			            } else callback(null, true);

			        }



			    });
			}

			exports.signUp = function(email, username, pass, callback) {

			    var newUser = new User({
			        email: email,
			        username: username,
			        password: pass,
			        profilePic: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
			        admin: false

			    });

			        newUser.save();
			        callback(null, 'User created!');



			};


			/*
			 *internal functions
			 */

			var validatePassword = function(insertedPass, dbPass, callback) {
			    callback(null, dbPass === insertedPass);
			}

			var md5 = function(str) {
			    return crypto.createHash('md5').update(str).digest('hex');
			}

			var validatePasswordHashed = function(plainPass, hashedPass, callback) {
			    var salt = hashedPass.substr(0, 10);
			    var validHash = salt + md5(plainPass + salt);
			    //console.log(validHash);
			    callback(null, hashedPass === validHash);
			}
