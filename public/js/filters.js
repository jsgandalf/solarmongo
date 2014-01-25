'use strict';

angular.module( 'placeHolder', [] ).filter('commaFilter', function(){
  return function(city,state){
  	console.log(city);
  	console.log(state);
    if(input===undefined || input==null || input==="undefined"){
      return "N/A";
    } else {
      return input;
    }
  }
});