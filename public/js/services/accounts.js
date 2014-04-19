'use strict';

//Accounts service used for Accounts REST endpoint
angular.module('crm.account').factory('Account', ['$resource', function($resource) {
    return {
	    assignees: $resource('api/account/getAssignees', {}, {
			get: { method: 'GET', params: {}, isArray: true }
		}),
		info: $resource('api/account', {}, {
			get: { method: 'GET', params: {}, isArray: false },
			update: {
		      method: 'PUT'
		    }
		})
	}
}]);