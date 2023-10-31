angular.module('mainApp').controller('eventsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, alertSvc) {

        $scope.lstEvents = [];
        $scope.loadList = false;

        $scope.loadEvents = function() {
          /* Load Events */
          mainSvc.callService({
              url: 'event/getEvents',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.lstEvents = angular.copy(response);
            angular.forEach($scope.lstEvents, function(item, key){
              item.dateEventStr = UnixTimeStampToDateTime(item.dateEvent);
            });
            $scope.loadList = true;
          });
        }

        $scope.clickNew = function () {
          actionSvc.goToAction(24.1, {id: 0, action: 'new'}); //new event
        }

        $scope.clickEdit = function(item) {
          actionSvc.goToAction(24.1, {id: item.id, action: 'edit'}); //edit event
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
                url: ($rootScope.userInfo.role==2)?'event/rejectEvent':'event/removeEvent',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'eveId': item.id
                }
            }).then(function (response) {
              let index = $scope.lstEvents.findIndex( record => record.id == item.id );
              $scope.lstEvents.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

        $scope.activeEvent = function(item) {
          mainSvc.callService({
              url: 'event/activeEvent',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'eveId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.lstEvents.findIndex( record => record.id == item.id );
            $scope.lstEvents[index].mode = ($scope.lstEvents[index].mode==1)?2:1;
          });
        };

        $scope.clickViewDetail = function(item) {
          if ($rootScope.userInfo.role==2) {
            actionSvc.goToAction(24.1, {id: item.id, action: 'view'}); //view event
          }
          else {
            actionSvc.goToSite(107, {slug: item.slug}, true); //view event
          }
        };

        $scope.changeStatusEvent = function (item) {
          mainSvc.callService({
              url: 'event/changeStatusEvent',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'eveId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.lstEvents.findIndex( record => record.id == item.id );
            $scope.lstEvents[index].status = ($scope.lstEvents[index].status==1)?2:1;
          });
        }

    }]);
