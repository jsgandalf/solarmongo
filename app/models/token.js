
var mongoose = require('mongoose'),
    Schema = mongoose.Schema

/*
    Token Schema
*/
var TokenSchema = new Schema({
    token: {type: String},
    created: {type: Date, default: Date.now},
});

TokenSchema.methods.hasExpired= function(){
    var now = new Date();
    return (now.getTime() - this.created.getTime()) > config.ttl;
};
mongoose.model('Token', TokenSchema);