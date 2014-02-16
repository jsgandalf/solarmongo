'use strict';

//Accounts service used for Accounts REST endpoint
angular.module('crm.account').factory('Account', ['$resource', function($resource) {
    return {
	    assignees: $resource('account/getAssignees', {}, {
			query: { method: 'GET', params: {}, isArray: true }
		}),
		info: $resource('account', {}, {
			get: { method: 'GET', params: {}, isArray: true }
		})
	}
}]);