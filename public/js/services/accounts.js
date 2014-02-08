'use strict';

//Accounts service used for Accounts REST endpoint
angular.module('crm.account').factory('Account', ['$resource', function($resource) {
    return $resource('account/getAssignees', {
        
    }, {
        getAssignees: {
            method: 'GET'
        }
    });
}]);