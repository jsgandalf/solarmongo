'use strict';

 var myDirectives = angular.module( 'myDirectives', [] );

 myDirectives.directive( 'navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: '/views/navigation/navlist.html', // load the template file
    controller: function ( $scope, $location, Global ) {
        $scope.global = Global;
        $scope.menu = [{
            'title': 'About Us',
            'link': '../aboutus'
        }, {
            'title': 'Pricing',
            'link': 'partner'
        }, {
            'title': 'Contact Us',
            'link': '../contactus'
        }];
        $scope.navList = [{"name":"Dashboard","route":"dashboard","icon":"icon-home"},
                {"name":"Leads","route":"leads","icon":"icon-book"},
                {"name":"Contacts","route":"contacts","icon":"icon-user"},
                {"name":"Tasks","route":"tasks","icon":"icon-check"},
                {"name":"Reports","route":"reports","icon":"icon-bar-chart"}];
        $scope.isCollapsed = false;
        $scope.isActive = function(route) {
            return ("/"+route) === $location.path();
        }
    },
    link: function (scope, element, attrs) {
        
    }
  };
});

myDirectives.directive( 'siteSurveyDirective', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: 'views/leads/siteSurvey.html', // load the template file
  };
});