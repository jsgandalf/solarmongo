'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Lead = mongoose.model('Lead'),
    SiteSurvey = mongoose.model('SiteSurvey'),
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
    var lead = new Lead(req.body.general);
    var siteSurvey = new SiteSurvey(req.body.siteSurvey);
    lead.user = req.user;

    var promise = Lead.create(lead);
    promise.then(function (newLead) {
        res.jsonp(newLead);
    },function(err){
        console.log(err);
        res.jsonp({"errors": err.errors});
    });


    //var siteSurvey = new SiteSurvey(req.body.siteSurvey);
    //lead = _.extend(lead, req.body);
    
    //if(req.body.siteSurvey)
    //    req.body.siteSurvey);

    /*siteSurvey.lead = myLead._id;
            query2 = siteSurvey.save();
            return query2.exec();*/
            //console.log("lead: "+newLead._id)
    /*lead.save(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(lead);
        }
    });*/
    /*Q.ninvoke(lead.save(), 'toArray')
        .then(function (newLead) {
            console.log(newLead);
            res.jsonp(newLead);
        }, function(err) {
            res.jsonp({"errors": err.errors});
        });
    */
    /*lead.save(siteSurvey, function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            /*siteSurvey.lead = lead._id;
            siteSurvey.save(function(err) {
                if (err) {
                    res.jsonp({"errors": err.errors});
                } else {
                    res.jsonp(lead);
                }
            });*/
            /*res.jsonp(lead);
        }
    });*/
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