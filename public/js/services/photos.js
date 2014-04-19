'use strict';

//Leads service used for leads REST endpoint
angular.module('crm.photos').factory('Photos', ['$resource', function($resource) {
    return {
	    company: $resource('api/upload/companyPhoto', {}, {
			getAll: { method: 'GET', params: {}, isArray: true },
			destroy: { method: 'DEL', params: {leadId: '@_id'}, isArray: true }
			//addPhoto: { method: 'POST', params: { leadId: '@leadId'}, isArray: true }
		}),
	    leads: $resource('api/photos/lead/:leadId', {}, {
			getAll: { method: 'GET', params: {}, isArray: true },
			destroy: { method: 'DEL', params: {leadId: '@_id'}, isArray: true }
			//addPhoto: { method: 'POST', params: { leadId: '@leadId'}, isArray: true }
		}),
		crud: $resource('api/photos/:photoId', {}, {
		    update: { method: 'PUT', params:{photoId: '@_id'}, isArray: true}
		})
	}
}]);