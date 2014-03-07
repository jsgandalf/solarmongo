'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    PhotoSchema = require("./photo").thePhotoSchema,
    Schema = mongoose.Schema;

/**
 * Lead Schema
 */
var siteSurveySchema = new Schema({
    jobSite: {
        firstName:{type: String, default: '', trim: true},
        lastName:{type: String, default: '', trim: true},
        address:{type: String, default: '', trim: true},
        city:{type: String, default: '', trim: true},
        state:{type: String, default: '', trim: true},
        zip:{type: String, default: '', trim: true},
        roofingType:{type: String, default: '', trim:true},
        layers:{type: String, default: '', trim:true},
        height:{type: Number, default: '', trim:true},
        pitch:{type: String, default: '', trim:true},
        location:{type: String, default: '', trim:true},
        eyeAvailability:{type: Boolean, default: false},
        rafterSpacingAndSize:{type: String, default: '', trim:true},
        truss:{type: Boolean, default: false},
        otherTruss:{type: String, default: '', trim:true},
        description:{type: String, default: '', trim:true}
    },
    pictures: {
        site:{type: Boolean, default: false},
        inverterLocation:{type: Boolean, default: false},
        powerMeterClosed:{type: Boolean, default: false},
        powerMeterOpen:{type: Boolean, default: false},
        shadingProblems:{type: Boolean, default: false},
        arrayLocation:{type: Boolean, default: false},
        breakerPanelsClosed:{type: Boolean, default: false},
        breakerPanelsOpen:{type: Boolean, default: false}
    },
    customerExpectation: {
        partBill:{type: String, default: '', trim:true},
        fullBill:{type: String, default: '', trim:true},
        systemType:{type: String, default: '', trim:true}
    },
    siteSurveyNotes:{type: String, default: '', trim:true},
    lead: {
        type: Schema.ObjectId,
        ref: 'Lead'
    },
    gallery: [Object]
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
siteSurveySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};

mongoose.model('SiteSurvey', siteSurveySchema);
