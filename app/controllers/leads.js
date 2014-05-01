'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Lead = mongoose.model('Lead'),
    SiteSurvey = mongoose.model('SiteSurvey'),
    _ = require('lodash'),
    formidable = require('formidable'),
    Q = require('q');


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
    lead.account = req.user.account; 
    var siteSurvey = new SiteSurvey(req.body.siteSurvey);
    SiteSurvey.create(siteSurvey, function(err, newSiteSurvey){
        if(err) res.jsonp({"errors": err.errors});
        lead.siteSurvey = newSiteSurvey._id;
        Lead.create(lead, function(err){
            if(err) res.jsonp({"errors": err.errors});
            res.jsonp(lead);
        });
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
            res.jsonp({"errors": err.errors});
        } else {
            if(typeof req.body.siteSurvey._id == "undefined"){
                res.jsonp(lead);
            }else{
                SiteSurvey.findById(req.body.siteSurvey._id, function (err, siteSurvey) {
                    if (err || !siteSurvey) 
                        res.jsonp({"errors": err});              
                    siteSurvey = _.extend(siteSurvey, req.body.siteSurvey);
                    siteSurvey.save(function (err) {
                        if (err) res.jsonp({"errors": err});
                        res.jsonp(lead);
                    });
                });
            }
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
            SiteSurvey.findById(req.lead.siteSurvey._id, function (err, siteSurvey) {
                if (err) res.jsonp({"errors": err.errors});              
                siteSurvey.remove(function (err) {
                    if (err) res.jsonp({"errors": err.errors});
                    res.jsonp(lead);
                });
            });
        }
    });
};

/**
 * Show a lead
 */
exports.show = function(req, res) {
    res.jsonp(req.lead);
};



exports.allSiteSurvey = function(req, res) {
    Lead.find({account : req.user.account.toString()}).sort('-created').populate('siteSurvey').populate('user', 'name').exec(function(err, leads) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(leads);
        }
    });
};
/**
 * List of leads by account id
 */
exports.all = function(req, res) {
    console.log(req.user)
    Lead.find({account : req.user.account.toString()}).sort('-created').populate('user', 'name').exec(function(err, leads) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(leads);
        }
    });
};

exports.getLeadSchema = function(req, res){
    var result = [];
    Lead.schema.eachPath(function(value){
        if(value != "_id" && value != "assignee" && value != "__v" && value !="updated")
            result.push(value)
    });
    res.jsonp(result)
}

exports.massUpload = function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(files.file.type)
        if (!files || !files.file || files.file.size == '0') {
            res.send("CSV must not be empty.");
        }else if( files.file.type == 'text/csv'){
            
            var Converter=require("csvtojson").core.Converter;

            console.log(files.file.path)
            //CSV File Path or CSV String or Readable Stream Object
            var csvFileName=files.file.path;

            //new converter instance
            var csvConverter=new Converter();

            //end_parsed will be emitted once parsing finished
            csvConverter.on("end_parsed",function(jsonObj){
               res.jsonp(jsonObj)
            });

            //read from file
            csvConverter.from(csvFileName);
        }else{
            res.send("Not a valid type! Must be CSV format");
        }
    }); 
}