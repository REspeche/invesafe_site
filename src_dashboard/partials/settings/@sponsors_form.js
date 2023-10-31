angular.module('mainApp').controller('settingsSponsorsFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', 'alertSvc',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, alertSvc) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          name: '',
          email: '',
          website: '',
          mode: 1,
          avatar: undefined
        };
        $scope.imageNew = undefined;
        $scope.editForm = false;

        $scope.loadFormSponsors = function() {
          $scope.paramAction = $stateParams.action;
          $scope.paramId = $stateParams.id;

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          if ($scope.paramAction=="edit" && $scope.paramId) {
            mainSvc.callService({
                url: 'setting/getSponsor',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'spoId': $scope.paramId
                }
            }).then(function (response) {
              $scope.formData = response[0];
              $scope.loadForm = true;
            });
          }
          else {
            $scope.loadForm = true;
          };
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
                url: 'setting/removeSponsor',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'spoId': $scope.paramId
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
          if (!$scope.frmSponsor.$invalid) {
            $('#frmSponsor').removeClass('was-validated');
            //Ajax send
            var filesUpload = [];
            if ($scope.imageNew) filesUpload.push($scope.imageNew);
            mainSvc.callService({
                url: ($scope.paramAction=='new')?'setting/insertSponsor':'setting/updateSponsor',
                params: Object.assign({}, {
                  'usrId': $rootScope.userInfo.id,
                  'spoId': ($scope.paramAction=='new')?0:$scope.paramId
                }, $scope.formData),
                data: {
                  files: filesUpload
                }
            }).then(function (response) {
              if (response[0].code==0) {
                actionSvc.goToAction(26); //list sponsors
                alertSvc.showAlertByCode(1);
              }
              else {
                alertSvc.showAlertByCode(response[0].code);
              }
            });
          }
          else {
            $('#frmSponsor').addClass('was-validated');
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
              actionSvc.goToAction(26); //list sponsors
            });
          }
          else {
            actionSvc.goToAction(26); //list sponsors
          }
        }

    }]);
