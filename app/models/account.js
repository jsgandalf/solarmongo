'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Lead Schema
 */
var AccountSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    companyName: { type: String},
    companyPhone: { type: String},
    companyEmail: { type: String},
    companyAddress: { type: String},
    companyCity: { type: String},
    companyZip: { type: String},
    companyState: { type: String},
    companyCountry: { type: String},
    companyTerms: { type: String},
    payingTier: {type: String},
    companyLogo: { type: String}
    
});


/**
 * Validations
 */
AccountSchema.path('companyName').validate(function(companyName) {
    return companyName.length;
}, 'Company Name cannot be blank');

AccountSchema.path('companyEmail').validate(function(companyEmail) {
    return companyEmail.length;
}, 'Email address cannot be blank');

AccountSchema.path('companyCountry').validate(function(companyCountry) {
    return companyCountry.length;
}, 'Country cannot be blank');
/**
 * Statics
 */
/*LeadSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};*/

mongoose.model('Account', AccountSchema);
