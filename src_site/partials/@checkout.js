angular.module('mainApp').controller('checkoutController', ['$scope', 'mainSvc', 'cartSvc', 'actionSvc', 'authenticationSvc', '$window', 'alertSvc',
    function ($scope, mainSvc, cartSvc, actionSvc, authenticationSvc, $window, alertSvc) {
        $scope.formData = {
            firstName: '',
            lastName: '',
            couId: 0,
            staId: 0,
            city: '',
            address: '',
            zip: '',
            phone: '',
            sameMailingBilling: false,
            firstNameBilling: '',
            lastNameBilling: '',
            couIdBilling: 0,
            staIdBilling: 0,
            cityBilling: '',
            addressBilling: '',
            zipBilling: '',
            phoneBilling: '',
            isGift: 0,
            notes: '',
            modePay: 1
        };
        $scope.formDataCard = {
            number: '',
            expiration: '',
            code: '',
        };
        $scope.lstCountry = [];
        $scope.lstState = [];
        $scope.lstStateBilling = [];
        $scope.lstItems = [];

        $scope.loadCheckout = function() {

          if (!authenticationSvc.getUserInfo().isLogin) {
              actionSvc.goToAction(106);
          }
          else {
            /* Load combos */
            mainSvc.callService({
                url: 'common/getListCountries',
                secured: false
            }).then(function (response) {
                $scope.lstCountry = angular.copy(response);
            });

            /* Load Data */
            mainSvc.callService({
                url: 'profile/getProfileCheckout'
            }).then(function (response) {
                $scope.formData = response[0];
                //default values
                $scope.formData.sameMailingBilling = ($scope.formData.sameMailingBilling==1)?true:false;
                $scope.formData.isGift = 0;
                $scope.formData.notes = '';
                $scope.formData.modePay = 1;
                $scope.formData.agree = 0;

                $scope.loadForm = true;
                $scope.selectCountry(false);
            });

            $scope.lstItems = angular.copy(cartSvc.getItemList());
          }

        };

        $scope.selectCountry = function (clickEvent) {
            if ($scope.formData.couId) {
              mainSvc.callService({
                  url: 'common/getListStates',
                  params: {
                    couId: $scope.formData.couId
                  }
              }).then(function (response) {
                $scope.lstState = angular.copy(response);
                $scope.lstStateBilling = angular.copy($scope.lstState);
              });
            }
        };

        $scope.isEditingFormBilling = function () {
            if (!$scope.editForm) $scope.editForm = true;
            if ($scope.formData.sameMailingBilling==1
              && ($scope.formData.firstNameBilling != $scope.formData.firstName
              || $scope.formData.lastNameBilling != $scope.formData.lastName
              || $scope.formData.couIdBilling != $scope.formData.couId
              || $scope.formData.staIdBilling != $scope.formData.staId
              || $scope.formData.cityBilling != $scope.formData.city
              || $scope.formData.addressBilling != $scope.formData.address
              || $scope.formData.zipBilling != $scope.formData.zip
              || $scope.formData.phoneBilling != $scope.formData.phone)) {
                $scope.formData.sameMailingBilling=0;
            }
        }

        $scope.clickSameAddress = function() {
            if ($scope.formData.sameMailingBilling) {
              $scope.formData.firstNameBilling = $scope.formData.firstName;
              $scope.formData.lastNameBilling = $scope.formData.lastName;
              $scope.formData.couIdBilling = $scope.formData.couId;
              $scope.formData.staIdBilling = $scope.formData.staId;
              $scope.formData.cityBilling = $scope.formData.city;
              $scope.formData.addressBilling = $scope.formData.address;
              $scope.formData.zipBilling = $scope.formData.zip;
              $scope.formData.phoneBilling = $scope.formData.phone;
              $scope.lstStateBilling = angular.copy($scope.lstState);
            }
            else {
              $scope.formData.firstNameBilling = '';
              $scope.formData.lastNameBilling = '';
              $scope.formData.couIdBilling = 0;
              $scope.formData.staIdBilling = 0;
              $scope.formData.cityBilling = '';
              $scope.formData.addressBilling = '';
              $scope.formData.zipBilling = '';
              $scope.formData.phoneBilling = '';
              $scope.lstStateBilling = [];
            };
        };

        $scope.sumTotalCart = function() {
            let totCart = 0;
            $scope.lstItems.forEach(item => {
                totCart += (item.assetTicketPrice + item.fees) * item.tokenPurchase;
            });
            return totCart;
        };

        $scope.clickPayCheckout = function() {
            if ($scope.formData.agree) {
                $scope.formData.sameBilling = ($scope.formData.sameMailingBilling)?1:0;

                switch ($scope.formData.modePay) {
                  case 1: //cryptocurrency
                    let clientID = "ce8362dcbcb0be247e77286c9c168a7e5b082f579391c0c078e046b5ec3d984a";
                    let redirectURL = "http%3A%2F%2Finvesafe.incloux.com%2Fcallback%2Fcoinbase";
                    let secureRandom = getRandomString(12);
                    let urlCoinbase = "https://www.coinbase.com/oauth/authorize?response_type=code&client_id="+clientID+"&redirect_uri="+redirectURL+"&state="+secureRandom+"&scope=wallet:accounts:read";

                    let coinbaseValues =  {
                                            'secureRandom': secureRandom,
                                            'formData': $scope.formData,
                                            'cartItems': $scope.lstItems,
                                            'cardInfo': ($scope.formData.modePay==2)?$scope.formDataCard:undefined
                                          };
                    localStorage.setItem("coinbase", JSON.stringify(coinbaseValues));

                    $window.location.href = urlCoinbase;
                    break;
                  case 2: //credit card
                    break;
                }
            }
            else alertSvc.showAlertByCode(225);
        };

    }]);
