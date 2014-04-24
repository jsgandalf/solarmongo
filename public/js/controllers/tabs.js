angular.module('crm.account').controller('TabController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Account', function ($scope, $routeParams, $location, Global, Modal, Account) {
    $scope.global = Global;

    $scope.tabs = [
      { title:"tab1", href:"#/route1/page1" },
      { title:"tab2", href:"#/route1/page2" }
    ];
    
    $scope.isActiveTab = function(route){
        return route == $location.hash();
    }

    $scope.saveHistory = function(myHash){
        $scope.tab1 = false;
        $scope.tab2 = false;
        myHash["active"] = true;
        $location.hash(myHash);
    }
}]);