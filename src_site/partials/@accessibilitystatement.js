angular.module('mainApp').controller('accessibilityStatementController', ['$scope', 'mainSvc', '$rootScope',
    function ($scope, mainSvc, $rootScope) {
      $scope.loadPage = false;
      $scope.customHtml = undefined;

      $scope.loadAccessibilityStatement = function() {

        $scope.$watch(function() {
          return $rootScope.lang;
        }, function() {
          /* Load page content */
          mainSvc.callService({
              url: 'common/viewFile?type=page&file=accessibilitystatement.htm&lang='+$rootScope.lang,
              isFileResponse: true,
              secured: false,
              method: 'get'
          }).then(function (response) {
            $scope.customHtml = response;
            $scope.loadPage = true;
          });
        }, true);

      };

    }]);
