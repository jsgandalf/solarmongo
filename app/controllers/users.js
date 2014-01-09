'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

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
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
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

exports.forgotPassword = function(req, res){
    User.generateResetToken(req.body.email, function(err, user) {
        if (err) {
            res.json({error: 'Issue finding user.'});
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
}

exports.resetPassword = function(req, res){
    console.log('GOT IN /reset/:id...');
    var token = req.params.id,
        messages = flash(null, null);

    if (!token) {
        console.log('Issue getting reset :id');
        //TODO: Error response...
    }
    else {
        console.log('In ELSE ... good to go.');
        //TODO
        //
        //1. find user with reset_token == token .. no match THEN error
        //2. check now.getTime() < reset_link_expires_millis
        //3. if not expired, present reset password page/form
        res.render('resetpass', messages);
    }
}