angular.module('mainApp').controller('reportedProjectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {

        $scope.projects = [];
        $scope.loadList = false;

        $scope.loadReportedProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getreportedprojects',
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

        $scope.clickRemove = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.project})
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/removeReportedProject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'prrId': item.id
                }
            }).then(function (response) {
              let index = $scope.projects.findIndex( record => record.id == item.id );
              $scope.projects.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

        $scope.clickReject = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_STOP_ACTION', { name: item.project})
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/rejectReportedProject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'prrId': item.id
                }
            }).then(function (response) {
              let index = $scope.projects.findIndex( record => record.id == item.id );
              $scope.projects.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

    }]);
