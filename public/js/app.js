'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'modal', 'mean.system', 'mean.leads', 'mean.products', 'crm.account', 'myDirectives','placeHolder']);

angular.module('mean.system', []);
angular.module('mean.leads', []);
angular.module('mean.products', []);
angular.module('crm.account', []);