angular.module('mainApp').controller('contactController', ['$scope', '$rootScope', 'alertSvc', 'mainSvc', '$translate',
    function ($scope, $rootScope, alertSvc, mainSvc, $translate) {
      $scope.formContactForm = {
          name: '',
          email: '',
          subject: '',
          comment: ''
      };

      $scope.loadContact = function() {
        loadJS('https://www.google.com/recaptcha/api.js?render=' + $rootScope.recaptchaSecretClient);
      };

      $scope.toContactForm = function () {
          if ($scope.formContactForm.name != '' && $scope.formContactForm.email != '' && $scope.formContactForm.subject != '') {
              alertSvc.showAlert().notifyInfo($translate.instant('MSG_BUSSY'));
              $scope.isBusy = true;
              grecaptcha.execute($rootScope.recaptchaSecretClient, { action: 'contactPage' })
                  .then(function (token) {
  										// Verify the token on the server.
  										mainSvc.callService({
  											url: 'mail/VerifyCaptcha',
  											params: {
  													token: token
  											},
  											secured: false
  										}).then(function (response) {
  											if (response.code === 0 && response.success) {
  													mainSvc.callService({
  														url: 'mail/contactUs',
  														params: $scope.formContactForm,
  														secured: false
  													}).then(function (response) {
  														if (response.code === 0) {
  																$scope.formContactForm = {
  																		name: '',
  																		email: '',
  																		subject: '',
  																		comment: ''
  																};
  																alertSvc.showAlert().notifySuccess($translate.instant('MSG_SUCCESS_CONTACT'));
  														}
  														else alertSvc.showAlert().notifyError($translate.instant('MSG_ERROR_PROCESS'));
  													});
  											}
  											else {
  													alertSvc.showAlert().notifyError($translate.instant('MSG_ERROR_CAPTCHA'));
  											}
  										});
                  });
              return false;
          }
          else alertSvc.showAlert().notifyWarning($translate.instant('MSG_REQUEST_FIELD'));
      };

    }]);
