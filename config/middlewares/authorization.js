'use strict';

//var api = require('../../app/controllers/api');

/**
 * Generic require login routing middleware
 */

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
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

/**
 * Product authorizations routing middleware
 */
exports.product = {
    hasAuthorization: function(req, res, next) {
        if (req.product.account.toString() != req.user.account.toString()) {
            return res.send(401, 'You are not authorized');
        }
        next();
    }
};

/**
 * Account authorizations routing middleware
 */
/*exports.account = {
    hasAuthorization: function(req, res, next) {
        if (req.account._id.toString() != req.user.account.toString()) {
            return res.send(401, 'You are not authorized');
        }
        next();
    }
};*/