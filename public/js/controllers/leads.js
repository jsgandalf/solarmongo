'use strict';

angular.module('mean.leads').controller('LeadsController', ['$scope', '$routeParams', '$location', 'Global', 'Leads', function ($scope, $routeParams, $location, Global, Leads) {
    $scope.global = Global;

    $scope.create = function() {
        var lead = new Leads({
            title: this.title,
            content: this.content
        });
        lead.$save(function(response) {
            $location.path('leads/' + response._id);
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function(lead) {
        if (lead) {
            lead.$remove();

            for (var i in $scope.leads) {
                if ($scope.leads[i] === lead) {
                    $scope.leads.splice(i, 1);
                }
            }
        }
        else {
            $scope.lead.$remove();
            $location.path('leads');
        }
    };

    $scope.update = function() {
        var lead = $scope.lead;
        if (!lead.updated) {
            lead.updated = [];
        }
        lead.updated.push(new Date().getTime());

        lead.$update(function() {
            $location.path('leads/' + lead._id);
        });
    };

    $scope.find = function() {
        Leads.query(function(leads) {
            $scope.leads = leads;
        });
    };

    $scope.findOne = function() {
        Leads.get({
            leadId: $routeParams.leadId
        }, function(lead) {
            $scope.lead = lead;
        });
    };
}]);