			/**
			 * @Author: Javier y Loren
			 * @Desc: Login data access object
			 */

			/*Instance of needed modules*/
			var User = require('../models/user');
			var Codes = require('../models/code');

			module.exports = {
			    autoLogin: autoLogin,
			    manualLogin: manualLogin,
			    checkUser: checkUser,
			    checkEmail: checkEmail,
			    checkKey: checkKey,
			    signUp: signUp
			}

			/**
			 *@desc: validates session credentials
			 *@param: user
			 *@param: pass
			 *@return:
			 */

			function autoLogin(user, pass, callback) {
			    User.findOne({
			        username: user
			    }, function(e, o) {
			        if (o) {
			            o.password == pass ? callback(o) : callback(null, e);
			        } else
			            callback(null);
			    })
			}

			/**
			 *@desc: validates if user introduced credentials are correct
			 *@param: user
			 *@param: pass
			 *@return:either a success login o/ invalid login
			 */
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

			/**
			 *@desc: checks if user already exists
			 *@param: user
			 *@return: a bolean value
			 */
			function checkUser(user, callback) {

			    User.findOne({
			        username: user
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback(false);
			        } else
			            callback(true, 'userExists');

			    });
			}

			/**
			 *@desc: checks if email already exists
			 *@param: mail
			 *@return: boolean value
			 */
			function checkEmail(mail, callback) {

			    User.findOne({
			        email: mail
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback(false);
			        } else
			            callback(true, 'emailExists');

			    });
			}

			/**
			 *@desc: validates keypass used on signup
			 *@param: clave
			 *@return: boolean value
			 */
			function checkKey(clave, callback) {

			    Codes.findOne({
			        key: clave
			    }, function(e, o) {
			        if (e) {
			            callback(null, e);
			        } else if (o == null) {
			            callback(false, 'invalidKey');
			        } else {
			            if (clave != process.env.KEY) {
			                Codes.remove({
			                    'key': clave
			                }, function(e, o) {
			                    if (e) {
			                        callback(false, e);
			                    } else
			                        callback(true);
			                	});

			            } else callback(true);

			        }

			    });
			}

			/**
			 *@desc: validates inputted key
			 *@param: email
			 *@param: username
			 *@param: pass
			 *@return: return if user has been created
			 */
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
			    callback(true);
			};

			/*********************************************************
			        					PRIVATE FUNCTIONS
		  **********************************************************/

			// Nodejs encryption with CTR
			var crypto = require('crypto'),
			    algorithm = 'aes-256-ctr',
			    password = 'd6F3Efeq';
			//encrypt text
			function encrypt(text) {
			    var cipher = crypto.createCipher(algorithm, password)
			    var crypted = cipher.update(text, 'utf8', 'hex')
			    crypted += cipher.final('hex');
			    return crypted;
			}

			//descrypted text
			function decrypt(text) {
			    var decipher = crypto.createDecipher(algorithm, password)
			    var dec = decipher.update(text, 'hex', 'utf8')
			    dec += decipher.final('utf8');
			    return dec;
			}

			//checks if plain text matches up with encrypted one
			var validatePassword = function(insertedPass, dbPass, callback) {
			    callback(null, dbPass === insertedPass);
			}
