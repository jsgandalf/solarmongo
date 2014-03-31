'use strict';

/**
 * Permission.js - holds each permission rights
 */
var mongoose = require('mongoose'),
    //UserSchema = require("./user").theUserSchema, var mySchema = new Schema({users:[UserSchema]})
    Schema = mongoose.Schema;

/**
 * Account Schema
 */
var PermissionSchema = new Schema({
    name: { type: String}
    
});

mongoose.model('Permission', PermissionSchema);