var config = require('../../config/config');
var stripe = require('stripe')(config.stripe.key);

exports.chargeCard = function(req,res){
    stripe.customers.createCard( 
        "cus_3M1FyVTNL0qz4p", 
        {card: "tok_103M0u2dozUZTk5JmtGgmpjv"}, 
        function(err, card) { // asynchronously called 
        } );
};

exports.addCustomer = function(req,res, email){
    console.log("created customer");
    stripe.customers.create({
      email: email
    }).then(function(customer) {
        console.log(customer);
        return stripe.charges.create({
        amount: 1600,
        currency: 'usd',
        customer: customer.id
      });
        
    }).then(function(charge) {
        console.log(charge);
      // New charge created on a new customer
    }, function(err) {
        console.log(err);
      // Deal with an error
    });
}