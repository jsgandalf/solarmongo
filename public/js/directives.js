'use strict';

 var myDirectives = angular.module( 'myDirectives', [] );

 myDirectives.directive( 'navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: '/views/navigation/navlist.html', // load the template file
    link: function($scope,element,attrs){
        // sidebar menu dropdown toggle
        
        /*$(element).find(".dropdown-toggle").click(function (e) {
            e.preventDefault();
            var $item = $(this).parent();
            $item.toggleClass("active");
            if ($item.hasClass("active")) {
              $item.find(".submenu").slideDown(100);
            } else {
              $item.find(".submenu").slideUp(100);
            }
        });*/
    },
    controller: function ($scope, $location, Global) {
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
      $scope.navList = [
              {"name":"Dashboard","route":"dashboard","icon":"icon-home","dropdown":false,"isCollapsed":false},
              {"name":"Leads","route":"leads1","icon":"icon-user","dropdown":true,"isCollapsed":false,
                  "list":[
                      {"name":"Leads","route":"leads","icon":"icon-user","dropdown":false},
                      {"name":"Settings","route":"leads/settings","icon":"icon-user","dropdown":false}
              ]},
              {"name":"Admin","route":"admin","icon":"icon-user","dropdown":true,"isCollapsed":false,
                  "list":[
                      {"name":"Branding","route":"admin/branding","icon":"icon-user","dropdown":false},
                      {"name":"Settings","route":"admin/settings","icon":"icon-user","dropdown":false}
              ]}];
      for(var i=0;i<$scope.navList.length;i++){
        //$scope.navList[i].route
        if(("/"+$scope.navList[i].route) === $location.path())
          $scope.navList[i].isCollapsed = true;
      }
              //{"name":"Contacts","route":"contacts","icon":"icon-user"},
              //{"name":"Tasks","route":"tasks","icon":"icon-check"},
              //{"name":"Reports","route":"reports","icon":"icon-bar-chart"}];*/
      $scope.isCollapsed = false;
      $scope.changeListCollapsed = function(list){
        list.isCollapsed = !list.isCollapsed;
        for(var i=0; i < $scope.navList.length; i++){
          if($scope.navList[i].route != list.route)
            $scope.navList[i].isCollapsed = false;
        }
      }
      $scope.changeCollapsed = function($event){
          $event.stopPropagation();
          $scope.isCollapsed = !$scope.isCollapsed;
            
      }
      $scope.isActive = function(route) {
          return ("/"+route) === $location.path();  
          
      }
      $scope.isActiveDropdown = function(route) {
          if(route==$location.path().substring(1)){
            var re = "^[^/]+(?=/)";
            var path = $location.path().substring(1);
            if(path.match(re)!=null)
              path = path.match(re);
          }
          return route === path;
      }
      $scope.showList = function(list){

      }
    }
  };
});

myDirectives.directive( 'siteSurveyDirective', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: 'views/leads/siteSurvey.html' // load the template file
  };
});