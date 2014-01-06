'use strict';

//Modal service for creating modals on the fly
angular.module('modal',['ui.bootstrap']).service('Modal', function($modal) {
	var title = "Title";
	var body = "Body";
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
});