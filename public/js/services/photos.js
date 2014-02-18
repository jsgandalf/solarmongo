'use strict';

//Leads service used for leads REST endpoint
angular.module('crm.photos').factory('Photos', ['$resource', function($resource) {
    return $resource('photos/:photoId', {
        photoId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);