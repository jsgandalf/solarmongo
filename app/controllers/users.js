'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    stripe = require('./payments'),
    validator = require('validator');

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
    console.log(req)
    res.render('users/signin', {
        title: 'Signin',
        message: 'Invalid email/password combination.'
    });
};

/**
 * Show sign up form
 */
/*exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};*/

exports.signup = function(req, res) {
    res.render('pages/signup', {
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
    console.log(user);
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

            return res.render('users/signup', {
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
        message: "A reset link has been sent to your email. If your email has not been sent, allow 1 to 2 minutes to come in or check your spam folder. For security purposes, this link expires in 20 minutes."
    });
}
exports.forgotPassword = function(req, res){
    var email = req.body.email;
    console.log(email);
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
                var resetLink = 'http://localhost:3000/reset/'+ token;

                //TODO: This is all temporary hackish. When we have email configured
                //properly, all this will be stuffed within that email instead :)
                res.send('<h2>Reset Email (simulation)</h2><br><p>To reset your password click the URL below.</p><br>' +
                '<a href=' + resetLink + '>' + resetLink + '</a><br>' +
                'If you did not request your password to be reset please ignore this email and your password will stay as it is.');
            }
        });
    console.log(message)    
}

exports.resetPassword = function(req, res){
    console.log('GOT IN /reset/:id...');
    var token = req.params.id,
        message = 'There was an issue with the reset password link';

    if (!token)
        res.render('users/template', {
            user: req.user ? JSON.stringify(req.user) : 'null',
            isLoggedIn: req.user ? true : false,
            title: "Error",
            message: message
        });
    else {
        //TODO
        //
        //1. find user with reset_token == token .. no match THEN error
        //2. check now.getTime() < reset_link_expires_millis
        //3. if not expired, present reset password page/form
        User.findOne({reset_token: token}, function(err, usr) {
            var now = new Date();
            console.log(now.getTime())
            console.log(usr);
            console.log(usr.reset_link_expires_millis)
            if(err || !usr) 
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Error",
                    message: message
                });
            else if(now.getTime() < usr.reset_link_expires_millis)
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Error",
                    message: "Your reset link has expired."
                });
            else
                res.render('users/reset', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    title: "Reset Password",
                    isLoggedIn: req.user ? true : false
                });

        });
    }
}
exports.resetPasswordPost = function(req, res){

        /*User.findOne({reset_token: token}, function(err, usr) {
            var now = new Date();
            if(err || !usr) 
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Error",
                    message: message
                });
            else if(now.getTime() < usr.reset_link_expires_millis)
                res.render('users/template', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Error",
                    message: "Your reset link has expired."
                });
            else
                res.render('users/reset', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    title: "Reset Password",
                    isLoggedIn: req.user ? true : false
                });

        });*/
}