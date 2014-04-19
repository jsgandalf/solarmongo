'use strict';

//Leads service used for leads REST endpoint
angular.module('crm.uploader').factory('Uploader', ['$resource', function($resource) {
    return $resource('api/uploader/:uploadMethod', {
        uploadMethod: '@uploadMethod'
    }, {
        addPhoto: {
            method: 'POST',
            params:{
            	uploadMethod: 'add'
            }
        }
    });
}]);