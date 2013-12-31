'use strict';

angular.module( 'navigationDirective', [] ).directive( 'navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: 'views/navigation/navlist.html', // load the template file
    controller: function ( $scope, $location, Global ) {
        $scope.global = Global;
        $scope.menu = [{
            'title': 'About Us',
            'link': '../aboutus'
        }, {
            'title': 'Pricing',
            'link': 'partner'
        }, {
            'title': 'Contact',
            'link': '../contactus'
        }];
        $scope.navList = [{"name":"Dashboard","route":"dashboard","icon":"icon-home"},
                {"name":"Leads","route":"leads","icon":"icon-book"},
                {"name":"Contacts","route":"contacts","icon":"icon-user"},
                {"name":"Tasks","route":"tasks","icon":"icon-check"},
                {"name":"Reports","route":"reports","icon":"icon-bar-chart"}];
        $scope.isCollapsed = true;
        $scope.isActive = function(route) {
            return ("/"+route) === $location.path();
        }
    }
  };
});