var fs = require('fs');
var config = require('../../config/config');
var sendgrid  = require('sendgrid')(
  config.sendgrid.username,
  config.sendgrid.password
);

exports.sendContactEmail = function(req, res) {
    sendgrid.send({
      to: ['bakwarte@gmail.com', 'sean.alan.thomas@gmail.com'],
      from: 'support@solarmongo.com',
      subject: 'New Inquiry from SolarMongo!',
      html: '<h2>Name: '+req.body.firstName+' '+req.body.lastName+'</h2>'
            +'<h2>Company: '+req.body.companyName+'</h2>'
            +'<h2>Phone: '+req.body.phone+'</h2>'
            +'<h2>Email: '+req.body.email+'</h2><h2>Inquiry:</h2>'
            +'<h2>'+req.body.inquiry+'</h2>'
    }, function(err, json) {
        if (err) { return console.error(err); }
        res.render('pages/thankyou', {
            user: req.user ? JSON.stringify(req.user) : 'null',
            isLoggedIn: req.user ? true : false,
            title: "Thankyou for your inquiry!"
        });
    });
}

exports.sendResetPassword = function(to, link){
  sendgrid.send({
      to: to,
      from: 'support@solarmongo.com',
      subject: 'Reset Password from SolarMongo!',
      html: '<h2>Reset Password</h2>'
            +'<p><a href="'+link+'">Click here to reset your password</a></p>'
            +'<h3>Thank you for letting us help with your solar business</h3>'
            +'<h3>Regards,</h3><br />'
            +'<h3>Solarmongo Team</h3>'
    });
}



exports.market = function(req, res) {
  var fileName = './app/views/emails/template.html';
  fs.exists(fileName, function(exists) {
    if (exists) {
      fs.stat(fileName, function(error, stats) {
        fs.open(fileName, "r", function(error, fd) {
          var buffer = new Buffer(stats.size);
   
          fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
            var data = buffer.toString("utf8", 0, buffer.length);
   
            var result = data.replace(/#{Company}/g, 'SolarMongo');
            sendgrid.send({
              to: ['sean.alan.thomas@gmail.com'],
              from: 'info@solarmongo.com',
              subject: 'Manage Your Entire Solar Business Online!',
              html: result
            }, function(err, json) {
                if (err) { return console.error(err); }
                res.render('pages/thankyou', {
                    user: req.user ? JSON.stringify(req.user) : 'null',
                    isLoggedIn: req.user ? true : false,
                    title: "Thankyou for your inquiry!"
                });
            });
            fs.close(fd);
          });
        });
      });
    }
  });
  /*fs.readFile('./app/views/emails/template.html', function (err, html) {
    if (err) {
        throw err; 
    }
    //var result = html.replace("/#{Company}/g", 'My Company');
    console.log(html);
    sendgrid.send({
      to: ['sean.alan.thomas@gmail.com','bakwarte2@gmail.com'],
      from: 'info@solarmongo.com',
      subject: 'Manage Your Entire Solar Business Online!',
      html: html
    }, function(err, json) {
        if (err) { return console.error(err); }
        res.render('pages/thankyou', {
            user: req.user ? JSON.stringify(req.user) : 'null',
            isLoggedIn: req.user ? true : false,
            title: "Thankyou for your inquiry!"
        });
    });
  });*/
}   