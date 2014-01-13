angular.module('mean.system').controller('sliderController',['$scope',function($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function(index) {
    var newWidth = 600 + slides.length;
    slides.push({
      path: '/views/pages/slide'+(++index)+".html"
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide(i);
  }
}]);