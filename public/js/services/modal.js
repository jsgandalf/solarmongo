'use strict';

//Modal service for creating modals on the fly
angular.module('modal',['ui.bootstrap','crm.photos']).service('Modal', function($modal,Photos) {
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

	var ModalInstanceCtrlPhoto = function ($scope,$modalInstance) {
		$scope.lead = element;
		$scope.addPhotoSiteSurvey = function () {
			
	        var photo = new Photos({
	            photo: newPhoto,
	            description: this.description,
	            leadId: $scope.lead._id
			});
			photo.leads.pushPhoto(function(photo){
				if(photo)
					$modalInstance.close();	
			});
		}
		$scope.close = function () {
			$modalInstance.close();
		};

		/*$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};*/
	};
});