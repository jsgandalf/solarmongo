/* User web app code -------------------------*/

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    validator = require('validator'),
    _ = require('lodash');

/**
 * Find user by id and load it in the req
 */
exports.webUser = function(req, res, next, id) {
    User.load(id, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load user ' + id));
        req.webUser = user;
        next();
    });
};

/**
 * Create a User in the web app
 */

exports.add = function(req, res) {
    var user = new User(req.body);
    user.account = req.user.account; 
    var message = "";
    if(user.name == "")
        message = "Name is required";
    if(user.email == "")
        message = "Email is required";
    if(!validator.isEmail(user.email))
        message = "Not a valid email";
    if(user.password == "")
        message = "Password is required";
    if(message!="")
        res.jsonp({
            message: message
        });
    else{
        user.save(function(err) {
            if (err) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        message = 'Email already exists';
                        break;
                    default:
                        message = 'Opps, something went wrong! Contact support';
                }
                res.jsonp({
                    message: message
                });
            }else{
                User.createUserToken(user.email,function(err){
                    if(err)
                        res.jsonp({
                            message: "Opps, there was an error that occured while trying to save a user, please contact technical support."
                        });
                    else
                        Account.incrementUserCount(req.user.account,function(err){
                            if(err)
                                res.jsonp({
                                    message: "Opps, there was an error that occured while trying to save a user, please contact technical support."
                                });
                            else{
                                res.jsonp({
                                    message: "success"
                                });
                            }
                        });
                });
            };
        });
    }
};

/*
* Show a user
*/
exports.show = function(req, res) {
    res.jsonp(req.webUser);
}


/**
 * Update a user
 */
exports.update = function(req, res) {
    var user = req.webUser;
    user = _.extend(user, req.body);
    var message = "";
    if(user.name == "")
        message = "Name is required";
    if(user.email == "")
        message = "Email is required";
    if(!validator.isEmail(user.email))
        message = "Not a valid email";
    if(message!="")
        res.jsonp({
            message: message
        });
    else{
        user.save(function(err) {
            if (err) {
                switch (err.code) {
                    case 11000:
                    case 11001:
                        message = 'Email already exists';
                        break;
                    default:
                        message = 'Opps, something went wrong! Contact support';
                }
                res.jsonp({
                    message: message
                })
            }else {
                res.jsonp({"_id":user._id,"name":user.name,"email":user.email,"role":user.role,"date_created":user.date_created});
            }
        });
    }
};

/**
 * Remove a user
 */
exports.destroy = function(req, res) {
    var user = req.webUser;
    user.remove(function(err) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(user);
        }
    });
};

/**
 * List of leads by account id
 */
exports.all = function(req, res) {
    User.find({account : req.user.account.toString()}).sort('-created').select("name email role date_created").exec(function(err, users) {
        if (err) {
            res.jsonp({"errors": err.errors});
        } else {
            res.jsonp(users);
        }
    });
};