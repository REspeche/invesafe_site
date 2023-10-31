angular.module('mainApp').controller('cartController', ['$scope', 'cartSvc', 'BASE_URL', 'modalSvc', '$translate', 'actionSvc', 'authenticationSvc', 'mainSvc', 'alertSvc',
    function ($scope, cartSvc, BASE_URL, modalSvc, $translate, actionSvc, authenticationSvc, mainSvc, alertSvc) {
        $scope.lstItems = [];
        $scope.pathProject = BASE_URL.api + '/v1/common/viewFile?type=project&file=';

        $scope.loadCart = function() {
            $scope.lstItems = angular.copy(cartSvc.getItemList());
        };

        $scope.clickRemove = function(item) {
            modalSvc.showModal({
              size: 'sm'
            },{
              closeButtonText: $translate.instant('BTN_NO'),
              actionButtonText: $translate.instant('BTN_YES'),
              bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.title})
            }).then(function (result) {
                cartSvc.removeItemCart(item.id);
                $scope.loadCart();
                alertSvc.showAlertByCode(4);
            });
        };

        $scope.quantityChange = function(idx) {
            let item = $scope.lstItems[idx];
            if (!item.tokenPurchase) item.tokenPurchase=1;
            cartSvc.updateQuantity(item);
        };

        $scope.sumTotalCart = function() {
            let totCart = 0;
            $scope.lstItems.forEach(item => {
                totCart += (item.assetTokenPrice + item.fees) * item.tokenPurchase;
            });
            return totCart;
        }

        $scope.goToCheckout = function() {
            if (authenticationSvc.getUserInfo().isLogin) {
                actionSvc.goToAction(107);
            }
            else alertSvc.showAlertByCode(214);
        }

    }]);
