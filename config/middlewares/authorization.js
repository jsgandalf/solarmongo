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

exports.photo = {
    hasAuthorization: function(req, res, next) {
        if (req.photo.account.toString() != req.user.account.toString()) {
            return res.send(401, 'You are not authorized');
        }
        next();
    }
};

var privs = require('../privs');

//Priveledges table

exports.authorize = function(rights) {
  return function(req, res, next) {
    var accessLevels = privs.getAccessLevels();
    var userRoles = privs.getRoles();
    //console.log("accessLevels[rights.access]: "+accessLevels[rights.access])
    console.log(accessLevels[rights.access] & userRoles[req.user.role])
    console.log(userRoles[req.user.role]);
    console.log("here2");
    if(rights.access && accessLevels[rights.access] & userRoles[req.user.role]) {
      console.log("here");
      //1 0000
      //0 0001
      next();
    } else {
      res.redirect('/');
    }
  };
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