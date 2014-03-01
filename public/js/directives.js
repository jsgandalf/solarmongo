'use strict';

 var myDirectives = angular.module('myDirectives', [] );

 myDirectives.directive('navigationList', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: '/views/navigation/navlist.html', // load the template file
    controller: function ( $scope, $location, Global ) {
        $scope.global = Global;
        $scope.navList = [//{"name":"Dashboard","route":"dashboard","icon":"icon-home"},
                {"name":"Leads","route":"leads","icon":"icon-group"},
                {"name":"Inventory","route":"products","icon":"icon-shopping-cart"},
                {"name":"Settings","route":"settings","icon":"icon-cog"}];
                //{"name":"Tasks","route":"tasks","icon":"icon-check"},
                //{"name":"Reports","route":"reports","icon":"icon-bar-chart"}];
        for(var i in $scope.navList){
            if($scope.navList[i].route == "settings" && $scope.global.user.role != 'Admin')
                $scope.navList.splice(i, 1);
        }
        $scope.isCollapsed = false;
        $scope.changeCollapsed = function($event){
            $event.stopPropagation();
            if($scope.isCollapsed)
                $scope.isCollapsed = false;
        }
        $scope.isActive = function(route) {
            return ("/"+route) === $location.path();
        }
    }
  };
});

myDirectives.directive( 'siteSurveyDirective', function () {
  return {
    restrict: 'E', // allow as an element; the default is only an attribute
    templateUrl: 'views/leads/siteSurvey.html', // load the template file
  };
});

myDirectives
  .directive('uploadSubmit', ["$parse", function($parse) {
    // Utility function to get the closest parent element with a given tag
    function getParentNodeByTagName(element, tagName) {
      element = angular.element(element);
      var parent = element.parent();
      tagName = tagName.toLowerCase();

      if ( parent && parent[0].tagName.toLowerCase() === tagName ) {
          return parent;
      } else {
          return !parent ? null : getParentNodeByTagName(parent, tagName);
      }
    }
    return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
        element.bind('click', function($event) {
          // prevent default behavior of click
          if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
          }

          if (element.attr('disabled')) { return; }
          var form = getParentNodeByTagName(element, 'form');
          form.triggerHandler('submit');
          form[0].submit();
        });
      }
    };
  }])
  .directive('ngUpload', ["$log", "$parse", "$document",
    function ($log, $parse, $document) {
    var iframeID = 1;
    // Utility function to get meta tag with a given name attribute
    function getMetaTagWithName(name) {
      var head = $document.find('head');
      var match;

      angular.forEach(head.find('meta'), function(element) {
        if ( element.getAttribute('name') === name ) {
            match = element;
        }
      });

      return angular.element(match);
    }

    return {
      restrict: 'AC',
      link: function (scope, element, attrs) {
        // Give each directive instance a new id
        iframeID++;

        function setLoadingState(state) {
          scope.$isUploading = state;
        }

        var options = {};
        // Options (just 1 for now)
        // Each option should be prefixed with 'upload-options-' or 'uploadOptions'
        // {
        // // add the Rails CSRF hidden input to form
        // enableRailsCsrf: bool
        // }
        var fn = attrs.ngUpload ? $parse(attrs.ngUpload) : null;
        var loading = attrs.ngUploadLoading ? $parse(attrs.ngUploadLoading) : null;

        if ( attrs.hasOwnProperty( "uploadOptionsConvertHidden" ) ) {
            // Allow blank or true
            options.convertHidden = attrs.uploadOptionsConvertHidden != "false";
        }

        if ( attrs.hasOwnProperty( "uploadOptionsEnableRailsCsrf" ) ) {
            // allow for blank or true
            options.enableRailsCsrf = attrs.uploadOptionsEnableRailsCsrf != "false";
        }

        if ( attrs.hasOwnProperty( "uploadOptionsBeforeSubmit" ) ) {
            options.beforeSubmit = $parse(attrs.uploadOptionsBeforeSubmit);
        }

        element.attr({
          'target': 'upload-iframe-' + iframeID,
          'method': 'post',
          'enctype': 'multipart/form-data',
          'encoding': 'multipart/form-data'
        });

        var iframe = angular.element(
          '<iframe name="upload-iframe-' + iframeID + '" ' +
          'border="0" width="0" height="0" ' +
          'style="width:0px;height:0px;border:none;display:none">'
        );

        // If enabled, add csrf hidden input to form
        if ( options.enableRailsCsrf ) {
          var input = angular.element("<input />");
            input.attr("class", "upload-csrf-token");
            input.attr("type", "hidden");
            input.attr("name", getMetaTagWithName('csrf-param').attr('content'));
            input.val(getMetaTagWithName('csrf-token').attr('content'));

          element.append(input);
        }
        element.after(iframe);

        setLoadingState(false);
        // Start upload
        element.bind('submit', function uploadStart() {
          var formController = scope[attrs.name];
          // if form is invalid don't submit (e.g. keypress 13)
          if(formController && formController.$invalid) return false;
          // perform check before submit file
          if (options.beforeSubmit) { return options.beforeSubmit(); }

          // bind load after submit to prevent initial load triggering uploadEnd
          iframe.bind('load', uploadEnd);

          // If convertHidden option is enabled, set the value of hidden fields to the eval of the ng-model
          if (options.convertHidden) {
            angular.forEach(element.find('input'), function(el) {
              var _el = angular.element(el);
              if (_el.attr('ng-model') &&
                _el.attr('type') &&
                _el.attr('type') == 'hidden') {
                _el.attr('value', scope.$eval(_el.attr('ng-model')));
              }
            });
          }

          if (!scope.$$phase) {
            scope.$apply(function() {
              if (loading) loading(scope);
              setLoadingState(true);
            });
          } else {
            if (loading) loading(scope);
            setLoadingState(true);
          }
        });

        // Finish upload
       function uploadEnd() {
          // unbind load after uploadEnd to prevent another load triggering uploadEnd
          iframe.unbind('load');
          if (!scope.$$phase) {
            scope.$apply(function() {
              setLoadingState(false);
            });
          } else {
            setLoadingState(false);
          }
          // Get iframe body contents
          var bodyContent = (iframe[0].contentDocument ||
            iframe[0].contentWindow.document).body;
          var content;
          try {
            content = angular.fromJson(bodyContent.innerText || bodyContent.textContent);
          } catch (e) {
            // Fall back to html if json parse failed
            content = bodyContent.innerHTML;
            $log.warn('Response is not valid JSON');
          }
          // if outside a digest cycle, execute the upload response function in the active scope
          // else execute the upload response function in the current digest
          if (!scope.$$phase) {
             scope.$apply(function () {
                 fn(scope, { content: content});
             });
          } else {
            fn(scope, { content: content});
          }
        }
      }
    };
  }]);

/*
myDirectives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            console.log("here");
            
            element.bind('change', function(){
                scope.$apply(function(){
                    console.log("changed")
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
*/