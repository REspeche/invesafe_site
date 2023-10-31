angular.module('mainApp').controller('membersController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {

        $scope.members = [];
        $scope.loadList = false;

        $scope.loadMembers = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          mainSvc.callService({
              url: 'profile/getMembers',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.members = angular.copy(response);
            $scope.loadList = true;
            if (!isLoad) alertSvc.showAlertByCode(105);
          });
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(19.1, {id: item.id, action: 'edit'}); //edit profile
        }

        $scope.clickRemove = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.name})
          }).then(function (result) {
            mainSvc.callService({
                url: 'profile/removeMember',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'memId': item.id
                }
            }).then(function (response) {
              let index = $scope.members.findIndex( record => record.id == item.id );
              $scope.members.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

    }]);
