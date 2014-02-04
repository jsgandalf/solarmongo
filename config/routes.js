'use strict';

var users = require('../app/controllers/users');
var leads = require('../app/controllers/leads');
var api = require('../app/controllers/api');
var pages = require('../app/controllers/pages');

module.exports = function(app, passport, auth) {
    //User Routes
    
    app.get('/signin', users.signin);
    app.get('/demo', users.demo);
    app.get('/signout', users.signout);
    app.get('/users/me', users.me);
    app.get('/admin', users.signup_admin);
    //Setting up the users api
    app.post('/users', users.create);

    //forgot password templates
    app.get('/forgotpassword', users.getForgetPassword)
    app.get('/resetpasswordsuccess', users.getResetPasswordSuccess)
    app.get('/reset/:id',users.resetPassword);
    //forgot password post functions
    app.post('/forgot',users.forgotPassword);
    app.post('/resetpassword',users.resetPasswordPost)

    //Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Finish with setting up the userId param
    app.param('userId', users.user);

    //Lead Routes
    app.get('/leads', auth.requiresLogin, leads.all);
    app.post('/leads', auth.requiresLogin, leads.create);
    app.get('/leads/:leadId', auth.requiresLogin, auth.lead.hasAuthorization, leads.show);
    app.put('/leads/:leadId', auth.requiresLogin, auth.lead.hasAuthorization, leads.update);
    app.del('/leads/:leadId', auth.requiresLogin, auth.lead.hasAuthorization, leads.destroy);

    //Finish with setting up the leadId param
    app.param('leadId', leads.lead);

    app.post('/api/token',api.getToken);
    //Pages route
    app.get('/', pages.index);
    app.get('/contactus', pages.contactUs);
    app.get('/aboutus', pages.aboutUs);
    app.get('/pricing', pages.pricing);
    app.get('/api', pages.api);

    //access token will be access with a user object
    // curl -v http://localhost:3000/api/token?user={..}
    
    
    var sendgrid = require('../app/controllers/emails');

    // mailing server
    app.post('/sendContactEmail',sendgrid.sendContactEmail);
};
