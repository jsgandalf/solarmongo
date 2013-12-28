'use strict';

angular.module( 'placeHolder', [] ).filter('placeholder', function(){
  return function(input){
    //console.log("input==undefined: "+input==undefined);
    console.log(input);
    if(input===undefined || input==null || input==="undefined"){
      
      return "N/A";
    } else {
      return input;
    }
  }
});