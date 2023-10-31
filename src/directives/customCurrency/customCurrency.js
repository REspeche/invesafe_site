mainApp.filter('customCurrency', ['$filter', '$rootScope',
  function( $filter, $rootScope ){
  return function(input, fractionSize){
    if(isNaN(input)){
      return input;
    } else {
      var symbol = $rootScope.settings.currencyCode;
      var fractionSize = fractionSize === undefined ? 2 : fractionSize;
      return symbol + $filter('number')(input, fractionSize);
    }
  }
}]);
