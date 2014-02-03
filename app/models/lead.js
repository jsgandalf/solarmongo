'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    SiteSurvey = require('./siteSurvey'),
    Schema = mongoose.Schema;

/**
 * Lead Schema
 */
var LeadSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated:{
        type: Date,
        default: Date.now
    },
    firstName: { type: String },
    lastName: { type: String },
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
    siteSurvey: {
        type: Schema.ObjectId,
        ref: 'SiteSurvey'
    },
    account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
 /*
LeadSchema.path('firstName').validate(function(firstName) {
    return firstName.length;
}, 'First Name of lead cannot be blank');

LeadSchema.path('lastName').validate(function(lastName) {
    return lastName.length;
}, 'Last Name of lead cannot be blank');

LeadSchema.path('status').validate(function(status) {
    return status.length;
}, 'A status has to be set');*/

/**
 * Statics
 */

        /*{}).exec(function(){
        if(err){
            console.log("Stack trace error: "+err);
            next(new Error('Stack trace error'+err));
        }else
            next();
    });
        
});*/

 /*

Author.pre('remove', function(next) {
    Author.remove({name: this.name, updated_at: this.updated_at }).exec();
    Book.remove({authorId : this._id}).exec();
    next();
});

 */
LeadSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('siteSurvey').populate('user', 'name').exec(cb);
};


mongoose.model('Lead', LeadSchema);
