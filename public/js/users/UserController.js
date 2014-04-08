angular.module('app.user',['autofill-directive']).controller('UserController', ['$scope','Security', function ($scope,Security) {
  $scope.signup = function () {
    Security.signup($scope.user);
  };

  $scope.login = function () {
    Security.login($scope.user);
  };
  
}]); 