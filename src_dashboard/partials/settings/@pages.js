angular.module('mainApp').controller('settingsPagesController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {
        $scope.pages = [];
        $scope.loadList = false;
        $scope.customHtml = undefined;

        $scope.loadPages = function() {
          /* Load Projects */
          mainSvc.callService({
              url: 'setting/getpages',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.pages = angular.copy(response);
            $scope.loadList = true;
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(16.1, {id: 0, action: 'new'}); //new page
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(16.1, {id: item.id, action: 'edit'}); //edit page
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
                url: 'setting/removepage',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'pagId': item.id
                }
            }).then(function (response) {
              let index = $scope.pages.findIndex( record => record.id == item.id );
              $scope.pages.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

        $scope.clickViewPage = function(item) {
          mainSvc.callService({
              url: 'common/viewFile?type=page&file=' + item.file + '&lang='+$rootScope.lang,
              isFileResponse: true,
              secured: false,
              method: 'get'
          }).then(function (response) {
            modalSvc.showModal({
                    templateUrl: '/templates/modals/modalViewPage.html',
                    size: 'lg'
                },
                {
                    closeButtonText: undefined,
                    customHtml: angular.copy(response),
                    defer: false
                });
          });
        }

    }]);
