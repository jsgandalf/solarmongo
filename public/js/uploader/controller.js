angular.module( 'crm.fileModelController', [] ).controller('uploadController', ['$scope', '$upload', function($scope, $upload){
    
	$scope.complete = function(content) {
      console.log(content); // process content
    }

  $scope.uploadComplete = function (content) {
    $scope.response = JSON.parse(content); // Presumed content is a json string!
    $scope.response.style = {
      color: $scope.response.color,
      "font-weight": "bold"
    };

    // Clear form (reason for using the 'ng-model' directive on the input elements)
    $scope.fullname = '';
    $scope.gender = '';
    $scope.color = '';
    // Look for way to clear the input[type=file] element
  };
    
}]);