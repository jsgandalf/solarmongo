'use strict';

 var myDirectives = angular.module( 'myDirectives', [] );

 myDirectives.directive( 'navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: '/views/navigation/navlist.html', // load the template file
    controller: function ( $scope, $location, Global ) {
        $scope.global = Global;
        $scope.navList = [//{"name":"Dashboard","route":"dashboard","icon":"icon-home"},
                {"name":"Leads","route":"leads","icon":"icon-group"},
                {"name":"Products","route":"products","icon":"icon-shopping-cart"},
                {"name":"Settings","route":"settings","icon":"icon-cog"}];
                //{"name":"Tasks","route":"tasks","icon":"icon-check"},
                //{"name":"Reports","route":"reports","icon":"icon-bar-chart"}];
        $scope.isCollapsed = false;
        $scope.changeCollapsed = function($event){
            $event.stopPropagation();
            if($scope.isCollapsed)
                $scope.isCollapsed = false;
        }
        $scope.isActive = function(route) {
            return ("/"+route) === $location.path();
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