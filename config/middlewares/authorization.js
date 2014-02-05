'use strict';

/**
 * Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    /*if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }*/
    //token can be from the web app - req.user or from the api - req.body.user
        var token = "";
        console.log("here"); 
        if(typeof req.user.token.token)
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