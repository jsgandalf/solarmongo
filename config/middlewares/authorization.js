'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next, done) {
    /*if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }*/
    if(!req.user.token.token)
        return res.send(401, 'Token is not authorized');
    var decoded;
    try{
        decoded = User.decode(req.user.token.token);
    }catch(err){
        console.log("This is a stack trace error: "+err);
        return done(err);
    }
    //Now do a lookup on that email in mongodb ... if exists it's a real user
    if (decoded && decoded.email) {
        User.findUser(decoded.email, req.user.token.token, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    } else {
        return done(null, false);
    }
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Lead authorizations routing middleware
 * must have lead in the req, through the middleware, designed for update and delete functions only
 */
exports.lead = {
    hasAuthorization: function(req, res, next) {
        console.log(req.lead.account)
        console.log(req.user.account);
        if (req.lead.account.toString() != req.user.account.toString()) {
            return res.send(401, 'You are not authorized');
        }
        next();
    }
};