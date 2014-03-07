'use strict';

angular.module('mean', [
	'ngCookies',
	'ngResource',
	'ngRoute',
	'ui.bootstrap',
	'modal',
	'mean.system',
	'mean.leads',
	'mean.products',
	'crm.account', 
	'crm.users', 
	'crm.photos',
	'crm.uploader',
	'crm.fileModel',
	'myDirectives',
	'crm.fileModelController',
	'placeHolder',
	'angularFileUpload',
	'crm.photos'
	//'ngUpload'
]);

angular.module('mean.system', []);
angular.module('mean.leads', []);
angular.module('mean.products', []);
angular.module('crm.account', []);
angular.module('crm.users', []);
angular.module('crm.photos', []);
angular.module('crm.uploader', []);
angular.module('crm.fileModel', []);
angular.module('crm.fileModelController', []);