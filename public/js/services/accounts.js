'use strict';

//Accounts service used for Accounts REST endpoint
angular.module('crm.accounts').factory('Accounts', ['$resource', function($resource) {
    return $resource('accounts/:accountId', {
        leadId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);