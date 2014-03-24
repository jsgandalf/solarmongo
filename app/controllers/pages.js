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

exports.index = function(req, res) {
    res.render('index', {
        name: req.user ? req.user.name : 'null',
        role: req.user ? req.user.role : 'null',
        isLoggedIn: req.user ? true : false,
        isDevelopment: config.env=='development'
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