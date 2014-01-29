'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Account = mongoose.model('Account'),
    _ = require('lodash');


/**
 * Find Account by id
 */
exports.account = function(req, res, next, id) {
    Account.load(id, function(err, account) {
        if (err) return next(err);
        if (!account) return next(new Error('Failed to load account ' + id));
        req.account = account;
        next();
    });
};

/**
 * Create an account
 */
exports.create = function(req, res) {
    var account = new Account(req.body);
    account.user = req.user;

    account.save(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(account);
        }
    });
};

/**
 * Update an account
 */
exports.update = function(req, res) {
    var account = req.account;

    account = _.extend(account, req.body);

    account.save(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(accounts);
        }
    });
};

/**
 * Delete an account
 */
exports.destroy = function(req, res) {
    var account = req.account;

    account.remove(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(account);
        }
    });
};

/**
 * Show an account
 */
exports.show = function(req, res) {
    res.jsonp(req.account);
};

/**
 * List of accounts by id
 */
exports.all = function(req, res) {
    Account.find({user : req.user._id.toString()}).sort('-created').populate('user', 'name').exec(function(err, account) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(leads);
        }
    });
};