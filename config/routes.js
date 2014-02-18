'use strict';


var users = require('../app/controllers/users');
var webUsers = require('../app/controllers/webUsers');
var leads = require('../app/controllers/leads');
var products = require('../app/controllers/products');
var account = require('../app/controllers/accounts');
var api = require('../app/controllers/api');
var pages = require('../app/controllers/pages');
var sendgrid = require('../app/controllers/emails');
var s3 = require('../app/controllers/upload');


module.exports = function(app, passport, auth) {
    //User Routes
    app.get('/signin', users.signin);
    app.get('/demo', users.demo);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.get('/admin', users.signup_admin);
    
    //Setting up the users api
    app.post('/admin/users/create', users.create);

    //forgot password templates
    app.get('/forgotpassword', users.getForgetPassword)
    app.get('/resetpasswordsuccess', users.getResetPasswordSuccess)
    app.get('/reset/:id',users.resetPassword);
    //forgot password post functions
    app.post('/forgot',users.forgotPassword);
    app.post('/resetpassword',users.resetPasswordPost)
    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //web user in app
    app.get('/users',auth.requiresLogin, webUsers.all);
    app.post('/users',auth.requiresLogin, webUsers.add);
    app.get('/users/:webUserId',auth.requiresLogin, webUsers.show);
    app.put('/users/:webUserId',auth.requiresLogin, webUsers.update);
    app.del('/users/:webUserId',auth.requiresLogin, webUsers.destroy);
    
    //user api
    app.get('/api/users', passport.authenticate('bearer', { session: false }), webUsers.all);
    app.post('/api/users',passport.authenticate('bearer', { session: false }), webUsers.add);
    app.get('/api/users/:webUserId', passport.authenticate('bearer', { session: false }), webUsers.show);
    app.put('/api/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.update);
    app.del('/api/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.destroy);
    //Finish with setting up the webUserId param
    app.param('webUserId', webUsers.webUser);


    app.get('/profile', passport.authenticate('bearer', { session: false }), users.me);
    //Lead Routes
    app.get('/leads', leads.all);
    app.post('/leads', auth.requiresLogin, leads.create);
    app.get('/leads/:leadId', auth.lead.hasAuthorization, leads.show);
    app.put('/leads/:leadId', auth.requiresLogin, auth.lead.hasAuthorization, leads.update);
    app.del('/leads/:leadId', auth.requiresLogin, auth.lead.hasAuthorization, leads.destroy);

    //api
    app.get('/api/leads/alldata', passport.authenticate('bearer', { session: false }), leads.allSiteSurvey);
    app.get('/api/leads', passport.authenticate('bearer', { session: false }), leads.all);
    app.post('/api/leads', passport.authenticate('bearer', { session: false }), leads.create);
    app.get('/api/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.show);
    app.put('/api/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.update);
    app.del('/api/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.destroy);

    //Finish with setting up the leadId param
    app.param('leadId', leads.lead);

    //product routes
    app.get('/products', products.all);
    app.post('/products', auth.requiresLogin, products.create);
    app.get('/products/:productId', auth.product.hasAuthorization, products.show);
    app.put('/products/:productId', auth.requiresLogin, auth.product.hasAuthorization, products.update);
    app.del('/products/:productId', auth.requiresLogin, auth.product.hasAuthorization, products.destroy);

    //api
    app.get('/api/products', passport.authenticate('bearer', { session: false }), products.all);
    app.post('/api/products', passport.authenticate('bearer', { session: false }), products.create);
    app.get('/api/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.show);
    app.put('/api/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.update);
    app.del('/api/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.destroy);
    
    //Finish with setting up the leadId param
    app.param('productId', products.product);

    //Account
    app.get('/account',auth.requiresLogin, account.show);
    app.put('/account',auth.requiresLogin, account.update);
    app.get('/account/getAssignees',auth.requiresLogin, account.getAssignees);
    //Account api
    app.get('/api/account',passport.authenticate('bearer', { session: false }), account.show);
    app.put('/api/account',passport.authenticate('bearer', { session: false }), account.update);
    app.get('/api/account/getAssignees', passport.authenticate('bearer', { session: false }), account.getAssignees);

    //Uploader with amazon s3
    app.get('/upload/put', s3.put);

    app.get('/api/token',api.getToken);
    app.post('/api/token',api.getToken);

    //Pages route
    app.get('/', pages.index);
    app.get('/contactus', pages.contactUs);
    app.get('/aboutus', pages.aboutUs);
    app.get('/pricing', pages.pricing);
    app.get('/api', pages.api);

    //access token will be access with an access token
    // curl -v http://localhost:3000/api/?access_token=???
    app.get('/api/token', auth.requiresLogin, users.me)

    // mailing server
    app.post('/sendContactEmail',sendgrid.sendContactEmail);
};
