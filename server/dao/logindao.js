			/**
			 * @Author: Javier y Loren
			 * @Desc: Login data access object
			 */

			/*Instance of needed modules*/
			var mongoose = require('mongoose');
			var user = require('../models/user');
			var chalk = require('chalk');

			/*Check enviromemnt*/
			if(process.env.NODE_ENV == 'development')
			{
				mongoose.connect('mongodb://localhost/accounts');
			}
			else{
				mongoose.connect('mongodb://lorenzito93:soygamboa93@ds027215.mlab.com:27215/accounts');
			}

			//dao loggin checking cookies
			exports.autoLogin = function(user, pass,db, callback) {
			var accounts = db.collection('users');
			    accounts.findOne({
			        username: user
			    }, function(e, o) {
			        if (o) {
			            o.password == pass ? callback(o) : callback(null);
			        } else
			            callback(null);
			    })
			}


			//dao login when we use manual logins
			exports.manualLogin = function(user, pass, db, callback) {
			var accounts = db.collection('users');

			    accounts.findOne({
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

			exports.checkUser = function(user, db, callback) {
			var accounts = db.collection('users');

			    accounts.findOne({
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

			exports.checkEmail = function(mail, db, callback) {
			var accounts = db.collection('users');

			    accounts.findOne({
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

			exports.checkKey = function(clave, db, callback) {
			var codes = db.collection('codes');

			    codes.findOne({
			        key: clave
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback('invalidKey', false);
			        } else {
			            if (clave != "zaroskey") {
			                try {
			                    codes.deleteOne({
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

			exports.signUp = function(email, username, pass, db, callback) {
			var accounts = db.collection('users');

			    var newUser = user({
			        email: email,
			        username: username,
			        password: pass,
			        profilePic: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
			        admin: false

			    });

			    newUser.save(function(err, o) {
			        if (err)
			            callback(null, err);

			        if (o) {
			            // save the user
			            newUser.save();
			            mongoose.connection.close();
			            callback(null, 'User created!');
			        }




			    });

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
