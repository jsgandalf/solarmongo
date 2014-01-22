'use strict';

var path = require('path'),
rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    /**
	* Millis conversions cheat sheet:
	* 1 second: 1000
	* 1 minute: 60000
	* 10 minutes: 600000
	* 30 minutes: 1800000
	* 1 hour: 3600000
	* 12 hours: 43200000
	* 24 hours: 86400000
	* 1 week: 604800000
	*/
    'ttl': 3600000, //1 hour
    'resetTokenExpiresMinutes': 20, //20 minutes later
    sendgrid:{
        username:"app20720888@heroku.com",
        password:"kwodielp"
    }
}
