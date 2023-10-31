angular.module('mainApp').controller('googleAuthenticatorController', ['$scope', 'mainSvc', '$rootScope', 'alertSvc',
    function ($scope, mainSvc, $rootScope, alertSvc) {
      $scope.loadForm = false;
      $scope.dataQR = {};
      $scope.code = '';

      $scope.loadGoogleAuthenticator = function() {
        /* Load Data */
        mainSvc.callService({
          url: 'auth/generateQRTwoFactor',
          params: {
            email: $rootScope.userInfo.email
          }
        }).then(function (response) {
          $scope.dataQR = angular.copy(response);
          $scope.loadForm = true;
        });
      };

      $scope.enableAuthenticationTwoFactor = function () {
        if ($scope.code != '') {
          mainSvc.callService({
            url: 'auth/verifyCodeTwoFactor',
            params: {
              token: $scope.code
            }
          }).then(function (response) {
            if (response.verified) {
              alertSvc.showAlertByCode(1);
              actionSvc.goToAction(29); //security
            }
            else {
              $scope.code = '';
              alertSvc.showAlertByCode(316);
            }
          });
        }
        else alertSvc.showAlertByCode(316);
      };

}]);
