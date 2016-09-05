/**
			 * @Author: Javier
			 * @Desc: Login data access object
			 */
			
			/*Instance of needed modules*/
			var MongoDB 	= require('mongodb').Db;
			var mongoose 	= require('mongoose');
			var user 		= require('../models/user');
			var Server 		= require('mongodb').Server;
			var dbprop 		= require('../properties/db-properties');

			console.log('Entorno elegido  '+process.env.NODE_ENV);

			dbprop = dbprop.loadDbProperties(process.env.NODE_ENV);
			


			/*Check enviromemnt*/ 	
			if(process.env.NODE_ENV == 'development')
			{
				mongoose.connect('mongodb://localhost/ikariam');
			}
			else{
				mongoose.connect('mongodb://lorenzito93:soygamboa93@ds027215.mlab.com:27215/accounts');
			}

			

			/* establish the database connection */
			var db = new MongoDB(dbprop.dbName, new Server(dbprop['app'].dbHost, dbprop.dbPort, {auto_reconnect: true}), {w: 1});
				
				db.open(function(e, d){
				if (e) {
			console.log(e);
				} 
				else {
					if (process.env.NODE_ENV == 'production') {
						db.authenticate('lorenzito93', 'soygamboa93', function(e, res) {
							if (e) {
								console.log('mongo :: error: not authenticated', e);
							}
							else {
								console.log('mongo :: authenticated and connected to database :: "'+dbprop.dbName+'"');
							}
						});
					}	else{
						console.log('mongo :: connected to database :: "'+dbprop.dbName+'"');
					}
				}
			});


			//Colection we want to play with	
			var accounts = db.collection('users');


			//dao loggin checking cookies
			exports.autoLogin = function(user, pass, callback){
				
				accounts.findOne({username:user},function(e,o){
					if (o){
						o.password == pass ? callback(o) : callback(null);
					} else
					callback(null);
				})
			}


			//dao login when we use manual logins
			exports.manualLogin = function(user, pass, callback)
			{
				
				accounts.findOne({username:user}, function(e, o) {
							
					if(e){
						callback(null, e);
					}
					else if (o == null){
						callback('Invalid credentials');
						
				
					}	else{
						validatePassword(pass, o.password, function(err, res) {
							if (res){
								callback(null, o);
							}	else{
								callback('Invalid credentials');
							}
						});
					}
				});
			}

			exports.signUp = function(name, email, username, pass, callback){
				//console.log(dbName, email, username, pass);

				var newUser = user({
					name: name,
			 		email: email,
			 		username: username,
			 		password: pass,
			 		admin: false
			 		
				});
			
				newUser.save(function(err,o) {
			  	if (err) 
			  		callback(null, err);
			  		else if(o){
					// save the user
				 	 newUser.save();
				 	 mongoose.connection.close();
				 	 callback(null, 'User created!');
				 	 }

				});

			};


			/*Retreives user personal information */
			exports.getProfileInfo = function(username, callback){
				accounts.findOne({username:username},function(e,o){
					if (o){
						//console.log(o);
						callback(o);
					} else
					callback(null);
				})

				
			}
		    



			/*
			 *internal functions
			 */

			var validatePassword = function(insertedPass, dbPass, callback)
			{
				callback(null, dbPass === insertedPass);
			}

			var md5 = function(str) {
				return crypto.createHash('md5').update(str).digest('hex');
			}

			var validatePasswordHashed = function(plainPass, hashedPass, callback)
			{
				var salt = hashedPass.substr(0, 10);
				var validHash = salt + md5(plainPass + salt);
				//console.log(validHash);
				callback(null, hashedPass === validHash);
			}