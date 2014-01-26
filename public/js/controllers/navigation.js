'use strict';

angular.module('mean.navigation').controller('navigationController', ['$scope', function ($scope, $location, Global) {
    $scope.global = Global;
    $scope.menu = [{
        'title': 'About Us',
        'link': '../aboutus'
    }, {
        'title': 'Pricing',
        'link': '../pricing'
    }, {
        'title': 'Contact Us',
        'link': '../contactus'
    }];
    /*$scope.navList = [{"name":"Dashboard","route":"dashboard","icon":"icon-home","dropdown":false,"isCollapsed":false},
            {"name":"Leads","route":"leads","icon":"icon-user","dropdown":true,"isCollapsed":false,"list":[
                {"name":"Leads","route":"leads","icon":"icon-user","dropdown":false},
                {"name":"Leads","route":"leads","icon":"icon-user","dropdown":false},
                {"name":"Leads","route":"leads","icon":"icon-user","dropdown":false},
            ]},
            {"name":"Branding","route":"branding","icon":"icon-th-large","dropdown":true,"isCollapsed":false}];
            //{"name":"Contacts","route":"contacts","icon":"icon-user"},
            //{"name":"Tasks","route":"tasks","icon":"icon-check"},
            //{"name":"Reports","route":"reports","icon":"icon-bar-chart"}];*/
    $scope.isCollapsed = false;
    $scope.route = 'dashboard'
    $scope.changeCollapsed = function($event){
        $event.stopPropagation();
    }
    $scope.isActive = function(route) {
        return ("/"+route) === $location.path();
    }
}]);