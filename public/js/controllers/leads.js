'use strict';

angular.module('mean.leads').controller('LeadsController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Leads', function ($scope, $routeParams, $location, Global, Modal, Leads) {
    $scope.global = Global;
    $scope.submitted = false;
    $scope.create = function() {
        var lead = new Leads({
            firstName: this.firstName,
            lastName: this.lastName,
            companyName: this.companyName,
            title: this.title,
            status: this.status,
            email: this.email,
            phoneWork: this.phoneWork,
            phoneMobile: this.phoneMobile,
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
            longitude: null,
            latitude: null,
            notes: this.notes,
            jobSite: {
                firstName:'',
                lastName:'',
                address:'',
                city:'',
                state:'',
                zip:'',
                roofingType:'',
                layers:'',
                height:'',
                pitch:'',
                location:'',
                eyeAvailability:false,
                rafterSpacingAndSize:'',
                truss:false,
                otherTruss:'',
                description:''
            },
            pictures: {
                site:false,
                inverterLocation:false,
                powerMeterClosed:false,
                powerMeterOpen:false,
                shadingProblems:false,
                arrayLocation:false,
                breakerPanelsClosed:false,
                breakerPanelsOpen:false
            },
            customerExpectation:{
                partBill:'',
                fullBill:'',
                systemType:''
            },
            siteSurveyNotes: ''
        });
        lead.$save(function(response) {
            //$location.path('leads/' + response._id);
            $location.path('leads/');
        });

        this.firstName = '';
        this.lastName = '';
        this.companyName = '';
        this.title = '';
        this.status = '';
        this.email = '';
        this.phoneWork = '';
        this.phoneMobile = '';
        this.address = '';
        this.city = '';
        this.state = '';
        this.zip = '';
        this.country = '';
        this.longitude = '';
        this.latitude = '';
        this.notes = '';
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
            Modal.open("Updated","Lead Successfully Updated!");
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