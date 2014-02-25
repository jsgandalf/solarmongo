angular.module( 'crm.fileModelController', [] ).controller('uploadController', ['$scope', '$fileUpload', function($scope, $fileUpload){
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/fileUpload";
        $fileUpload.uploadFileToUrl(file, uploadUrl);
    };
    
}]);