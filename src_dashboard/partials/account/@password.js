angular.module('mainApp').controller('accountController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc', 'alertSvc',
    function ($scope, mainSvc, $rootScope, actionSvc, alertSvc) {

      $scope.loadForm = false;
      $scope.formData = {
        email: '',
        pass: '',
        passN: '',
        passR: ''
      };
      $scope.editForm = false;
      $scope.invalidForm = false;

      $scope.loadProfile = function() {
        /* Load Data */
        mainSvc.callService({
            url: 'auth/getAccount'
        }).then(function (response) {
          $scope.formData = response[0];
          $scope.loadForm = true;
        });
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }

      $scope.submitForm = function() {
        $('#frmAccount').removeClass('was-validated');
        //Validations
        if ($scope.formData.pass=='' || $scope.formData.passN=='' || $scope.formData.passR=='' || $scope.formData.email=='') {
          alertSvc.showAlertByCode(103);
          return false;
        }
        if ($scope.formData.passN.length < 7) {
          alertSvc.showAlertByCode(222);
          return false;
        }
        if ($scope.formData.passN!=$scope.formData.passR) {
          alertSvc.showAlertByCode(201);
          return false;
        }
        if ($scope.formData.pass==$scope.formData.passN) {
          alertSvc.showAlertByCode(205);
          return false;
        }
        //Ajax send
        mainSvc.callService({
            url: 'auth/updateAccount',
            params: Object.assign({}, {
              'usrId': $rootScope.userInfo.id
            }, $scope.formData)
        }).then(function (response) {
          if (response.id>0) {
            $scope.formData.pass = '';
            $scope.formData.passN = '';
            $scope.formData.passR = '';
            $scope.editForm = false;
            alertSvc.showAlertByCode(2);
          }
        });
      }

    }]);
