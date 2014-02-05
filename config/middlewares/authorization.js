'use strict';

//var api = require('../../app/controllers/api');

/**
 * Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    //Set access token in the request if access token is not present and user is authenticated
    /*if(req.isAuthenticated() && !req["query"]["access_token"]){
        //req.query.access_token = req.user.token.token;
        next();
    //if access token is present, then continue and test for the access token
    }else if(req["body"]["access_token"]!=='undefined'){
        next();
    //else if the user doesn't have an access token and is not authenticated
    }else if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }*/
    next();
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