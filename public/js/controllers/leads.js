'use strict';

angular.module('mean.leads').controller('LeadsController', ['$scope', '$routeParams', '$location', 'Global', 'Modal', 'Leads', 'Account', function ($scope, $routeParams, $location, Global, Modal, Leads, Account) {
    $scope.global = Global;
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
            assignee: this.assignee,
            siteSurvey: {
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
            }
        });
        var self = this;
        lead.$save(function(response) {
            //$location.path('leads/' + response._id);
            self.firstName = '';
            self.lastName = '';
            self.companyName = '';
            self.title = '';
            self.status = '';
            self.email = '';
            self.phoneWork = '';
            self.phoneMobile = '';
            self.address = '';
            self.city = '';
            self.state = '';
            self.zip = '';
            self.country = '';
            self.longitude = '';
            self.latitude = '';
            self.notes = '';
            $location.path('leads/');
        });
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
        lead.updated = new Date().getTime();
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
    
    $scope.findAssignees = function(){
        Account.assignees.get(function(assignees){
            $scope.assignees = assignees;
        });
    }
}]);