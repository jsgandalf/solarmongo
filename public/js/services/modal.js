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

	var ModalInstanceCtrlPhoto = function ($scope,$modalInstance,$fileUpload) {
		$scope.lead = element;
		$scope.uploadFile = function(){
	        var file = $scope.myFile;
	        console.log('file is ' + JSON.stringify(file));
	        var uploadUrl = "/fileUpload";
	        $fileUpload.uploadFileToUrl(file, uploadUrl);
	    };


		$scope.addPhotoSiteSurvey = function () {
	        //console.log(Uploader.addPhoto());
	        var uploader = new Uploader({
	        	data: this.newPhoto
	        });
	        uploader.$save(function(upload){
	        	console.log(upload);
	        })
	        /*var photo = new Photos.leads({
	            data: this.newPhoto,
	            description: this.description,
	            leadId: $scope.lead._id
			});*/
			//Photos.info.leads.addPhoto
			/*photo.leads.addPhoto(function(photo){
				if(photo)
					$modalInstance.close();	
			});*/
		}
		$scope.close = function () {
			$modalInstance.close();
		};

		/*$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};*/
	};
});