'use strict';

//Modal service for creating modals on the fly
angular.module('modal',['ui.bootstrap','crm.photos','crm.uploader','crm.fileModel','mean.leads']).service('Modal', function($modal, Photos, Uploader, $fileUpload, $http, Leads) {
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
		$scope.step2 = false;
		$scope.step3 = true;
		$scope.close = function () {
			$scope.keys = [];
			$modalInstance.close();
			$scope.showInput = true;
			$scope.step2 = false;
		};
		$scope.save = function(){
			$scope.step3 = false;
			//console.log($scope.rawLeadData)
			//console.log($scope.rawLeadData['csvRows'])
			for (var index in $scope.rawLeadData['csvRows']) {
				var lead = new Leads();
				for (var index2 in $scope.keys) {
					console.log($scope.keys[index2])
					var key = $scope.keys[index2];
        			lead[key.match] = $scope.rawLeadData['csvRows'][index][key.name]
        		}
        		lead.$save(function(response) {
        		});
        	}
		}

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
						keys.push({
							name:i,
							match: 'noimport'
						});
					}
					if(keys)
						break;	
				}
				$scope.rawLeadData = data;
				$scope.keys = keys;
				$scope.showInput = false;
				$scope.step2 = true;
				$scope.step3 = false;
				$http({method: 'GET', url: '/leads/getLeadSchema'}).
					success(function(data, status, headers, config) {
						$scope.leadvalues = data;
					}).
					error(function(data, status, headers, config) {
						$modalInstance.close();
						alert("an error occured, were sorry! Please let technical support know.");
					});
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