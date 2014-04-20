angular.module('crm.account').controller('AccountController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Account', function ($scope, $routeParams, $location, Global, Modal, Account) {
    $scope.global = Global;

    $scope.create = function() {
        var account = new Accounts({
            companyName: this.companyName,
            companyPhone: this.companyPhone,
            companyEmail: this.companyEmail,
            companyAddress: this.companyAddress,
            companyCity: this.companyCity,
            companyZip: this.companyZip,
            companyState: this.companyState,
            companyCountry: this.companyCountry,
            companyTerms: this.companyTerms,
            payingTier: this.payingTier,
            companyLogo: this.companyLogo
        });
        account.$save(function(response) {
            //$location.path('leads/' + response._id);
            $location.path('accounts/');
        });

        this.companyName = '';
        this.companyPhone = '';
        this.companyEmail = '';
        this.companyAddress = '';
        this.companyCity = '';
        this.companyZip = '';
        this.companyState = '';
        this.companyCountry = '';
        this.companyTerms = '';
        this.payingTier = '';
        this.companyLogo = '';
    };

    $scope.remove = function(account) {
        if (account) {
            account.$remove();

            for (var i in $scope.accounts) {
                if ($scope.accounts[i] === account) {
                    $scope.accounts.splice(i, 1);
                }
            }
        }
        else {
            $scope.account.$remove();
            $location.path('accounts');
        }
    };

    $scope.update = function() {
        var account = $scope.account;
        if (!account.updated) {
            account.updated = [];
            account.updated.push(new Date().getTime());
        }else{
            account.updated = new Date().getTime();
        }
        
        account.$update(function() {
            Modal.open("Updated","Account Successfully Updated!");
        });
    };

    $scope.findOne = function() {
        Account.info.get(function(account) {
            $scope.account = account;
        });
    };
}]);