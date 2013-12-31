'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/*
	Create a user
	params: 
		email
		password
	returns
		if true, returns user
		if false, returns error message
*/
exports.createUser = function(req, res) {
    var user = new User({
    	email: req.query.email,
    	password: req.query.password
    });
    var message = null;

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }
            res.jsonp({"message:":message});
        }else{
        	message = "success";
        	user["_id"];
	        res.jsonp({"message:":message,"_id":user["_id"]});
        }
        
    });
};