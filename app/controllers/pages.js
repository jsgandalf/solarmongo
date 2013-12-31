'use strict';

exports.contactUs = function(req, res) {
    res.render('pages/contactUs', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false
    });
};

exports.aboutUs = function(req, res) {
    res.render('pages/aboutUs', {
        user: req.user ? JSON.stringify(req.user) : 'null',
        isLoggedIn: req.user ? true : false
    });
};