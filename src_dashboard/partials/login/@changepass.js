angular.module('mainApp').controller('changePassController', ['$scope', 'actionSvc', 'mainSvc', 'authenticationSvc', 'alertSvc',
    function ($scope, actionSvc, mainSvc, authenticationSvc, alertSvc) {
      $scope.formData = {
        email: '',
        hash: '',
        password: '',
        passwordR: ''
      };

      $scope.loadChangePass = function() {
        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          $scope.formData.email = getQueryStringValue('email','');
          $scope.formData.hash = getQueryStringValue('hash','');
        }
      }

      $scope.changePass = function() {
        //Validations
        if (!$scope.formData.password || !$scope.formData.passwordR) {
          alertSvc.showAlertByCode(101);
          return false;
        }
        if ($scope.formData.password != $scope.formData.passwordR) {
          alertSvc.showAlertByCode(201);
          return false;
        }
        mainSvc.callService({
            url: 'auth/changepass',
            params: {
               'email': $scope.formData.email,
               'hash': $scope.formData.hash,
               'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          if (response.token) {
            authenticationSvc.saveLogin({
              id      : response.id,
              email   : response.email,
              token   : response.token,
              type    : response.type,
              name    : response.name,
              forceProfile : response.forceProfile,
              role    : response.role,
              avatar  : response.avatar
            });
            if (authenticationSvc.login().isLogin) {
              alertSvc.showAlertByCode(2);
              if (response.forceProfile) actionSvc.goToExternal(6); //profile
              else actionSvc.goToExternal(1); //home
            }
          }
        });
      }

      $scope.login = function() {
        actionSvc.goToAction(2); // go to login
      }
    }]);
