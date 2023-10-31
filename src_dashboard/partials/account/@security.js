angular.module('mainApp').controller('securityController', ['$scope', 'mainSvc',
    function ($scope, mainSvc) {
      $scope.loadForm = false;
      $scope.listOptions = {};

      $scope.loadSecurity = function() {
        /* Load Data */
        mainSvc.callService({
          url: 'auth/getSecurityOptions'
        }).then(function (response) {
          $scope.listOptions = angular.copy(response);
          $scope.loadForm = true;
        });
      }

    }]);
