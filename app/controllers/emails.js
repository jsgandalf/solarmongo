var config = require('../../config/config');
var sendgrid  = require('sendgrid')(
  config.sendgrid.username,
  config.sendgrid.password
);

exports.sendContactEmail = function(req, res) {
    sendgrid.send({
      to: 'sean.alan.thomas@gmail.com',
      from: 'support@solarmongo.com',
      subject: 'New Inquiry from SolarMongo!',
      html: '<h2>Name: '+req.body.firstName+' '+req.body.lastName+'</h2>'
            +'<h2>Company: '+req.body.companyName+'</h2>'
            +'<h2>Phone: '+req.body.phone+'</h2>'
            +'<h2>Email: '+req.body.email+'</h2><br/>'
            +'<p>'+req.body.inquiry+'</p>'
    }, function(err, json) {
        if (err) { return console.error(err); }
        res.render('pages/thankyou', {
            user: req.user ? JSON.stringify(req.user) : 'null',
            isLoggedIn: req.user ? true : false,
            title: "Thankyou for your inquiry!"
        });
    });
}