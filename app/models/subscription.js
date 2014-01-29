'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Lead Schema
 */
var SubscriptionSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    price: { type: String},
    name: { type: String}
    
});



/**
 * Statics
 */
/*LeadSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name').exec(cb);
};*/

mongoose.model('Subscription', SubscriptionSchema);
