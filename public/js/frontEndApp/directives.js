'use strict';

 var myDirectives = angular.module( 'myDirectives', [] );

 myDirectives.directive( 'navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: '/js/frontEndApp/navlist.html', // load the template file
    controller: function ( $scope, $location, Global ) {
        $scope.global = Global;
        /*$scope.menu = [{
            'title': 'About',
            'link': 'about'
        }, {
            'title': 'Pricing',
            'link': 'pricing'
        }, {
            'title': 'Contact',
            'link': 'contact'
        }, {
            'title': 'Demo',
            'link': 'demo'
        }];*/
        
        $scope.menu = [{
            'title': 'About',
            'link': 'about'
        }, {
            'title': 'Contact',
            'link': 'contact'
        }, {
            'title': 'Demo',
            'link': 'demo'
        }];

        /*$scope.isCollapsed = false;
        $scope.changeCollapsed = function($event){
            $event.stopPropagation();
            if($scope.isCollapsed)
                $scope.isCollapsed = false;
        }*/
        $scope.isActive = function(route) {
            return ("/"+route) === $location.path();
        }
    }
  };
});