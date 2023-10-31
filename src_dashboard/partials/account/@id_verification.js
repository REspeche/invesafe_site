angular.module('mainApp').controller('idVerificationController', ['$scope',
    function ($scope) {

      $scope.loadForm = false;

      $scope.loadIdVerification = function() {
        $scope.loadForm = true;
      };

}]);
