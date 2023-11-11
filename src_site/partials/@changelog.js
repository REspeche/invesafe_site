angular.module('mainApp').controller('changeLogController', ['$scope', 'BASE_URL',
    function ($scope, BASE_URL) {
      $scope.lstLogs = undefined;

      $scope.loadChangeLog = function() {
        //Site
        $.getJSON("/change_control.json", function(data) {
          $scope.lstLogs = angular.copy(data);
        });
      };

    }]);
