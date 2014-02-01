'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Lead = mongoose.model('Lead'),
    SiteSurvey = mongoose.model('SiteSurvey'),
    _ = require('lodash');


/**
 * Find lead by id, middleware
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
    //var siteSurvey = new SiteSurvey(req.body.siteSurvey);
    lead.user = req.user;

    var promise = Lead.save(lead);
    promise.then(function (newLead) {
        res.jsonp(newLead);
    }
    ,function(err){
        console.log(err);
        res.jsonp({"errors": err.errors});
    });
};

/**
 * Update a lead
 */
exports.update = function(req, res) {
    var lead = req.lead;
    //console.log(lead);
    lead = _.extend(lead, req.body);
    //console.log(lead);
    //console.log(req.body);

    console.log(req.body);

    lead.save(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(lead);
        }
    });
};

/**
 * Delete a lead
 */
exports.destroy = function(req, res) {
    var lead = req.lead;

    lead.remove(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(lead);
        }
    });
};

/**
 * Show a lead
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
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(leads);
        }
    });
};