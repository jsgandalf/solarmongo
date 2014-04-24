'use strict';

var userRoles = {
  anonymous: 1, // 0001
  student:   2, // 0010
  teacher:   4, // 0100
  admin:     8  // 1000
};

var accessLevels = {
  public: userRoles.anonymous | // 1111
          userRoles.student |
          userRoles.teacher |
          userRoles.admin,
  user:   userRoles.student | // 1110
          userRoles.teacher |
          userRoles.admin,
  admin:  userRoles.admin // 1000
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