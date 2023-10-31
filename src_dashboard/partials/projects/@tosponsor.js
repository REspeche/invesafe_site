angular.module('mainApp').controller('tosponsorProjectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {

        $scope.projects = [];
        $scope.loadList = false;

        $scope.loadSponsorProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getsponsorprojects',
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

        $scope.toSponsorProject = function(item) {
          mainSvc.callService({
              url: 'project/toSponsorProject',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'prpId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.projects.findIndex( record => record.id == item.id );
            $scope.projects[index].sponsor = ($scope.projects[index].sponsor==1)?2:1;
          });
        }

    }]);
