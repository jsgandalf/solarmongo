angular.module( 'crm.fileModel', [] ).directive('fileModel', ['$parse', function ($parse) {
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