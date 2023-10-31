angular.module('mainApp').controller('coinbaseController', ['$scope', 'mainSvc', 'authenticationSvc', 'actionSvc', 'alertSvc',
    function ($scope, mainSvc, authenticationSvc, actionSvc, alertSvc) {
        $scope.isProcessing = true;
        $scope.orderFail = false;

        $scope.loadCoinbase = function() {

          if (!authenticationSvc.getUserInfo().isLogin) {
              actionSvc.goToAction(106);
          }
          else {
            if (localStorage.getItem("coinbase")) {
              let _code = getQueryStringValue('code');
              let _status = getQueryStringValue('state');
              let coinbaseValues = JSON.parse(localStorage.getItem("coinbase"));
              localStorage.removeItem("coinbase");

              if (coinbaseValues.secureRandom == _status) {
                mainSvc.callService({
                    url: 'checkout/processPay',
                    params: {
                      formData: coinbaseValues.formData,
                      cartItems: coinbaseValues.cartItems,
                      cardInfo: coinbaseValues.cardInfo,
                      secureRandom: coinbaseValues.secureRandom,
                      codeCoinbase: _code
                    }
                }).then(function (response) {
                  if (response.code==0) {
                    actionSvc.goToAction(108, {'id': response.id, 'hash': response.hash});
                  }
                  else {
                    $scope.errorInTransaction();
                  }
                });
              }
              else {
                $scope.errorInTransaction();
              }
            }
            else {
              actionSvc.goToAction(106);
            }
          }

        };

        $scope.errorInTransaction = function() {
          $scope.isProcessing = false;
          $scope.orderFail = true;
          alertSvc.showAlertByCode(315);
        };

    }]);
