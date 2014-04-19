angular.module( 'crm.fileModelController', [] ).controller('uploadController', ['$scope', '$upload', '$q','Modal', function($scope, $upload, $q, Modal){
  $scope.clickUpload = function(){
    $("#clickUpload").click();
  }

  function upload(url, fileData, file){
    var deferred = $q.defer();
    //var file = $files[i];
    $scope.upload = $upload.upload({
      url: url,
      data: fileData,
      file: file,
    }).progress(function(evt) {
      console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
    }).success(function(data, status, headers, config) {
      // file is uploaded successfully
      deferred.resolve(data);
    });
    return deferred.promise
  }

  $scope.onFileSelect = function($files) {
    if($scope.photos.length<4){
      for (var i = 0; i < $files.length; i++) {
        upload('api/upload/lead/'+$scope.lead._id,{myObj: $scope.myModelObj},$files[i]).then(function(data){
          $scope.photos.push(data);
        })
      }
    }else{
      Modal.open("Max Upload","You may only upload 4 photos!");
    }
  };

  $scope.onFileSelectBranding = function($files) {
    console.log($scope.photos.length)
    if($scope.photos.length==0){
      for (var i = 0; i < $files.length; i++) {
        upload('api/upload/companyPhoto',{myObj: $scope.myModelObj},$files[i]).then(function(data){
          $scope.photos.push(data);
        })
      }
    }else{
      Modal.open("Max Upload","You may only upload 1 photo!");
    }
  };
    
}]);