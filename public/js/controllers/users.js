angular.module('crm.users').controller('UsersController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Users', function ($scope, $routeParams, $location, Global, Modal, Users) {
    $scope.global = Global;
    $scope.create = function() {
        var user = new User({
            email: this.email,
        });
        user.$save(function(response) {
            //$location.path('leads/' + response._id);
            $location.path('settings/');
        });

        this.name = '';
    };

    $scope.remove = function(user) {
        if (user) {
            user.$remove();

            for (var i in $scope.users) {
                if ($scope.users[i] === user) {
                    $scope.users.splice(i, 1);
                }
            }
        }
        else {
            $scope.user.$remove();
            $location.path('settings');
        }
    };

    $scope.update = function() {
        var user = $scope.user;
        if (!user.updated) {
            user.updated = [];
        }
        user.updated.push(new Date().getTime());

        user.$update(function() {
            Modal.open("Updated","User Successfully Updated!");
        });
    };

    $scope.find = function() {
        Users.query(function(users) {
            $scope.users = users;
        });
    };

    $scope.findOne = function() {
        Users.get(function(user) {
            $scope.user = user;
        });
    };
}]);