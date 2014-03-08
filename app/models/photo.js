'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    //UserSchema = require("./user").theUserSchema, var mySchema = new Schema({users:[UserSchema]})
    Schema = mongoose.Schema;

/**
 * Account Schema
 */
var PhotoSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    description: { type: String},
    path: { type: String},
    name: {type:String},
    type: {type:String},
    photoType: {type:String},
    lead: {
        type: Schema.ObjectId,
        ref: 'Lead'
    },
    account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
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

PhotoSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};


mongoose.model('Photo', PhotoSchema);
exports.thePhotoSchema = PhotoSchema;
