'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/dashboard', {
            templateUrl: 'views/dashboard/view.html'
        }).
        when('/leads', {
            templateUrl: 'views/leads/list.html'
        }).
        when('/leads/create', {
            templateUrl: 'views/leads/create/create.html'
        }).
        when('/leads/:leadId', {
            templateUrl: 'views/leads/view/view.html'
        }).
        when('/', {
            redirectTo: '/dashboard'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);