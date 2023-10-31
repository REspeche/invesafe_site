angular.module('mainApp').controller('signUpController', ['$scope', 'actionSvc', 'mainSvc', 'authenticationSvc', 'BASE_URL', '$translate', 'alertSvc',
    function ($scope, actionSvc, mainSvc, authenticationSvc, BASE_URL, $translate, alertSvc) {
      $scope.formData = {
        type: 1,
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        passwordR: '',
        agree: false,
        usaCitizen: 1
      };
      $scope.isDriver = false;
      $scope.blockEmail = false;
      $scope.loadForm = false;
      $scope.countryCode = '';

      $scope.loadSignUp = function() {

        if (authenticationSvc.verifyLogin()) {
          if (authenticationSvc.login().isLogin) {
            actionSvc.goToExternal(1); //go to home
          }
        }
        else {
          $scope.formData.type = getQueryStringValue('type',1);

          // Material Select Initialization
          $(document).ready(function() {
            $('.mdb-select').materialSelect();
          });

          if  (getQueryStringValue('email',undefined)!=undefined) {
            $scope.blockEmail = true;
            $scope.formData.email = getQueryStringValue('email','');
          }
          $scope.loadForm = true;
        }

        $.get("https://extreme-ip-lookup.com/json/", function(response) {
          $scope.countryCode = angular.copy(response.countryCode);
        }, "jsonp");
      }

      $scope.signUp = function() {
        //Validations
        if (!$scope.formData.firstName || !$scope.formData.lastName || !$scope.formData.email || !$scope.formData.password || !$scope.formData.passwordR) {
          alertSvc.showAlertByCode(101);
          return false;
        }
        if ($scope.formData.password.length < 7) {
          alertSvc.showAlertByCode(222);
          return false;
        }
        else if ($scope.formData.password != $scope.formData.passwordR) {
          alertSvc.showAlertByCode(201);
          return false;
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.formData.email)) {
          alertSvc.showAlertByCode(204);
          return false;
        }
        if ($scope.formData.type==1) {
          if (!$scope.formData.usaCitizen) {
						alertSvc.showAlertByCode(221);
						return false;
          }
          else if ($scope.formData.usaCitizen==3) {
            alertSvc.showAlertByCode(223);
            return false;
          };
        }
        if ($scope.formData.type==2 && !$scope.formData.agree) {
          alertSvc.showAlertByCode(203);
          return false;
        }
        //Ajax send
        mainSvc.callService({
            url: 'auth/signup',
            params: {
              'type': $scope.formData.type,
              'firstName': $scope.formData.firstName,
              'lastName': $scope.formData.lastName,
              'email': $scope.formData.email,
              'phone': $scope.formData.phone,
              'countryCode': $scope.countryCode,
              'password': $scope.formData.password,
              'usaCitizen': $scope.formData.usaCitizen
            },
            secured: false
        }).then(function (response) {
          if (response.code==0) {
            alertSvc.showAlertByCode(102);
            actionSvc.goToAction(2); //login
          }
          else {
            alertSvc.showAlertByCode(response.code);
          }
        });
      }

      $scope.login = function() {
        actionSvc.goToAction(2); // go to login
      }

    }]);
