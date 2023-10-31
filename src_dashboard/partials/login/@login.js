angular.module('mainApp').controller('loginController', ['$scope', 'authenticationSvc', 'mainSvc', 'actionSvc', 'modalSvc', '$translate', 'alertSvc',
    function ($scope, authenticationSvc, mainSvc, actionSvc, modalSvc, $translate, alertSvc) {
      $scope.formData = {
        email: '',
        password: '',
        remember: false
      };
      $scope.showValidateMsg = false;

      $scope.loadLogin = function () {
        $scope.querystring = {
          urlback: getQueryStringValue('urlback'),
          email: getQueryStringValue('email'),
          endSession: getQueryStringValue('endSession'),
          endToken: getQueryStringValue('endToken')
        };

        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          //load email
          if ($scope.querystring.email != "") {
              $scope.formData.email = $scope.querystring.email;
          }

          //load popup end session
          if ($scope.querystring.endSession == '1' || $scope.querystring.endToken == '1') {
            $translate.onReady(function() {
              setHash('/login');
              modalSvc.showModal({
                size: 'lg'
              },{
                closeButtonText: $translate.instant('BTN_CLOSE'),
                actionButtonText: undefined,
                bodyText: ($scope.querystring.endSession=='1')?$translate.instant('MSG_END_SESSION'):$translate.instant('MSG_FAIL_TOKEN')
              });
            });
          }
        }
      };

      $scope.login = function() {
        //Validations
        if (!$scope.formData.email || !$scope.formData.password) {
          alertSvc.showAlertByCode(100);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          alertSvc.showAlertByCode(204);
          return false;
        }
        mainSvc.callService({
            url: 'auth/login',
            params: {
               'email': $scope.formData.email,
               'password': $scope.formData.password
            },
            secured: false
        }).then(function (response) {
          if (response.code==200) {
            $scope.formData.password = "";
          }
          else if (response.code==209) {
            $scope.showValidateMsg = true;
          }
          else {
            if (response.token) {
              authenticationSvc.saveLogin({
                id              : response.id,
                email           : response.email,
                token           : response.token,
                type            : response.type,
                name            : response.name,
                forceProfile    : response.forceProfile,
                role            : response.role,
                rememberLogin   : $scope.formData.remember,
                avatar          : response.avatar
              });
              var userInfo = authenticationSvc.login();
              if (userInfo.isLogin) {
                if (userInfo.forceProfile) actionSvc.goToExternal(6); //profile
                else actionSvc.goToExternal(1); //home
              }
            }
          }
        });
      }

      $scope.signUp = function() {
        actionSvc.goToAction(4); // go to signup
      }

      $scope.forgot = function() {
        actionSvc.goToAction(5); // go to forgot
      }

      $scope.sendMailValidate = function() {
        if (!$scope.formData.email || !$scope.formData.password) {
          alertSvc.showAlertByCode(104);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          alertSvc.showAlertByCode(204);
          return false;
        }
        mainSvc.callService({
            url: 'auth/validateagain',
            params: {
              'email': $scope.formData.email,
              'password': $scope.formData.password,
              'isSite': 0
            },
            secured: false
        }).then(function (response) {
          $scope.showValidateMsg = false;
          alertSvc.showAlertByCode(102);
        });
      }
    }]);
