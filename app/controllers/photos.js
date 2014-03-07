'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Photo = mongoose.model('Photo'),
    _ = require('lodash'),
    fs = require('fs'),
    formidable = require('formidable'),
    util = require('util');

    var knox = require("knox"),
    config = require('../../config/config');

    var client = knox.createClient({
      key: "AKIAJQLIVXV5DPLXTP4A",
      secret: "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",
      bucket: "solarmongo"
      //port: 8080
    });



exports.add = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (!files || !files.file || files.file.size == '0') {
            res.send("Photo must not be empty.");
        }else if( files.file.type == 'image/png' || files.file.type == 'image/jpeg' || files.file.type == 'image/gif' ){
            client.putFile(files.file.path,req.user.account+"/"+files.file.name, {'x-amz-acl': 'public-read','Content-Length': files.file.size, 'Content-Type': files.file.type}, function(err, resp){
                if(err){
                    console.log(err);
                    res.send(err);      
                }else{
                    var photo = new Photo({
                        path: req.user.account+"/"+files.file.name,
                        name: files.file.name,
                        type: files.file.type,
                        lead: req.params.lead,
                        account: req.user.account
                    });
                    photo.save(function(err){
                        if(err) res.jsonp({"errors": err.errors});
                        res.jsonp(photo);
                    });
                }
            });
        }else{
            res.send("Not a valid type! Must be jpg, jpeg, gif, or png");
        }
    });
}

    

/**
 * Find photo by id
 */

exports.photo = function(req, res, next, id) {
    Photo.load(id, function(err, photo) {
        if (err) return next(err);
        if (!photo) return next(new Error('Failed to load photo ' + id));
        req.photo = photo;
        next();
    });
};

/**
 * Create a photo
 */
exports.create = function(req, res) {
    var photo = new Photo(req.body);
    photo.user = req.user;
    photo.account = req.user.account; 
    Photo.create(photo, function(err){
        if(err) res.jsonp({"errors": err.errors});
        res.jsonp(photo);
    });
};

/**
 * Update a product
 */
exports.update = function(req, res) {
    var photo = req.photo;
    //console.log(product);
    photo = _.extend(photo, req.body);
    photo.save(function(err) {
        if (err)
            res.jsonp({"errors": err.errors});
        else 
            res.jsonp(photo);
    });
};

/**
 * Delete a product
 */
exports.destroy = function(req, res) {
    var photo = req.photo;
    photo.remove(function(err) {
        if (err)
            res.jsonp({"errors": err.errors});
        else
            res.jsonp(photo);
    });
};

/**
 * Show a product
 */
exports.show = function(req, res) {
    res.jsonp(req.photo);
};


/**
 * List of products by account id
 */
exports.all = function(req, res) {
    Photo.find({lead : req.lead._id.toString()}).sort('-created').populate('user', 'name').exec(function(err, products) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(products);
        }
    });
};