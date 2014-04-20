'use strict';

//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            redirectTo: '/leads'
        }).
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
        when('/products', {
            templateUrl: 'views/products/list.html'
        }).
        when('/products/create', {
            templateUrl: 'views/products/create/create.html'
        }).
        when('/products/:productId', {
            templateUrl: 'views/products/view/view.html'
        }).
        when('/settings/mysettings', {
            templateUrl: 'views/settings/mysettings.html'
        }).
        when('/settings', {
            templateUrl: 'views/settings/view.html'
        }).
        when('/settings/users/create', {
            templateUrl: 'views/settings/createUser/create.html'
        }).
        when('/settings/users/:userId', {
            templateUrl: 'views/settings/viewUser/view.html'
        }).
        when('/superadmin/', {
            templateUrl: 'views/superadmin/view.html'
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