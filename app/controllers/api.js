'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

    //authenticate token/user

exports.getToken = function(req, res){
    var token = "";
    //response[0] !== undefined && response[0].title !== undefined
    if(req["user"] !== undefined && req["user"]["token"] !== undefined && req["user"]["token"]["token"] !== undefined)
        token = req.user.token.token;
    else if(req.body.access_token)
        token = req.body.access_token;
    else
        return res.send(401, 'You are not authorized');
    var decoded;
    try{
        decoded = User.decode(token);
    }catch(err){
        console.log("This is a stack trace error: "+err);
        return next(err);
    }
    //Now do a lookup on that email in mongodb ... if exists it's a real user
    if (decoded && decoded.email) {
        User.findUser(decoded.email, token, function(err, user) {
            if (err) { return next(err); }
            if (!user) { return next(err); }
            req.user = user;
            console.log(user);
            console.log(req.user);
            return next(user);
        });
    } else {
        return next("Not authorized");
    }
}

//getToken
exports.getToken = function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    if(! email)
        res.json({error: 'Email required'});
    else if(! password)
        res.json({error: 'Passwword required'});
    else
        User.findOne({
            email: email
        }, function(err, user) {
            if (err)
                res.json({error: err});
            else if (! user || user==null)
                res.json({error: 'Unknown user'});
            else if (!user.authenticate(password)) 
                res.json({error: 'Invalid password'});
            else
                User.createUserToken(email, function(err, usersToken) {
                    if (err) {
                        res.json({error: 'Issue generating token'});
                    } else {
                        res.json(user);
                    }
                });
        });
}

/**
 * Show api docs
 */
exports.docs = function(req, res) {
    res.render('pages/api', {
        title: 'Api Docs',
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false
    });
};

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
            res.jsonp({'message:':message});
        }else{
            message = 'success';
            res.jsonp({'message:':message,'_id':user['_id']});
        }
    });
};