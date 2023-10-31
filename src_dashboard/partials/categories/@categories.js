angular.module('mainApp').controller('categoriesController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {

        $scope.categories = [];
        $scope.loadList = false;

        $scope.loadCategories = function() {
          /* Load Projects */
          mainSvc.callService({
              url: 'category/getcategories',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.categories = angular.copy(response);
            $scope.loadList = true;
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(11.1, {id: 0, action: 'new'}); //new profile
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(11.1, {id: item.id, action: 'edit'}); //edit profile
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
                url: 'category/removecategory',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'catId': item.id
                }
            }).then(function (response) {
              let index = $scope.categories.findIndex( record => record.id == item.id );
              $scope.categories.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

        $scope.activeCategory = function(item) {
          mainSvc.callService({
              url: 'category/activeCategory',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'catId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.categories.findIndex( record => record.id == item.id );
            $scope.categories[index].mode = ($scope.categories[index].mode==1)?2:1;
          });
        };

    }]);
