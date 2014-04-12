'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    //UserSchema = require("./user").theUserSchema, var mySchema = new Schema({users:[UserSchema]})
    Schema = mongoose.Schema,
    Q = require('q');

/**
 * Account Schema
 */
var AccountSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    name: { type: String},
    phoneWork: { type: String},
    phoneMobile: { type: String},
    website: { type: String},
    email: { type: String},
    address: { type: String},
    city: { type: String},
    zip: { type: String},
    state: { type: String},
    country: { type: String},
    terms: { type: String},
    payingTier: {type: String},
    logo: { type: String},
    userCount: { type: Number}
    
});


/**
 * Validations
 */
 /*
AccountSchema.path('name').validate(function(name) {
    return name.length;
}, 'Company Name cannot be blank');

AccountSchema.path('email').validate(function(email) {
    return email.length;
}, 'Email address cannot be blank');

AccountSchema.path('country').validate(function(country) {
    return country.length;
}, 'Country cannot be blank');
*/

/**
 * Statics
 */
/*LeadSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};*/

AccountSchema.statics.insertAccount = function(){
    /*
    var account = new Account;
        account.save(function(err){
            if(err){
                console.log(err);
                return res.render('users/signup_admin', {
                    message: "Opps, there was an error that occured while trying to create your account, please contact technical support.",
                    user: user
                });
            }
    */
    var deferred = Q.defer();
    this.create({}).then(function(account){
        console.log(account)
        deferred.resolve(account);
    },function(err){
        console.log(err);
        deferred.reject(err);
    })
    return deferred.promise;
}

AccountSchema.statics.incrementUserCount = function(accountId, cb) {
    this.findById(accountId).exec(function(err, account) {
        if(err || !account) {
            cb(err, null);
            console.log(err);
        }else{
            if(!account.userCount)
                account.userCount=1;
            account.userCount = account.userCount + 1;
            account.save(function(err){
                if(err || !account) {
                    cb(err, null);
                    console.log(err);
                }else{
                    cb(false, "success");
                };
            });
        }
    });
}


mongoose.model('Account', AccountSchema);
