angular.module('mainApp').controller('purchaseProjectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, alertSvc) {
        $scope.itemList = [];
        $scope.orders = [];
        $scope.loadList = false;

        $scope.loadPurchaseProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getpurchaseprojects',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.itemList = angular.copy(response);
            angular.forEach($scope.itemList, function(item, key){
              let index = $scope.orders.findIndex( record => record.id == item.id );
              if (index<0) {
                $scope.orders.push({
                  id: item.id,
                  datePurchase: item.datePurchase,
                  modePay: item.modePay,
                  orderTotal: item.orderTotal,
                  projects: [{
                    proId: item.proId,
                    project: item.project,
                    tokenPurchase: item.tokenPurchase,
                    assetTokenPrice: item.assetTokenPrice
                  }]
                });
              }
              else {
                $scope.orders[$scope.orders.length-1].projects.push({
                  project: item.project,
                  tokenPurchase: item.tokenPurchase,
                  assetTokenPrice: item.assetTokenPrice
                });
              }

            });
            $scope.loadList = true;
            if (!isLoad) alertSvc.showAlertByCode(105);
          });
        }

        $scope.clickViewDetail = function(item) {
          actionSvc.goToSite(104, {id: item.proId}, true); //view project
        }

        $scope.getTotal = function(){
            var total = 0;
            for(var i = 0; i < $scope.itemList.length; i++){
                var item = $scope.itemList[i];
                total += (item.tokenPurchase * item.assetTokenPrice);
            }
            return total;
        }

        $scope.goToBrowseProducts = function() {
          actionSvc.goToSite(105); //Marketplace
       }
    }]);
