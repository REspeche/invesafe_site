angular.module('mainApp').controller('settingsSocialFormController', ['$scope', 'mainSvc', '$translate', 'settingSvc', 'alertSvc',
    function ($scope, mainSvc, $translate, settingSvc, alertSvc) {
        $scope.loadForm = false;
        $scope.formData = {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          youtube: ''
        };
        $scope.editForm = false;

        $scope.loadFormSocial = function() {

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          mainSvc.callService({
              url: 'setting/getSettingsSocial'
          }).then(function (response) {
            $scope.formData = response[0];
            $scope.loadForm = true;
          });
        }

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmSocial.$invalid) {
            $('#frmSocial').removeClass('was-validated');
            //Ajax send
            mainSvc.callService({
                url: 'setting/updateSettingsSocial',
                params: $scope.formData
            }).then(function (response) {
              $scope.editForm = false;
              settingSvc.setSettings($scope.formData);
              alertSvc.showAlertByCode(1);
            });
          }
          else {
            $('#frmSocial').addClass('was-validated');
            $scope.invalidForm = true;
            alertSvc.showAlertByCode(103);
          }
        }

    }]);
