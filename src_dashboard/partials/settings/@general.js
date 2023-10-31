angular.module('mainApp').controller('settingsGeneralFormController', ['$scope', 'mainSvc', '$translate', 'settingSvc', 'alertSvc',
    function ($scope, mainSvc, $translate, settingSvc, alertSvc) {
        $scope.loadForm = false;
        $scope.formData = {
          emailNoReply: '',
          emailAdmin: '',
          autoApprove: 2,
          captcha: 2,
          emailVerification: 2
        };
        $scope.editForm = false;

        $scope.loadFormGeneral = function() {

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          mainSvc.callService({
              url: 'setting/getSettingsGeneral'
          }).then(function (response) {
            $scope.formData = response[0];
            $scope.loadForm = true;
          });
        }

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmGeneral.$invalid) {
            $('#frmGeneral').removeClass('was-validated');
            //Ajax send
            mainSvc.callService({
                url: 'setting/updateSettingsGeneral',
                params: $scope.formData
            }).then(function (response) {
              $scope.editForm = false;
              settingSvc.setSettings($scope.formData);
              alertSvc.showAlertByCode(1);
            });
          }
          else {
            $('#frmGeneral').addClass('was-validated');
            $scope.invalidForm = true;
            alertSvc.showAlertByCode(103);
          }
        }

    }]);
