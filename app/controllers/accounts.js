'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    _ = require('lodash');


exports.getAssignees = function(req,res){
    User.find({ account: req.user.account}).select('name').exec(function(err, users){
        if (err) return next(err);
        else
            res.jsonp(users)
    });
}

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
    Account.findById(req.user.account.toString()).exec(function(err, account) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            account = _.extend(account, req.body);
            account.save(function(err) {
                if (err) {
                    res.jsonp({"errors": err.errors});
                } else {
                    res.jsonp(account);
                }
            });
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
    Account.findById(req.user.account.toString()).sort('-created').populate('user', 'name').exec(function(err, account) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(account);
        }
    });
};