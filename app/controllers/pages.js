'use strict';
var config = require('../../config/config');

exports.contact = function(req, res) {
    res.render('pages/contact', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "Contact Us"
    });
};

exports.about = function(req, res) {
    res.render('pages/about', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "About Us"
    });
};

exports.pricing = function(req, res) {
    res.render('pages/pricing', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "Pricing"
    });
};

exports.api = function(req, res) {
    res.render('api/api', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "API"
    });
};

exports.upload = function(req, res) {
    res.render('pages/upload', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "API"
    });
};


exports.index = function(req, res) {
    var token = "";
    console.log(req.user)
    if(!req.user){
        token="";
    }else{
        console.log(req.user)
        token= req.user.token.token;
    }
    res.render('index', {
        name: req.user ? req.user.name : 'null',
        role: req.user ? req.user.role : 'null',
        isLoggedIn: req.user ? true : false,
        isDevelopment: config.env=='development',
        token: token
    });
};

exports.privacy = function(req, res) {
    res.render('pages/privacy', {
        name: req.user ? req.user.name : 'null',
        role: req.user ? req.user.role : 'null',
        isLoggedIn: req.user ? true : false,
        isDevelopment: config.env=='development'
    });
};