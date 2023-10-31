angular.module('mainApp').controller('termsOfUseController', ['$scope', 'mainSvc', '$rootScope',
    function ($scope, mainSvc, $rootScope) {
      $scope.loadPage = false;
      $scope.customHtml = undefined;

      $scope.loadTermsOfUse = function() {

        $scope.$watch(function() {
          return $rootScope.lang;
        }, function() {
          /* Load page content */
          mainSvc.callService({
              url: 'common/viewFile?type=page&file=termsofuse.htm&lang='+$rootScope.lang,
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
