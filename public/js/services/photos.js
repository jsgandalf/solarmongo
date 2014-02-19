'use strict';

//Leads service used for leads REST endpoint
angular.module('crm.photos').factory('Photos', ['$resource', function($resource) {
    return {
	    leads: $resource('photos/leads/:leadId', {}, {
			get: { method: 'GET', params: {}, isArray: true },
			pushPhoto: { method: 'POST', params: { leadId: '@leadId'}, isArray: true }
		}),
		info: $resource('photos/:photoId', {}, {
		    update: { method: 'PUT', params:{photoId: '@_id'}, isArray: true}
		})
	}
}]);