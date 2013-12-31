'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Lead = mongoose.model('Lead'),
    _ = require('lodash');


/**
 * Find lead by id
 */
exports.lead = function(req, res, next, id) {
    Lead.load(id, function(err, lead) {
        if (err) return next(err);
        if (!lead) return next(new Error('Failed to load lead ' + id));
        req.lead = lead;
        next();
    });
};

/**
 * Create a lead
 */
exports.create = function(req, res) {
    var lead = new Lead(req.body);
    lead.user = req.user;

    lead.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                lead: lead
            });
        } else {
            res.jsonp(lead);
        }
    });
};

/**
 * Update a lead
 */
exports.update = function(req, res) {
    var lead = req.lead;

    lead = _.extend(lead, req.body);

    lead.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                lead: lead
            });
        } else {
            res.jsonp(lead);
        }
    });
};

/**
 * Delete an lead
 */
exports.destroy = function(req, res) {
    var lead = req.lead;

    lead.remove(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                lead: lead
            });
        } else {
            res.jsonp(lead);
        }
    });
};

/**
 * Show an lead
 */
exports.show = function(req, res) {
    res.jsonp(req.lead);
};

/**
 * List of leads by id
 */
exports.all = function(req, res) {
    Lead.find({user : req.user._id.toString()}).sort('-created').populate('user', 'name').exec(function(err, leads) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(leads);
        }
    });
};