'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    config = require('../../config/config'),
    jwt = require('jwt-simple'),
    tokenSecret = '@CSHeM*$[*GE_Q&sAqFAIvBl6s%Pdabe5o]HFzjPR8BFa_!8D|{i2bBm.iE<W',
    Token = mongoose.model('Token'),
    Q = require('q');

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type:String, 
        unique: true
    },
    username: { type: String },
    hashed_password: String,
    provider: String,
    salt: String,
    facebook: {},
    token: {type: Object},
    //For reset we use a reset token with an expiry (which must be checked)
    reset_token: {type: String},
    reset_token_expires_millis: {type: Number}
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

UserSchema.path('email').validate(function(email) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof email === 'string' && email.length > 0);
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof username === 'string' && username.length > 0);
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.provider)
        next(new Error('Invalid password'));
    else
        next();
});

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
    }
};

/*
* Encode token
*
* @param {String} data
* @return {String}
*/
UserSchema.statics.encode = function(data) {
    return jwt.encode(data, tokenSecret);
};
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
            cb(false, {_id:usr._id, email: usr.email, token: usr.token,updated: usr.updated, created: usr.created, name: usr.name,account: usr.account, role:usr.role});
        } else {
            cb(new Error('Token does not match.'), null);
        }
    });
};

UserSchema.statics.createUser = function(user,accountId) {
    var deferred = Q.defer();
    var self = this;
    user.account = accountId;
    user.save(function(err) {
        if (err) {
            console.log(err);
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Email already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }
            deferred.reject(message);
        }
        self.getTokenByUser(user).then(function(token){
            deferred.resolve(user);
        }, function(err){
            console.log(err);
            deferred.reject(err);
        });
    });
    return deferred.promise;
}

UserSchema.statics.getToken = function(email) {
    var deferred = Q.defer();
    var self = this;
    this.findOne({email: email}, function(err, usr) {
        if(err || !usr) {
            console.log('err: '+err);
            deferred.reject(err);
        }
        //Create a token and add to user and save 
        var token = self.encode({
            _id:usr._id, 
            email: usr.email, 
            token: usr.token,
            firstName: usr.firstName,
            lastName: usr.lastName,
            account: usr.account
        });
        usr.token = new Token({token:token});
        usr.save(function(err, usr) {
            if (err)
                deferred.reject(err);
            else {
                deferred.resolve(usr.token.token); //token object has a token property.
            }
        });
    });
    return deferred.promise;
};
UserSchema.statics.getTokenByUser = function(user,cb) {
    var deferred = Q.defer();
    var token = this.encode({
        _id:user._id, 
        email: user.email, 
        token: user.token,
        firstName: user.firstName,
        lastName: user.lastName,
        account: user.account
    });
    user.token = new Token({token:token});
    user.save(function(err, usr) {
        if (err){
            console.log(err);
            deferred.reject(err);
        } else {
            deferred.resolve(user.token.token); //token object has a token property
        }
    });
    return deferred.promise;
};

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
                } else{ 
                    console.log(usr);
                    cb(false, usr);
                }
            });
        } else {
            //TODO: This is not really robust and we should probably return an error code or something here
            cb(new Error('No user with that email found.'), null);
        }
    });
};

UserSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).select('name email updated created role').exec(cb);
};

mongoose.model('User', UserSchema);