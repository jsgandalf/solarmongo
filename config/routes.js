'use strict';


var users = require('../app/controllers/users');
var webUsers = require('../app/controllers/webUsers');
var leads = require('../app/controllers/leads');
var products = require('../app/controllers/products');
var photos = require('../app/controllers/photos');
var account = require('../app/controllers/accounts');
var api = require('../app/controllers/api');
var pages = require('../app/controllers/pages');
var sendgrid = require('../app/controllers/emails');
var photo = require('../app/controllers/photos');
var fs = require('fs');


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
    app.get('/users',passport.authenticate('bearer', { session: false }), webUsers.all);
    app.post('/users',passport.authenticate('bearer', { session: false }), webUsers.add);
    app.get('/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.show);
    app.put('/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.update);
    app.del('/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.destroy);
    
    //Finish with setting up the webUserId param
    app.param('webUserId', webUsers.webUser);


    app.get('/profile', passport.authenticate('bearer', { session: false }), users.me);

    //Photo Routes
    app.post('/upload/lead/:lead', passport.authenticate('bearer', { session: false }), photo.add);

    app.get('/upload', pages.upload)

    //api
    app.get('/upload/companyPhoto', passport.authenticate('bearer', { session: false }), photo.getCompanyPhotos);
    
    app.post('/upload/companyPhoto', passport.authenticate('bearer', { session: false }), photo.addCompanyPhoto);

    //Photo Routes - Note that most of these routes aren't done, only the one above and photos.all
    app.get('/photos/lead/:leadId', passport.authenticate('bearer', { session: false }), photos.all);

    app.get('/photos', passport.authenticate('bearer', { session: false }), photo.all);
    app.post('/photos', passport.authenticate('bearer', { session: false }), photos.create);
    app.get('/photos/:photoId', passport.authenticate('bearer', { session: false }),auth.photo.hasAuthorization, photos.show);
    app.put('/photos/:photoId', passport.authenticate('bearer', { session: false }), auth.photo.hasAuthorization, photos.update);
    app.del('/photos/:photoId', passport.authenticate('bearer', { session: false }), auth.photo.hasAuthorization, photos.destroy);

    //Finish with setting up the photoId param
    app.param('photoId', photos.photo);

    //mass upload
    app.post('/leads/massupload',passport.authenticate('bearer', { session: false }), leads.massUpload)
    app.get('/leads/getLeadSchema',passport.authenticate('bearer', { session: false }), leads.getLeadSchema)
    app.get('/leads/alldata', passport.authenticate('bearer', { session: false }), leads.allSiteSurvey);
    app.get('/leads', passport.authenticate('bearer', { session: false }), leads.all);
    app.post('/leads', passport.authenticate('bearer', { session: false }), leads.create);
    app.get('/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.show);
    app.put('/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.update);
    app.del('/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.destroy);

    //Finish with setting up the leadId param
    app.param('leadId', leads.lead);

    app.get('/products', passport.authenticate('bearer', { session: false }), products.all);
    app.post('/products', passport.authenticate('bearer', { session: false }), products.create);
    app.get('/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.show);
    app.put('/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.update);
    app.del('/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.destroy);
    
    //Finish with setting up the leadId param
    app.param('productId', products.product);

    //Account api
    app.get('/account',passport.authenticate('bearer', { session: false }), account.show);
    app.put('/account',passport.authenticate('bearer', { session: false }), account.update);
    app.get('/account/getAssignees', passport.authenticate('bearer', { session: false }), account.getAssignees);


    //api get token
    app.get('/api/token',api.getToken);
    app.post('/api/token',api.getToken);

    //Pages route
    app.get('/', pages.index);
    app.get('/contact', pages.contact);
    app.get('/about', pages.about);
    app.get('/pricing', pages.pricing);
    app.get('/privacy', pages.privacy);
    app.get('/api', pages.api);

    //access token will be access with an access token
    // curl -v http://localhost:3000/api/?access_token=???
    app.get('/api/token', auth.requiresLogin, users.me)

    // mailing server
    app.post('/sendContactEmail',sendgrid.sendContactEmail);
    app.get('/market',sendgrid.market);
};
