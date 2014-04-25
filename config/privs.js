'use strict';

var userRoles = {
  admin: 1, // 0001
  installer:   2, // 0010
  sales:   4, // 0100
  leadAgency:     8,  // 1000
  salesAgency:     16,  // 1 0000
  superadmin:     32  // 1 0000
};

var accessLevels = {
  public: userRoles.admin | // 1111
          userRoles.installer |
          userRoles.sales |
          userRoles.leadAgency |
          userRoles.salesAgency |
          userRoles.superadmin,
  user:   userRoles.admin | // 1111
          userRoles.installer |
          userRoles.sales |
          userRoles.leadAgency |
          userRoles.salesAgency |
          userRoles.superadmin,
  admin:  userRoles.admin, // 1000
  superadmin:  userRoles.superadmin, // 1000
};

exports.accessLevels = function(req, res, next) {
  console.log(accessLevels);
  res.json(accessLevels);
};

exports.getAccessLevels = function() {
  return accessLevels;
};

exports.getRoles = function() {
  return userRoles;
};