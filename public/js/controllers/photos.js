'use strict';

angular.module('crm.photos').controller('PhotosController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Photos', function ($scope, $routeParams, $location, Global, Modal, Photos) {
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

    $scope.remove = function(photo) {
        if (photo) {
            photo.$destroy();

            for (var i in $scope.photos) {
                if ($scope.photos[i] === photo) {
                    $scope.photos.splice(i, 1);
                }
            }
        }
        else {
            $scope.photo.$destroy();
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

    $scope.find = function(leadId) {
        Photos.leads.getAll({
            leadId: $routeParams.leadId
        }, function(photos) {
            $scope.photos = photos;
        });
    };

    $scope.findOne = function() {
        Products.get({
            productId: $routeParams.productId
        }, function(product) {
            $scope.product = product;
        });
    };
    
}]);