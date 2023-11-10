angular.module('mainApp').controller('orderReceivedController', ['$scope', '$stateParams', 'mainSvc', 'actionSvc', 'BASE_URL', 'cartSvc',
    function ($scope, $stateParams, mainSvc, actionSvc, BASE_URL, cartSvc) {
        $scope.lstItems = [];
        $scope.qsData = {
            ordId: 0,
            hash: ''
        };
        $scope.orderData = {};
        $scope.pathProject = BASE_URL.api + '/v1/common/viewFile?type=project&file=';

        $scope.loadOrderReceived = function() {
            $scope.qsData.ordId = $stateParams.id;
            $scope.qsData.hash = $stateParams.hash;

            mainSvc.callService({
                url: 'checkout/getOrder',
                params: $scope.qsData
            }).then(function (response) {
                if (response.ordId>0) {
                    $scope.orderData = angular.copy(response);
                    $scope.orderData.createdAtStr = UnixTimeStampToDateTime($scope.orderData.createdAt);

                    mainSvc.callService({
                        url: 'checkout/getOrderItems',
                        params: $scope.qsData
                    }).then(function (response) {
                        $scope.lstItems = angular.copy(response);
                    });

                    cartSvc.emptyCart();
                }
            });
        };

        $scope.goToKycVerification = function() {
            actionSvc.goToDashboard(27);
        };

        $scope.sumTotalCart = function() {
            let totCart = 0;
            $scope.lstItems.forEach(item => {
                totCart += (item.assetTicketPrice + item.fees) * item.tokenPurchase;
            });
            return totCart;
        };
    }]);
