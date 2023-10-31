angular.module('mainApp').controller('projectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', 'modalSvc', '$translate', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, modalSvc, $translate, alertSvc) {
        $scope.projects = [];
        $scope.loadList = false;

        $scope.loadProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getprojects',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.projects = angular.copy(response);
            $scope.loadList = true;
            if (!isLoad) alertSvc.showAlertByCode(105);
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(10.1, {id: 0, action: 'new'}); //new project
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(10.1, {id: item.id, action: 'edit'}); //edit project
        }

        $scope.clickViewDetail = function(item) {
          actionSvc.goToSite(105, {id: item.id}, true); //view project
        }

        $scope.changeStatusProject = function (item) {
          mainSvc.callService({
              url: 'project/changeStatusProject',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'proId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.projects.findIndex( record => record.id == item.id );
            $scope.projects[index].status = ($scope.projects[index].status==1)?2:1;
          });
        }

        $scope.clickRemove = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.title})
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/removeproject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'proId': item.id
                }
            }).then(function (response) {
              let index = $scope.projects.findIndex( record => record.id == item.id );
              $scope.projects.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        };
    }]);
