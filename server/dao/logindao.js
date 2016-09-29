			/**
			 * @Author: Javier y Loren
			 * @Desc: Login data access object
			 */

			/*Instance of needed modules*/
			var User = require('../models/user');
			var chalk = require('chalk');
			var Codes = require('../models/code');

			module.exports = {
				autoLogin: autoLogin,
				manualLogin: manualLogin,
				checkUser: checkUser,
				checkEmail: checkEmail,
				checkKey: checkKey,
				signUp: signUp
			}

			//dao loggin checking cookies
			function autoLogin(user, pass, callback) {
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
			function manualLogin(user, pass, callback) {
				var passSecure;
			    User.findOne({
			        username: user
			    }, function(e, o) {

			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback(null, 'invalidLogin');


			        } else {
									passSecure = encrypt(pass);
			            validatePassword(passSecure, o.password, function(err, res) {
			                if (res) {
			                    callback(o);
			                } else {
			                    callback(null, 'invalidLogin');
			                }
			            });
			        }
			    });
			}

			function checkUser(user, callback) {

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

			function checkEmail(mail, callback) {

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

			function checkKey(clave, callback) {

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

			function signUp(email, username, pass, callback) {

					var passSecure = encrypt(pass);
			    var newUser = new User({
			        email: email,
			        username: username,
			        password: passSecure,
			        profilePic: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
			        admin: false

			    });

			        newUser.save();
			        callback(null, 'User created!');



			};


			/*
			 *internal functions
			 */

	 // Nodejs encryption with CTR
	 var crypto = require('crypto'),
	     algorithm = 'aes-256-ctr',
	     password = 'd6F3Efeq';

	 function encrypt(text){
	   var cipher = crypto.createCipher(algorithm,password)
	   var crypted = cipher.update(text,'utf8','hex')
	   crypted += cipher.final('hex');
	   return crypted;
	 }

	 function decrypt(text){
	   var decipher = crypto.createDecipher(algorithm,password)
	   var dec = decipher.update(text,'hex','utf8')
	   dec += decipher.final('utf8');
	   return dec;
	 }

	 var validatePassword = function(insertedPass, dbPass, callback) {
			 callback(null, dbPass === insertedPass);
	 }
