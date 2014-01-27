'use strict';

 var myDirectives = angular.module( 'myDirectives', [] );

 myDirectives.directive( 'navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: '/views/navigation/navlist.html', // load the template file
    controller: function ( $scope, $location, Global ) {
        $scope.global = Global;
        $scope.menu = [{
            'title': 'About',
            'link': '../aboutus'
        }, {
            'title': 'Pricing',
            'link': '../pricing'
        }, {
            'title': 'Contact',
            'link': '../contactus'
        }, {
            'title': 'Demo',
            'link': '../demo'
        }];
        $scope.navList = [{"name":"Dashboard","route":"dashboard","icon":"icon-home"},
                {"name":"Leads","route":"leads","icon":"icon-group"},
                {"name":"Settings","route":"settings","icon":"icon-cog"}];
                //{"name":"Tasks","route":"tasks","icon":"icon-check"},
                //{"name":"Reports","route":"reports","icon":"icon-bar-chart"}];
        $scope.isCollapsed = false;
        $scope.changeCollapsed = function($event){
            $event.stopPropagation();
            $scope.isCollapsed = !$scope.isCollapsed;
        }
        $scope.isActive = function(route) {
            return ("/"+route) === $location.path();
        }
        $scope.isActiveFrontEnd = function(route){
            var windowArry = window.location.href.split("/")
            return (route == "../"+windowArry[windowArry.length-1]); 
        }
    }
  };
});

myDirectives.directive( 'siteSurveyDirective', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: 'views/leads/siteSurvey.html', // load the template file
  };
});