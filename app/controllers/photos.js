'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Photo = mongoose.model('Photo'),
    _ = require('lodash'),
    fs = require('fs'),
    formidable = require('formidable'),
    Q = require('q');

    var knox = require("knox"),
    config = require('../../config/config');

    var client = knox.createClient({
      key: "AKIAJQLIVXV5DPLXTP4A",
      secret: "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",
      bucket: "solarmongo"
      //port: 8080
    });



exports.addMobilePhoto = function(req, res){
    console.log(req.files);
    //res.jsonp({files:req.files});
    /*fs.readFile(req.files, function (err, data) {
      console.log(data)
      var newPath = __dirname + "/public";
      fs.writeFile(newPath, data, function (err) {
        res.jsonp({files:data});
      });
    });*/
    /*fs.readFile(req.files.image.path, function (err, data) {
        console.log(req.files.image.name)
        var imageName = req.files.image.name
        /// If there's an error
        if(!imageName){

            console.log("There was an error")
            res.redirect("/");
            res.end();

        } else {

          var newPath = __dirname + "/uploads/fullsize/" + imageName;

          /// write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {

            /// let's see it
            res.redirect("/uploads/fullsize/" + imageName);

          });
        }
    });*/
}

exports.add = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (!files || !files.file || files.file.size == '0') {
            res.send("Photo must not be empty.");
        }else if( files.file.type == 'image/png' || files.file.type == 'image/jpeg' || files.file.type == 'image/gif' ){
            client.putFile(files.file.path,req.user.account+"/"+req.params.lead+"/"+files.file.name, {'x-amz-acl': 'public-read','Content-Length': files.file.size, 'Content-Type': files.file.type}, function(err, resp){
                if(err){
                    console.log(err);
                    res.send(err);      
                }else{
                    var photo = new Photo({
                        path: req.user.account+"/"+req.params.lead+"/"+files.file.name,
                        name: files.file.name,
                        type: files.file.type,
                        lead: req.params.lead,
                        account: req.user.account,
                        photoType: "lead"
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

exports.addCompanyPhoto = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (!files || !files.file || files.file.size == '0') {
            res.send("Photo must not be empty.");
        }else if( files.file.type == 'image/png' || files.file.type == 'image/jpeg' || files.file.type == 'image/gif' ){
            client.putFile(files.file.path,req.user.account+"/companyPhotos/"+files.file.name, {'x-amz-acl': 'public-read','Content-Length': files.file.size, 'Content-Type': files.file.type}, function(err, resp){
                if(err){
                    console.log(err);
                    res.send(err);      
                }else{
                    var photo = new Photo({
                        path: req.user.account+"/companyPhotos/"+files.file.name,
                        name: files.file.name,
                        type: files.file.type,
                        lead: req.params.lead,
                        account: req.user.account,
                        photoType: "company"
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
    photo.save(function(err){
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
        else{
            client.deleteFile(photo.path, function(err, resp){
                if (err)
                    res.jsonp({"errors": err.errors});   
                else
                    res.jsonp(photo);
            });
        }
    });
};

/**
 * Show a product
 */
exports.show = function(req, res) {
    res.jsonp(req.photo);
};


/**
 * List of products by lead id
 */
exports.all = function(req, res) {
    Photo.find({lead : req.lead._id.toString()}).sort('-created').exec(function(err, photos) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(photos);
        }
    });
};

exports.getCompanyPhotos = function(req, res) {
    Photo.find({account : req.user.account.toString(), photoType:"company"} ).sort('-created').exec().then(function(photos) {
        res.jsonp(photos);
    },function(err){
        console.log(err)
        res.jsonp({"errors": err.errors,err:err});
    });
};