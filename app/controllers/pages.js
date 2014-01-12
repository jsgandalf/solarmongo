'use strict';

exports.contactUs = function(req, res) {
    res.render('pages/contactUs', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "Contact Us"
    });
};

exports.aboutUs = function(req, res) {
    res.render('pages/aboutUs', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "About Us"
    });
};

exports.api = function(req, res) {
    res.render('pages/api', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false,
        title: "About Us"
    });
};