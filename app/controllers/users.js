'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    stripe = require('./payments'),
    validator = require('validator'),
    mailer = require('./emails'),
    config = require('../../config/config');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: 'Invalid email/password combination.'
    });
};

/**
 * Show sign up form
 */
exports.demo = function(req, res) {
    res.render('pages/demo', {
        title: 'Sign up',
        user: new User()
    });
};
exports.signup_admin = function(req, res) {
    res.render('users/signup_admin', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);
    var message = "";
    if(user.email == "")
        message = "Email is required";
    if(!validator.isEmail(user.email))
        message = "Not a valid email";
    //else if(user.password
    //stripe.addCustomer(req, res, user);
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

            return res.render('users/signup_admin', {
                message: message,
                user: user
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};

exports.getForgetPassword = function(req, res){
    res.render('users/forgotPassword', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "Forgot Password"
    });
}
exports.getResetPasswordSuccess = function(req, res){
    res.render('users/template', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "Password Request Sent",
        paragraph: "A reset link has been sent to your email. If your email has not been sent, allow 1 to 2 minutes to come in or check your spam folder. For security purposes, this link expires in 20 minutes."
    });
}
exports.forgotPassword = function(req, res){
    var email = req.body.email;
    var message ="";
    if(email == "")
        message = "Email is required";
    else if(!validator.isEmail(email))
        message = "Not a valid email";
    if(message!=""){
        res.render('users/forgotPassword', {
            user: req.user ? JSON.stringify(req.user) : 'null',
            isLoggedIn: req.user ? true : false,
            title: "Forgot Password",
            email: email,
            message: message
        });
    }else
        User.generateResetToken(email, function(err, user) {
            if (err) {
                res.render('users/forgotPassword', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Forgot Password",
                    email: email,
                    message: 'Could not find email.'
                });
            } else {
                var token = user.reset_token;
                var resetLink = 'http://' + config.host + '/reset/'+ token;
                mailer.sendResetPassword(user.email, resetLink);
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Forgot Password",
                    paragraph: "Please Check your email. You will have 20 minutes to resest your password."
                });
            }
        });
}

exports.resetPassword = function(req, res){
    var token = req.params.id,
        message = 'Reset Password link expired.';

    if (!token)
        res.render('users/template', {
            user: req.user ? JSON.stringify(req.user) : 'null',
            isLoggedIn: req.user ? true : false,
            title: "Error",
            paragraph: message
        });
    else {
        //TODO
        //
        //1. find user with reset_token == token .. no match THEN error
        //2. check now.getTime() < reset_link_expires_millis
        //3. if not expired, present reset password page/form
        User.findOne({reset_token: token}, function(err, usr) {
            var now = new Date();
            if(err || !usr) 
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Error",
                    paragraph: message
                });
            else if(now.getTime() < usr.reset_link_expires_millis)
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Error",
                    paragraph: "Your reset link has expired."
                });
            else
                res.render('users/reset', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    title: "Reset Password",
                    isLoggedIn: req.user ? true : false,
                    token: token
                });

        });
    }
}
exports.resetPasswordPost = function(req, res){
    var password = req.body.password;
    var password2 = req.body.password2;
    var token = req.body.token;
    User.findOne({reset_token: token}, function(err, user) {
        var now = new Date();
        if(err || !user) 
            res.render('users/template', {
                user: req.user ? JSON.stringify(req.user) : 'null',
                isLoggedIn: req.user ? true : false,
                title: "Error",
                paragraph: "Couldn't find user"
            });
        else if(validator.isNull(req.body.password))
            res.render('users/template', {
                user: req.user ? JSON.stringify(req.user) : 'null',
                isLoggedIn: req.user ? true : false,
                title: "Error",
                paragraph: "Password Is Required"
            });
        else if(password != password2) 
            res.render('users/reset', {
                user: req.user ? JSON.stringify(req.user) : 'null',
                isLoggedIn: req.user ? true : false,
                title: "Reset Password",
                token:token,
                message: "Passwords must match"
            });
        else if(now.getTime() < user.reset_link_expires_millis)
            res.render('users/template', {
                user: req.user ? JSON.stringify(req.user) : 'null',
                isLoggedIn: req.user ? true : false,
                title: "Error",
                paragraph: "Your reset link has expired."
            });
        else{
            user.password = req.body.password;
            user.reset_token = "";
            user.save();
            res.render('users/template', {
                user: req.user ? JSON.stringify(req.user) : 'null',
                title: "Successfully Changed Password",
                isLoggedIn: req.user ? true : false,
                paragraph: "Your password has been changed. Please login now."
            });
        }
    });
}