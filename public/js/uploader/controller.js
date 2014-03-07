angular.module( 'crm.fileModelController', [] ).controller('uploadController', ['$scope', '$upload','Modal', function($scope, $upload, Modal){
  $scope.clickUpload = function(){
    $("#clickUpload").click();
  }

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

   $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      //$scope.myModelObj.siteSurvey = $scope.lead.siteSurvey._id
      //console.log($scope.myModelObj)
      $scope.upload = $upload.upload({
        url: 'upload/lead/'+$scope.lead._id,
        // method: POST or PUT,
        // headers: {'headerKey': 'headerValue'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file,
        // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
        //fileFormDataName: myFile, //OR for HTML5 multiple upload only a list: ['name1', 'name2', ...]
        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
        //formDataAppender: function(formData, key, val){} //#40#issuecomment-28612000
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
        console.log($scope.photos.push(data));
        //console.log($scope.lead.siteSurvey._id)
        //var lead = $scope.lead;
        //lead.updated = new Date().getTime();
        //lead.$update(function() {
        //  alert("yo")
        //    Modal.open("Updated","Lead Successfully Updated!");
        //});
      });
      //.error(...)
      //.then(success, error, progress); 
    }
    // $scope.upload = $upload.upload({...}) alternative way of uploading, sends the the file content directly with the same content-type of the file. Could be used to upload files to CouchDB, imgur, etc... for HTML5 FileReader browsers. 
  };
    
}]);