angular.module('mainApp').controller('profileController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc', 'BASE_URL', 'authenticationSvc', '$translate', 'alertSvc',
    function ($scope, mainSvc, $rootScope, actionSvc, BASE_URL, authenticationSvc, $translate, alertSvc) {
      $scope.loadForm = false;
      $scope.formData = {
        type: 0,
        typeInvestor: 1,
        typeEntrepreneur: 1,
        firstName: '',
        lastName: '',
        name: '',
        company: '',
        email: '',
        couId: 0,
        staId: 0,
        city: '',
        address: '',
        zip: '',
        tmzId: '',
        phone: '',
        webSite: '',
        linkedinProfile: '',
        instagramProfile: '',
        facebookProfile: '',
        twitterProfile: '',
        youtubeProfile: '',
        position: '',
        avatar: undefined,
        sameMailingBilling: false,
        firstNameBilling: '',
        lastNameBilling: '',
        couIdBilling: 0,
        staIdBilling: 0,
        cityBilling: '',
        addressBilling: '',
        zipBilling: '',
        phoneBilling: ''
      };
      $scope.avatarNew = undefined;
      $scope.lstCountry = [];
      $scope.lstState = [];
      $scope.lstStateBilling = [];
      $scope.lstTimeZones = [];
      $scope.editForm = false;
      $scope.invalidForm = false;
      $scope.lstCompanies = [];
      $scope.typeDetail = 1;
      $scope.lstTypeDetail = [];

      $scope.loadProfile = function() {

        $translate.onReady(function() {
          $scope.lblTypeDetail = [
            $translate.instant('LBL_TYPE_INVESTOR'),
            $translate.instant('LBL_TYPE_ENTREPRENEUR')
          ];
        });

        /* Load combos */
        mainSvc.callService({
            url: 'common/getListCountries',
            secured: false
        }).then(function (response) {
          $scope.lstCountry = angular.copy(response);
        });

        /* Load Data */
        mainSvc.callService({
            url: 'profile/getProfile'
        }).then(function (response) {
          $scope.formData = response[0];
          $scope.formData.fullName = $scope.formData.firstName + ' ' + $scope.formData.lastName;
          $scope.formData.sameMailingBilling = ($scope.formData.sameMailingBilling==1)?true:false;
          $scope.loadForm = true;
          switch ($scope.formData.type) {
            case 1:
              $scope.typeDetail = $scope.formData.typeInvestor;
              break;
            case 2:
              $scope.typeDetail = $scope.formData.typeEntrepreneur;
              break;
          }
          $scope.loadTypeDetail();
          if ($scope.lstCompanies.length==0) {
            mainSvc.callService({
                url: 'common/getListCompanies',
                secured: false
            }).then(function (response) {
              renderAutoCompleteCompany('.mdb-autocomplete', response, BASE_URL.api);
              $scope.lstCompanies = angular.copy(response);
            });
          };
          $scope.selectCountry(false);
        });
      }

      $scope.loadTypeDetail = function() {
        if ($scope.formData.type==1) {
          $scope.lstTypeDetail = [
            {id: 1, label: $translate.instant('LBL_SELECT_MORE')},
            {id: 2, label: $translate.instant('VAL_PERSON')},
            {id: 3, label: $translate.instant('VAL_COMPANY')}
          ];
        }
        else if ($scope.formData.type==2) {
          $scope.lstTypeDetail = [
            {id: 1, label: $translate.instant('LBL_SELECT_MORE')},
            {id: 2, label: $translate.instant('VAL_DEVELOPER')}
          ];
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
            $scope.lstStateBilling = angular.copy($scope.lstState);
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

      $scope.selectCountryBilling = function (clickEvent) {
        if ($scope.formData.couId) {
          mainSvc.callService({
              url: 'common/getListStates',
              params: {
                couId: $scope.formData.couIdBilling
              }
          }).then(function (response) {
            $scope.lstStateBilling = angular.copy(response);
            if (clickEvent) $scope.isEditingFormBilling();
          });
        }
      }

      $scope.isEditingForm = function () {
          if (!$scope.editForm) $scope.editForm = true;
      }
      $scope.isEditingFormBilling = function () {
        if (!$scope.editForm) $scope.editForm = true;
        if ($scope.formData.sameMailingBilling==1
          && ($scope.formData.firstNameBilling != $scope.formData.firstName
          || $scope.formData.lastNameBilling != $scope.formData.lastName
          || $scope.formData.couIdBilling != $scope.formData.couId
          || $scope.formData.staIdBilling != $scope.formData.staId
          || $scope.formData.cityBilling != $scope.formData.city
          || $scope.formData.addressBilling != $scope.formData.address
          || $scope.formData.zipBilling != $scope.formData.zip
          || $scope.formData.phoneBilling != $scope.formData.phone)) {
            $scope.formData.sameMailingBilling=0;
        }
      }

      $scope.selectStates = function() {
          $scope.editForm = true;
          $scope.formData.city = '';
      }

      $scope.showCompany = function() {
        return  ($scope.formData.type==1 && $scope.typeDetail==3) ||
                ($scope.formData.type==2 && $scope.typeDetail==2);
      }

      $scope.submitForm = function() {
        if (!$scope.frmProfile.$invalid) {
          $('#frmProfile').removeClass('was-validated');
          //Validations
          if ($scope.formData.name=='' ||
              $scope.formData.firstName=='' ||
              $scope.formData.lastName=='' ||
              $scope.formData.couId==0 ||
              ($scope.formData.company=='' && $scope.showCompany()) ||
              $scope.formData.staId==0 ||
              $scope.formData.city=='' ||
              $scope.formData.address=='' ||
              $scope.formData.zip=='' ||
              $scope.formData.timeZone=='' ||
              $scope.formData.phone=='') {
            alertSvc.showAlertByCode(103);
            return false;
          }
          if ($scope.typeDetail==1) {
            if ($scope.formData.type==1) alertSvc.showAlertByCode(219);
            if ($scope.formData.type==2) alertSvc.showAlertByCode(218);
            return false;
          }
          else {
            if ($scope.formData.type==1) $scope.formData.typeInvestor = $scope.typeDetail;
            if ($scope.formData.type==2) $scope.formData.typeEntrepreneur = $scope.typeDetail;
          }
          //Ajax send
          var filesUpload = [];
          if ($scope.avatarNew) filesUpload.push($scope.avatarNew);
          $scope.formData.sameBilling = ($scope.formData.sameMailingBilling)?1:0;
          mainSvc.callService({
              url: 'profile/updateProfile',
              params: $scope.formData,
              data: {
                files: filesUpload
              }
          }).then(function (response) {
            var profileRefresh = false;
            if ($rootScope.userInfo.name!=response.name) {
              $rootScope.userInfo.name = angular.copy(response.name);
              profileRefresh = true;
            }
            if ($rootScope.userInfo.avatar!=response.avatar) {
              $rootScope.userInfo.avatar = angular.copy(response.avatar);
              profileRefresh = true;
            }
            if (profileRefresh) authenticationSvc.updateUserInfo($rootScope.userInfo);
            $rootScope.userInfo.forceProfile = false;
            $scope.editForm = false;
            alertSvc.showAlertByCode(3);
            actionSvc.goToAction(1); //home
          });
        }
        else {
          $('#frmProfile').addClass('was-validated');
          $scope.invalidForm = true;
          alertSvc.showAlertByCode(103);
        }
      }

      $scope.checkPrivate = function() {
          $scope.formData.private = ($scope.formData.private==1)?0:1;
          $scope.isEditingForm();
      }

      $scope.writeName = function() {
        $scope.formData.name = $scope.formData.firstName + $scope.formData.lastName;
        $scope.isEditingForm();
      }

      $scope.clickSameAddress = function() {
        if ($scope.formData.sameMailingBilling) {
          $scope.formData.firstNameBilling = $scope.formData.firstName;
          $scope.formData.lastNameBilling = $scope.formData.lastName;
          $scope.formData.couIdBilling = $scope.formData.couId;
          $scope.formData.staIdBilling = $scope.formData.staId;
          $scope.formData.cityBilling = $scope.formData.city;
          $scope.formData.addressBilling = $scope.formData.address;
          $scope.formData.zipBilling = $scope.formData.zip;
          $scope.formData.phoneBilling = $scope.formData.phone;
          $scope.lstStateBilling = angular.copy($scope.lstState);
        }
        else {
          $scope.formData.firstNameBilling = '';
          $scope.formData.lastNameBilling = '';
          $scope.formData.couIdBilling = 0;
          $scope.formData.staIdBilling = 0;
          $scope.formData.cityBilling = '';
          $scope.formData.addressBilling = '';
          $scope.formData.zipBilling = '';
          $scope.formData.phoneBilling = '';
          $scope.lstStateBilling = [];
        };
        if (!$scope.editForm) $scope.editForm = true;
      };

    }]);
