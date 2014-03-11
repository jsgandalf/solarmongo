'use strict';

//Modal service for creating modals on the fly
angular.module('modal',['ui.bootstrap','crm.photos','crm.uploader','crm.fileModel']).service('Modal', function($modal, Photos, Uploader, $fileUpload) {
	var title = "Title";
	var body = "Body";
	var element = "";
	this.open = function (myTitle,myBody) {
		title = myTitle
		body = myBody
		var modalInstance = $modal.open({
		  templateUrl: 'views/modals/template.html',
		  controller: ModalInstanceCtrl,
		  windowClass: "modal fade in"
		});
	};

	var ModalInstanceCtrl = function ($scope,$modalInstance) {
		$scope.title = title;
		$scope.body = body;
		$scope.ok = function () {
			$modalInstance.close();
		};

		/*$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};*/
	};

	this.uploadPhoto = function (lead) {
		element = lead;
		var modalInstance = $modal.open({
		  templateUrl: 'views/modals/gallery.html',
		  controller: ModalInstanceCtrlPhoto,
		  windowClass: "modal fade in"
		});
	};

	function upload(url, fileData, file,$upload){
	    //var file = $files[i];
	    $upload.upload({
	      url: url,
	      data: fileData,
	      file: file,
	    }).progress(function(evt) {
	      console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	    }).success(function(data, status, headers, config) {
	      // file is uploaded successfully
	      return data;
	    });
  	}

	var csvInstanceCtrl = function ($scope,$modalInstance,$upload) {
		$scope.keys = [];
		$scope.showInput = true;

		$scope.close = function () {
			$scope.keys = [];
			$modalInstance.close();
		};
		$scope.onFileSelectCSV = function($files) {
		    //console.log($scope.leads)
		    //var deferred = $q.defer();
	      if($files[0]){
	      	$upload.upload({
		      url: '/leads/massupload',
		      data: {myObj: $scope.myModelObj},
		      file: $files[0],
		    }).progress(function(evt) {
		      console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		    }).success(function(data, status, headers, config) {
		      	// file is uploaded successfully
		      	var keys=[];
		      	for (var key in data) {
					for (var i in data[key][0] ) { 
						keys.push(i);
					}
					console.log(keys)
					if(keys)
						break;	
				}
				$scope.keys = keys;
				$scope.showInput = false;
	          	//$modalInstance.close();
		    });
	      }
		};
	};

	this.csvModal = function ($scope) {
		var modalInstance = $modal.open({
		  templateUrl: 'views/leads/csvModal.html',
		  windowClass: "modal fade in",
		  scope: $scope,
		  controller: csvInstanceCtrl
		});
	};

	var photoInstanceCtrl = function ($scope,$modalInstance,$upload) {
		$scope.close = function () {
			$modalInstance.close();
		};
		$scope.onFileSelectPhoto = function($files) {
		    //console.log($scope.leads)
		    //var deferred = $q.defer();
	      if($files[0]){
	      	$upload.upload({
		      url: 'upload/companyPhoto',
		      data: {myObj: $scope.myModelObj},
		      file: $files[0],
		    }).progress(function(evt) {
		      console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
		    }).success(function(data, status, headers, config) {
		      // file is uploaded successfully
		      console.log(data);

	          $modalInstance.close();
		    });
	      }
		};
	};

	this.photoUpload = function ($scope) {
		var modalInstance = $modal.open({
		  templateUrl: 'views/modals/upload.html',
		  windowClass: "modal fade in",
		  scope: $scope,
		  controller: photoInstanceCtrl
		});
	};


});