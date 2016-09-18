/**
 * @Author: Javier y Lorenzo
 * @Desc: Profile data access object
 */

/*Instance of needed modules*/
var MongoDB = require('mongodb').Db;
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


/*Retreives user personal information */
exports.getProfile = function(username, callback) {
    accounts.findOne({
        username: username
    }, function(e, o) {
        if (o) {
            //console.log(o);
            callback(o);
        } else
            callback(null);
    })


}
