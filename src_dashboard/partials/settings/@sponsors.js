angular.module('mainApp').controller('settingsSponsorsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {
        $scope.sponsors = [];
        $scope.loadList = false;
        $scope.customHtml = undefined;

        $scope.loadSponsors = function() {
          /* Load Projects */
          mainSvc.callService({
              url: 'setting/getSponsors',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.sponsors = angular.copy(response);
            $scope.loadList = true;
          });
        }

        $scope.clickNew = function () {
            actionSvc.goToAction(26.1, {id: 0, action: 'new'}); //new page
        }

        $scope.clickEdit = function(item) {
            actionSvc.goToAction(26.1, {id: item.id, action: 'edit'}); //edit page
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
                url: 'setting/removeSponsor',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'spoId': item.id
                }
            }).then(function (response) {
              let index = $scope.sponsors.findIndex( record => record.id == item.id );
              $scope.sponsors.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        };


        $scope.activeCategory = function(item) {
            mainSvc.callService({
                url: 'setting/activeSponsor',
                params: {
                    'usrId'  : $rootScope.userInfo.id,
                    'spoId'  : item.id
                }
            }).then(function (response) {
                let index = $scope.sponsors.findIndex( record => record.id == item.id );
                $scope.sponsors[index].mode = ($scope.sponsors[index].mode==1)?2:1;
            });
        };

    }]);
