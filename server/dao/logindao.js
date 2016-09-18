			/**
			 * @Author: Javier
			 * @Desc: Login data access object
			 */

			/*Instance of needed modules*/
			var MongoDB = require('mongodb').Db;
			var mongoose = require('mongoose');
			var user = require('../models/user');
			var Server = require('mongodb').Server;
			var dbprop = require('../properties/db-properties');



			dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);



			/*Check enviromemnt*/
			if (process.env.NODE_ENV == 'development') {
			    mongoose.connect('mongodb://localhost/ikariam');
			} else {
			    mongoose.connect('mongodb://devel:vivaeta@ds021036.mlab.com:21036/ikariam');
			}



			/* establish the database connection */
			var db = new MongoDB(dbprop.dbName, new Server(dbprop['app'].dbHost, dbprop.dbPort, {
			    auto_reconnect: true
			}), {
			    w: 1
			});

			db.open(function(e, d) {
			    if (e) {
			        console.log(e);
			    } else {
			        if (process.env.NODE_ENV == 'production') {
			            db.authenticate('devel', 'vivaeta', function(e, res) {
			                if (e) {
			                    console.log('mongo :: error: not authenticated', e);
			                } else {
			                    console.log('mongo :: authenticated and connected to database :: "' + dbprop.dbName + '"');
			                }
			            });
			        } else {
			            console.log('mongo :: connected to database :: "' + dbprop.dbName + '"');
			        }
			    }
			});


			//Colection we want to play with
			var accounts = db.collection('users');
			var codes = db.collection('codes');


			//dao loggin checking cookies
			exports.autoLogin = function(user, pass, callback) {

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
			exports.manualLogin = function(user, pass, callback) {

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

			exports.checkUser = function(user, callback) {

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

			exports.checkEmail = function(mail, callback) {

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

			exports.checkKey = function(clave, callback) {

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

			exports.signUp = function(email, username, pass, callback) {
			    //console.log(dbName, email, username, pass);

			    var newUser = user({
			        email: email,
			        username: username,
			        password: pass,
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
