'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    UserSchema = require("./user").theUserSchema,
    Schema = mongoose.Schema;

/**
 * Lead Schema
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
    phone: { type: String},
    email: { type: String},
    address: { type: String},
    city: { type: String},
    zip: { type: String},
    state: { type: String},
    country: { type: String},
    terms: { type: String},
    payingTier: {type: String},
    logo: { type: String},
    users:[UserSchema]
    
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

mongoose.model('Account', AccountSchema);
