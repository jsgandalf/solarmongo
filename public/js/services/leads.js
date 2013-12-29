'use strict';

//Leads service used for leads REST endpoint
angular.module('mean.leads').factory('Leads', ['$resource', function($resource) {
    return $resource('leads/:leadId', {
        leadId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);