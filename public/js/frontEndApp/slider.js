angular.module('slider',[]).controller('sliderController',['$scope',function($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function(index) {
    slides.push({
      path: '/views/pages/slide'+(++index)+".html"
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide(i);
  }
}]);