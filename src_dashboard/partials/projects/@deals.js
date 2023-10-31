angular.module('mainApp').controller('dealsProjectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, modalSvc, alertSvc) {

        $scope.projects = [];
        $scope.loadList = false;

        $scope.loadDealsProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getDealProjects',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.projects = angular.copy(response);
            $scope.loadList = true;
            if (!isLoad) alertSvc.showAlertByCode(105);
          });
        }

        $scope.clickPay = function(item) {

        }

        $scope.changeExecutedDeal = function(item) {
          mainSvc.callService({
              url: 'project/changeExecutedDeal',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'depId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.projects.findIndex( record => record.id == item.id );
            $scope.projects[index].active = ($scope.projects[index].active==1)?2:1;
          });
        }

    }]);
