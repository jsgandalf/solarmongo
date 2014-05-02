'use strict';

angular.module('mean.products').controller('ProductsController', ['$scope','$http', '$routeParams', '$location', 'Global', 'Modal', 'Products', function ($scope, $http, $routeParams, $location, Global, Modal, Products) {
    $scope.global = Global;
    $scope.create = function() {
        var product = new Products({
            name: this.name,
            brand: this.brand,
            quantity: this.quantity,
            price: this.price
        });
        var self = this;
        product.$save(function(response) {
            //$location.path('products/' + response._id);
            self.name = '';
            self.brand = '';
            self.quantity = '';
            self.price = '';
            $location.path('products/');
        });
    };

    $scope.remove = function(product) {
        if (product) {
            product.$remove();

            for (var i in $scope.products) {
                if ($scope.products[i] === product) {
                    $scope.products.splice(i, 1);
                }
            }
        }
        else {
            $scope.product.$remove();
            $location.path('products/');
        }
    };

    $scope.update = function() {
        var product = $scope.product;
        if (!product.updated) {
            product.updated = [];
        }
        product.updated = new Date().getTime();
        product.$update(function() {
            Modal.open("Updated","Product Successfully Updated!");
        });
    };

    $scope.find = function() {
        Products.query(function(products) {
            $scope.products = products;
        });
    };

    $scope.findOne = function() {
        Products.get({
            productId: $routeParams.productId
        }, function(product) {
            $scope.product = product;
        });
    };


    $scope.testBug = function(){
        $http.get('/api/leads/alldata').success(function(){});
    }
    
}]);