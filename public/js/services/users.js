'use strict';

//Leads service used for leads REST endpoint
angular.module('crm.users').factory('Users', ['$resource', function($resource) {
    return $resource('api/users/:userId', {
        userId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);