'use strict';

angular.module('mean', [
	'ngCookies', 
	'ngResource', 
	'ngRoute', 
	'ui.bootstrap', 
	'modal', 
	'ui.route', 
	'mean.system', 
	'mean.leads',
	'mean.navigation',  
	'myDirectives',
	'placeHolder']);

angular.module('mean.system', []);
angular.module('mean.leads', []);
angular.module('mean.navigation', []);