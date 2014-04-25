'use strict';


var users = require('../app/controllers/users'),
    webUsers = require('../app/controllers/webUsers'),
    leads = require('../app/controllers/leads'),
    products = require('../app/controllers/products'),
    photos = require('../app/controllers/photos'),
    account = require('../app/controllers/accounts'),
    api = require('../app/controllers/api'),
    pages = require('../app/controllers/pages'),
    sendgrid = require('../app/controllers/emails'),
    photo = require('../app/controllers/photos'),
    privs = require('./privs');

var fs = require('fs');


module.exports = function(app, passport, auth) {
    
    app.get('/access-levels', privs.accessLevels);

    //User Routes
    app.get('/signin', users.signin);
    app.get('/demo', users.demo);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.get('/admin', auth.authorize({access: 'superadmin'}), users.signup_admin);
    
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
    app.get('/api/users',passport.authenticate('bearer', { session: false }), webUsers.all);
    app.post('/api/users',passport.authenticate('bearer', { session: false }), webUsers.add);
    app.get('/api/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.show);
    app.put('/api/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.update);
    app.del('/api/users/:webUserId',passport.authenticate('bearer', { session: false }), webUsers.destroy);
    
    //Finish with setting up the webUserId param
    app.param('webUserId', webUsers.webUser);


    app.get('/api/profile', passport.authenticate('bearer', { session: false }), users.me);

    //Photo Routes
    app.post('/api/upload/lead/:lead', passport.authenticate('bearer', { session: false }), photo.add);

    app.get('/api/upload', pages.upload)

    //api
    app.get('/api/upload/companyPhoto', passport.authenticate('bearer', { session: false }), photo.getCompanyPhotos);
    
    app.post('/api/upload/companyPhoto', passport.authenticate('bearer', { session: false }), photo.addCompanyPhoto);

    //Photo Routes - Note that most of these routes aren't done, only the one above and photos.all
    app.get('/api/photos/lead/:leadId', passport.authenticate('bearer', { session: false }), photos.all);

    app.get('/api/photos', passport.authenticate('bearer', { session: false }), photo.all);
    app.post('/api/photos', passport.authenticate('bearer', { session: false }), photos.create);
    app.get('/api/photos/:photoId', passport.authenticate('bearer', { session: false }),auth.photo.hasAuthorization, photos.show);
    app.put('/api/photos/:photoId', passport.authenticate('bearer', { session: false }), auth.photo.hasAuthorization, photos.update);
    app.del('/api/photos/:photoId', passport.authenticate('bearer', { session: false }), auth.photo.hasAuthorization, photos.destroy);

    //Finish with setting up the photoId param
    app.param('photoId', photos.photo);

    //mass upload
    app.post('/api/leads/massupload',passport.authenticate('bearer', { session: false }), leads.massUpload)
    app.get('/api/leads/getLeadSchema',passport.authenticate('bearer', { session: false }), leads.getLeadSchema)
    app.get('/api/leads/alldata', passport.authenticate('bearer', { session: false }), leads.allSiteSurvey);
    app.get('/api/leads', auth.authorize({access: 'user'}), passport.authenticate('bearer', { session: false }), leads.all);
    app.post('/api/leads', passport.authenticate('bearer', { session: false }), leads.create);
    app.get('/api/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.show);
    app.put('/api/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.update);
    app.del('/api/leads/:leadId', passport.authenticate('bearer', { session: false }), auth.lead.hasAuthorization, leads.destroy);

    //Finish with setting up the leadId param
    app.param('leadId', leads.lead);

    app.get('/api/products', passport.authenticate('bearer', { session: false }), products.all);
    app.post('/api/products', passport.authenticate('bearer', { session: false }), products.create);
    app.get('/api/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.show);
    app.put('/api/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.update);
    app.del('/api/products/:productId', passport.authenticate('bearer', { session: false }), auth.product.hasAuthorization, products.destroy);
    
    //Finish with setting up the leadId param
    app.param('productId', products.product);

    //Account api
    app.get('/api/account',passport.authenticate('bearer', { session: false }), account.show);
    app.put('/api/account',passport.authenticate('bearer', { session: false }), account.update);
    app.get('/api/account/getAssignees', passport.authenticate('bearer', { session: false }), account.getAssignees);


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
    //curl -v http://localhost:3000/api/?access_token=???
    app.get('/api/token', auth.requiresLogin, users.me)

    // mailing server
    app.post('/api/sendContactEmail',sendgrid.sendContactEmail);
    app.get('/api/market',sendgrid.market);
};
