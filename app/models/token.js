/*
    Token Schema
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var Token = new Schema({
    token: {type: String},
    created: {type: Date, default: Date.now}
});

Token.methods.hasExpired= function(){
    var now = new Date();
    return (now.getTime() - this.created.getTime()) > config.ttl;
};

mongoose.model('Token', Token);