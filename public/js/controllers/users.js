angular.module('crm.users').controller('UsersController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Users', function ($scope, $routeParams, $location, Global, Modal, Users) {
    $scope.global = Global;
    $scope.create = function() {
        var user = new Users({
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role
        });
        user.$save(function(response) {
            if(response.message!="success")
                Modal.open("Failed",response.message);
            else
                $location.path('settings/');
        });
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
        if(this.newpassword)
            user.password = this.newpassword;
        user.$update(function(response) {
            if(!response.message){
                location.reload(function(){
                    Modal.open("Updated","User Successfully Updated!");
                }); 
            }else{
                Modal.open("Failed",response.message);
            }
        });
    };

    $scope.find = function() {
        Users.query(function(users) {
            $scope.users = users;
        });
    };

    $scope.findOne = function() {
        Users.get({
            userId: $routeParams.userId
        }, function(user) {
            $scope.user = user;
        });
    };
}]);