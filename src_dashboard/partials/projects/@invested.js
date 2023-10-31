angular.module('mainApp').controller('investedProjectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, alertSvc) {
        $scope.projects = [];
        $scope.loadList = false;

        $scope.loadInvestedProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getinvestedprojects',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.projects = angular.copy(response);
            $scope.loadList = true;
            if (!isLoad) alertSvc.showAlertByCode(105);
          });
        }

        $scope.clickViewDetail = function(item) {
          actionSvc.goToSite(105, {id: item.proId}, true); //view project
        }

    }]);
