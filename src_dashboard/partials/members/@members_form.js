angular.module('mainApp').controller('membersFormController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc', '$stateParams', 'alertSvc',
    function ($scope, mainSvc, $rootScope, actionSvc, $stateParams, alertSvc) {

      $scope.loadForm = false;
      $scope.formData = {
        memId: 0,
        name: '',
        email: '',
        role: 1
      };
      $scope.editForm = false;
      $scope.invalidForm = false;
      $scope.lstRoles = [
        {
          id: 1,
          label: 'Normal'
        },
        {
          id: 2,
          label: 'Administrator'
        }
      ];

      $scope.loadMembersForm = function() {
        $scope.paramAction = $stateParams.action;
        $scope.paramId = $stateParams.id;

        /* Load Data */
        mainSvc.callService({
            url: 'profile/getMember',
            params: {
              'usrId': $rootScope.userInfo.id,
              'memId': $scope.paramId
            }
        }).then(function (response) {
          $scope.formData = response[0];
          $scope.loadForm = true;
        });
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }

      $scope.submitForm = function() {
        if (!$scope.frmMembers.$invalid) {
          $('#frmMembers').removeClass('was-validated');
          //Validations
          if ($scope.formData.name=='') {
            alertSvc.showAlertByCode(103);
            return false;
          }
          //Ajax send
          mainSvc.callService({
              url: 'profile/updateMember',
              params: $scope.formData
          }).then(function (response) {
            $scope.editForm = false;
            alertSvc.showAlertByCode(3);
            actionSvc.goToAction(19); //members
          });
        }
        else {
          $('#frmMembers').addClass('was-validated');
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
            actionSvc.goToAction(19); //list members
          });
        }
        else {
          actionSvc.goToAction(19); //list members
        }
      }

    }]);
