angular.module('mainApp').controller('portfolioController', ['$scope', 'actionSvc',
    function ($scope, actionSvc) {
        $scope.portfolioItems = [];
        $scope.loadList = false;

        $scope.loadPortfolio = function() {
          $scope.refreshList(true);
        };

        $scope.refreshList = function(isLoad) {
            $scope.loadList = true;
          }

        $scope.goToMarketplace = function() {
            actionSvc.goToSite(105);
        }

}]);
