'use strict';

//var api = require('../../app/controllers/api');

/**
 * Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    /*if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }*/
    
    //token can be from the web app - req.user or from the api - req.body.user
    //api.authenticateToken(req, res, next);
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
        if (req.lead.account.toString() != req.user.account.toString()) {
            return res.send(401, 'You are not authorized');
        }
        next();
    }
};