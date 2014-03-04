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


/**
 * Find product by id
 */
 /*
exports.product = function(req, res, next, id) {
    Product.load(id, function(err, product) {
        if (err) return next(err);
        if (!product) return next(new Error('Failed to load product ' + id));
        req.product = product;
        next();
    });
};*/

exports.test = function(req, res) {
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
    /*res.render('pages/test', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "Fun Times"
    });*/
};

exports.add = function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        if (!files || !files.file || files.file.size == '0') {
            res.send("Photo must not be empty.");
        }else if( files.file.type == 'image/png' || files.file.type == 'image/jpeg' || files.file.type == 'image/gif' ){
            client.putFile(files.file.path,files.file.name, {'x-amz-acl': 'public-read','Content-Length': files.file.size, 'Content-Type': files.file.type}, function(err, resp){
                if(err){
                    console.log(err);
                    res.send(err);
                }else{
                    res.send("Houston, were good");
                }
            });
        }else{
            res.send("Not a valid type! Must be jpg, jpeg, gif, or png");
        }
    });
}

    


    /*

    // parse a file upload
    
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
   
      //res.writeHead(200, {'content-type': 'text/plain'});
      //res.write('Received upload:\n\n');
      //res.end(util.inspect(files));
    
      var fileUploadMessage = "";
        if (!files || !files.upload || files.upload.size == '0') {
            res.send("Photo must not be empty.");
        }
            else{ 
                var file = files.upload;
                if( file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif' ){
                    client.putFile(file.path, file.name, {'x-amz-acl': 'public-read','Content-Length': file.size, 'Content-Type': file.type}, function(err, resp){
                        if(err){
                            console.log(err);
                            res.send(err);
                        }else{
                            res.send("Houston, were good");
                        }
                    });
                }else{
                    res.send("Not a valid type! Must be jpg, jpeg, gif, or png");
                }
            }
    });*/

/**
 * Create a photo
 */
exports.addLeadPhoto = function(req, res) {
    console.log("here");
    /*var photo = new Photo(req.body);
    product.user = req.user;
    product.account = req.user.account;
    Product.create(product, function(err){
        if(err) res.jsonp({"errors": err.errors});
        res.jsonp(product);
    });*/
};

/**
 * Create a photo
 */
exports.create = function(req, res) {
    var photo = new Photo(req.body);
    product.user = req.user;
    product.account = req.user.account; 
    Product.create(product, function(err){
        if(err) res.jsonp({"errors": err.errors});
        res.jsonp(product);
    });
};

/**
 * Update a product
 */
exports.update = function(req, res) {
    var product = req.product;
    //console.log(product);
    product = _.extend(product, req.body);
    product.save(function(err) {
        if (err)
            res.jsonp({"errors": err.errors});
        else 
            res.jsonp(product);
    });
};

/**
 * Delete a product
 */
exports.destroy = function(req, res) {
    var product = req.product;
    product.remove(function(err) {
        if (err)
            res.jsonp({"errors": err.errors});
        else
            res.jsonp(product);
    });
};

/**
 * Show a product
 */
exports.show = function(req, res) {
    res.jsonp(req.product);
};


/**
 * List of products by account id
 */
exports.all = function(req, res) {
    Product.find({account : req.user.account.toString()}).sort('-created').populate('user', 'name').exec(function(err, products) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(products);
        }
    });
};