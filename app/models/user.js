'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    tokenSecret = '@CSHeM*$[*GE_Q&stqOAIvkl6s%P-[B!De5o]HFzjM18BFa_!8D|{i2bBm.iE<W';

/*
    Token Schema
*/
var Token = new Schema({
    token: {type: String},
    date_created: {type: Date, default: Date.now},
});

Token.methods.hasExpired= function(){
    var now = new Date();
    return (now.getTime() - this.date_created.getTime()) > config.ttl;
};
var TokenModel = mongoose.model('Token', Token);

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    hashed_password: String,
    salt: String,
    date_created: {type: Date, default: Date.now},
    token: {type: Object},
    //For reset we use a reset token with an expiry (which must be checked)
    reset_token: {type: String},
    reset_token_expires_millis: {type: Number},
    account: {
        type: Schema.ObjectId,
        ref: 'Account'
    },
    role: {type: String}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

UserSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
 /*
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    if (!validatePresenceOf(this.password))
        next(new Error('Invalid password'));
    else
        next();
});*/

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    },
};

/*
* Encode token
*
* @param {String} data
* @return {String}
*/
UserSchema.statics.encode = function(data) {
    return jwt.encode(data, tokenSecret);
},
/*
* Decode token
*
* @param {String} data
* @return {String}
*/
UserSchema.statics.decode = function(data) {
    return jwt.decode(data, tokenSecret);
};
UserSchema.statics.findUser = function(email, token, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
            console.log(err);
        } else if (token === usr.token.token) {
            cb(false, {_id:usr._id, email: usr.email, token: usr.token, date_created: usr.date_created, name: usr.name,account: usr.account, role:usr.role});
        } else {
            cb(new Error('Token does not match.'), null);
        }
    });
},

UserSchema.statics.createUserToken = function(email, cb) {
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            cb(err, null);
            console.log('err');
        }
        //Create a token and add to user and save
        var token = self.encode({email: email});
        usr.token = new TokenModel({token:token});
        usr.save(function(err, usr) {
            if (err)
                cb(err, null);
            else {
                //console.log("about to cb with usr.token.token: " + usr.token.token);
                cb(false, usr.token.token);//token object, in turn, has a token property :)
            }
        });
    });
},

UserSchema.statics.generateResetToken = function(email, cb) {
    var self = this;
    this.findOne({email:email}, function(err, user) {
        if (err) {
            cb(err, null);
        } else if (user) {
            //Generate reset token and URL link; also, create expiry for reset token
            user.reset_token = require('crypto').randomBytes(32).toString('hex');
            var now = new Date();
            var expires = new Date(now.getTime() + (config.resetTokenExpiresMinutes * 60 * 1000)).getTime();
            user.reset_token_expires_millis = expires;
            user.save(function(err, usr) {
                if (err) {
                    cb(err, null);
                    console.log("Error: " + err);
                } else 
                    console.log(usr)
                    cb(false, usr);
            });
        } else {
            //TODO: This is not really robust and we should probably return an error code or something here
            cb(new Error('No user with that email found.'), null);
        }
    });
}

UserSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).select('name email date_created role').exec(cb);
};


mongoose.model('User', UserSchema);
//to export a subdocument, use the following example:
//exports.theUserSchema = UserSchema;