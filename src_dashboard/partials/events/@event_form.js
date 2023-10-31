angular.module('mainApp').controller('eventFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', 'alertSvc',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, alertSvc) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          title: '',
          active: 1,
          dateEvent: 0,
          couId: 0,
          staId: 0,
          city: '',
          tmzId: 0,
          description: '',
          webSite: '',
          email: '',
          image: undefined
        };
        $scope.imageNew = undefined;
        $scope.editForm = false;
        $scope.lstCountry = [];
        $scope.lstState = [];
        $scope.lstTimeZones = [];

        $scope.loadFormEvent = function() {
            $scope.paramAction = $stateParams.action;
            $scope.paramId = $stateParams.id;

            $translate.onReady(function() {
                $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
            });

            /* Load combos */
            mainSvc.callService({
                url: 'common/getListCountries',
                secured: false
            }).then(function (response) {
                $scope.lstCountry = angular.copy(response);
                mainSvc.callService({
                    url: 'common/getListTimeZones',
                    params: {
                        couId:  $scope.formData.couId
                    }
                }).then(function (response) {
                    $scope.lstTimeZones = angular.copy(response);
                });
            });


            /* Load Data */
            if ($scope.paramAction!="new" && $scope.paramId) {
                mainSvc.callService({
                    url: 'event/getEvent',
                    params: {
                    'usrId': $rootScope.userInfo.id,
                    'eveId': $scope.paramId
                    }
                }).then(function (response) {
                    $scope.formData = response;
                    $scope.selectCountry(false);
                    $scope.loadForm = true;
                });
            }
            else {
                $scope.loadForm = true;
            };
        }

        $scope.selectCountry = function (clickEvent) {
          if ($scope.formData.couId) {
            mainSvc.callService({
                url: 'common/getListStates',
                params: {
                  couId: $scope.formData.couId
                }
            }).then(function (response) {
              $scope.lstState = angular.copy(response);
              mainSvc.callService({
                  url: 'common/getListTimeZones',
                  params: {
                    couId:  $scope.formData.couId
                  }
              }).then(function (response) {
                $scope.lstTimeZones = angular.copy(response);
                if (clickEvent) $scope.isEditingForm();
              });
            });
          }
          }

        $scope.clickRemove = function() {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: $scope.formData.name})
          }).then(function (result) {
            mainSvc.callService({
                url: ($rootScope.userInfo.role==2)?'event/rejectEvent':'event/removeEvent',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'eveId': $scope.paramId
                }
            }).then(function (response) {
              actionSvc.goToAction(11); //list projects
              alertSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmEvent.$invalid) {
            $('#frmEvent').removeClass('was-validated');
            //Validations
            if ($scope.formData.title=='' ||
                $scope.formData.email=='' ||
                $scope.formData.couId==0 ||
                $scope.formData.city=='' ||
                $scope.formData.tmzId==0 ||
                $scope.formData.dateEvent==0) {
                alertSvc.showAlertByCode(103);
                return false;
            }
            //Ajax send
            var filesUpload = [];
            if ($scope.imageNew) filesUpload.push($scope.imageNew);
            if ($scope.formData.dateEvent==undefined) $scope.formData.dateEvent=0;
            mainSvc.callService({
                url: ($scope.paramAction=='new')?'event/insertEvent':'event/updateEvent',
                params: Object.assign({}, {
                  'usrId': $rootScope.userInfo.id,
                  'eveId': ($scope.paramAction=='new')?0:$scope.paramId
                }, $scope.formData),
                data: {
                  files: filesUpload
                }
            }).then(function (response) {
              if (response.code==0) {
                actionSvc.goToAction(24); //list event
                alertSvc.showAlertByCode(1);
              }
              else {
                alertSvc.showAlertByCode(response.code);
              }
            });
          }
          else {
            $('#frmEvent').addClass('was-validated');
            $scope.invalidForm = true;
            alertSvc.showAlertByCode(103);
          }
        }

        $scope.clickCancelForm = function() {
          if ($scope.editForm) {
            modalSvc.showModal({
              size: 'sm'
            },{
              closeButtonText: $translate.instant('BTN_NO'),
              actionButtonText: $translate.instant('BTN_YES'),
              bodyText: $translate.instant('MSG_CANCEL_ACTION')
            }).then(function (result) {
              actionSvc.goToAction(24); //list events
            });
          }
          else {
            actionSvc.goToAction(24); //list projeventsects
          }
        }

    }]);
