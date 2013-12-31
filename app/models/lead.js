'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Lead Schema
 */
var LeadSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String},
    title: { type: String},
    status: { type: String},
    email: { type: String},
    phoneWork: { type: String},
    phoneMobile: { type: String},
    address: { type: String},
    city: { type: String},
    state: { type: String},
    zip: { type: String},
    country: { type: String},
    longitude: {type: Number},
    latitude: {type: Number},
    notes: {type: String},
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
LeadSchema.path('firstName').validate(function(firstName) {
    return firstName.length;
}, 'First Name of lead cannot be blank');

LeadSchema.path('lastName').validate(function(lastName) {
    return lastName.length;
}, 'Last Name of lead cannot be blank');

/**
 * Statics
 */
LeadSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};

mongoose.model('Lead', LeadSchema);
