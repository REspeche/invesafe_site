mainApp.filter('unsafe', ['$sce', function($sce) {
  return $sce.trustAsHtml;
}]);
