angular.module('mainApp').controller('settingsPaymentFormController', ['$scope', 'mainSvc', '$translate', 'settingSvc', 'alertSvc',
    function ($scope, mainSvc, $translate, settingSvc, alertSvc) {
        $scope.loadForm = false;
        $scope.formData = {
          currencyCode: '',
          paymentGateway: 0,
          paypalAccount: '',
          paypalSandbox: 1,
          stripeSecret: '',
          stripePublishable: ''
        };
        $scope.lstCurrencyCode = [
          {id: 'USD', label: 'USD'},
          {id: '$', label: '$'}
        ];
        $scope.lstPaymentGateway = [
          {id: 1, label: 'Paypal'},
          {id: 2, label: 'Stripe'}
        ];
        $scope.editForm = false;

        $scope.loadFormPayment = function() {

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          mainSvc.callService({
              url: 'setting/getSettingsPayment'
          }).then(function (response) {
            $scope.formData = response[0];
            $scope.loadForm = true;
          });
        }

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmPayment.$invalid) {
            $('#frmPayment').removeClass('was-validated');
            //Ajax send
            mainSvc.callService({
                url: 'setting/updateSettingsPayment',
                params: $scope.formData
            }).then(function (response) {
              $scope.editForm = false;
              settingSvc.setSettings($scope.formData);
              alertSvc.showAlertByCode(1);
            });
          }
          else {
            $('#frmPayment').addClass('was-validated');
            $scope.invalidForm = true;
            alertSvc.showAlertByCode(103);
          }
        }

    }]);
