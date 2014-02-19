'use strict';

//Global service for global variables
angular.module('mean.system').factory('Global', [
    function() {
        var _this = this;
        var user = {
        	name: window.name,
        	role: window.role
        };
        _this._data = {
            user: user,
            authenticated: !! window.authenticated
        };

        return _this._data;
    }
]);
