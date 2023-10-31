angular.module('mainApp').controller('settingsLimitsFormController', ['$scope', 'mainSvc', '$translate', 'settingSvc', 'alertSvc',
    function ($scope, mainSvc, $translate, settingSvc, alertSvc) {
        $scope.loadForm = false;
        $scope.formData = {
          projectsShow: 0,
          fileSize: 0,
          minProject: 0,
          maxProject: 0,
          minDonation: 0,
          maxDonation: 0
        };
        $scope.editForm = false;

        $scope.loadFormLimits = function() {

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          mainSvc.callService({
              url: 'setting/getSettingsLimits'
          }).then(function (response) {
            $scope.formData = response[0];
            $scope.loadForm = true;
          });
        }

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmLimits.$invalid) {
            $('#frmLimits').removeClass('was-validated');
            //Ajax send
            mainSvc.callService({
                url: 'setting/updateSettingsLimits',
                params: $scope.formData
            }).then(function (response) {
              $scope.editForm = false;
              settingSvc.setSettings($scope.formData);
              alertSvc.showAlertByCode(1);
            });
          }
          else {
            $('#frmLimits').addClass('was-validated');
            $scope.invalidForm = true;
            alertSvc.showAlertByCode(103);
          }
        }
    }]);
