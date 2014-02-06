'use strict';

//Setting up route
angular.module('solarmongo').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/frontEndViews/index.html'
        }).
        when('/about', {
            templateUrl: 'views/frontEndViews/about.html'
        }).
        when('/pricing', {
            templateUrl: 'views/frontEndViews/pricing.html'
        }).
        when('/contact', {
            templateUrl: 'views/frontEndViews/contact.html'
        }).
        when('/demo', {
            templateUrl: 'views/frontEndViews/demo.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('solarmongo').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);