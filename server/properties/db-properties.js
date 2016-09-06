/*
     *@Author: Javier
     *@Desc: Enviroment variables for db set-up
     */

 	var dbHost = process.env.DB_HOST  || 'localhost';
	var dbPort = process.env.DB_PORT  || 27017;
 	var dbName = process.env.DB_NAME  || 'ikariam';

 	var mongoconf = {
    development: {
        app: {
            dbHost: 'localhost'
        },
        dbPort: 27017,
        dbName: 'ikariam'
    },
    production: {
        app: {
            dbHost: 'ds021036.mlab.com'
        },
        dbPort: '27215',
        dbName: 'ikariam'
   }
};


   exports.loadDbProperties = function(enviroment){
 	return  mongoconf[enviroment];
  }
