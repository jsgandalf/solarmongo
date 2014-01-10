'use strict';

var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    BasicStrategy = require('passport-http').BasicStrategy,
    BearerStrategy = require('passport-http-bearer').Strategy,
    User = mongoose.model('User'),
    config = require('./config');


module.exports = function(passport) {
    //Serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashed_password', function(err, user) {
            done(err, user);
        });
    });

    //Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));    

    //Use google strategy
    /* If you get the following error: 
    MongoError: E11000 duplicate key error index: mean-dev.users.$username_1  dup key: { : null }
    you need to drop the old key of "username_1"
    type in mongo shell: db.users.dropIndex('username_1')
    */
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        provider: 'google',
                        google: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

    //Protect endpoints in api using the BASIC strategry, requires passport-http
    passport.use(new BasicStrategy(
      function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                }
                return done(null, user);
            });
        }
    ));
    // Use the BearerStrategy within Passport.
    // Strategies in Passport require a `validate` function, which accept
    // credentials (in this case, a token), and invoke a callback with a user
    // object.
    passport.use(new BearerStrategy({
      },
      function(incomingToken, done) {
        // asynchronous validation, for effect...
        process.nextTick(function () {
          
          // Find the user by token. If there is no user with the given token, set
          // the user to `false` to indicate failure. Otherwise, return the
          // authenticated `user`. Note that in a production-ready application, one
          // would want to validate the token for authenticity.
            var decoded;
            try{
                decoded = User.decode(incomingToken);
            }catch(err){
                console.log("This is a stack trace error: "+err);
                return done(err);
            }
            //Now do a lookup on that email in mongodb ... if exists it's a real user
            if (decoded && decoded.email) {
                User.findUser(decoded.email, incomingToken, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    return done(null, user);
                });
            } else {
                return done(null, false);
            }

        });
      }
    ));
};