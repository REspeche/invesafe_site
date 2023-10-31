angular.module('mainApp').controller('settingsPagesFormController', ['$scope', 'actionSvc', 'modalSvc', 'mainSvc', '$rootScope', '$stateParams', '$translate', 'BASE_URL', 'alertSvc',
    function ($scope, actionSvc, modalSvc, mainSvc, $rootScope, $stateParams, $translate, BASE_URL, alertSvc) {
        $scope.paramAction = '';
        $scope.paramId = 0;
        $scope.loadForm = false;
        $scope.formData = {
          title: '',
          file: '',
          content: ''
        };
        $scope.editForm = false;

        $scope.loadFormPage = function() {
          $rootScope.viewChangeLanguage = false;
          $scope.paramAction = $stateParams.action;
          $scope.paramId = $stateParams.id;

          $translate.onReady(function() {
            $scope.msgInvalid = $translate.instant('MSG_INVALID_INPUT');
          });

          /* Load Data */
          if ($scope.paramAction=="edit" && $scope.paramId) {
            mainSvc.callService({
                url: 'setting/getPage',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'pagId': $scope.paramId
                }
            }).then(function (response) {
              $scope.formData = response[0];
              mainSvc.callService({
                  url: 'common/viewFile?type=page&file=' + $scope.formData.file + '&lang='+$rootScope.lang,
                  isFileResponse: true,
                  secured: false,
                  method: 'get'
              }).then(function (response) {
                $scope.formData.content = response;
                $scope.loadForm = true;

                $scope.initTextarea();
              });
            });
          }
          else {
            $scope.loadForm = true;
          };
        }

        $scope.initTextarea = function() {
          // Material Select Initialization
          $(document).ready(function() {
            tinymce.remove();
            tinymce.init(Object.assign({}, _tinyMCEDefault, {
              selector: 'textarea#txtContent',
              setup: function(ed) {
                   ed.on('change', function(e) {
                      var $scope = angular.element(document.querySelector('[ng-controller=settingsPagesFormController]')).scope();
                      $scope.isEditingForm();
                      $scope.formData.content = ed.getContent();
                      $scope.$apply()
                   });
              }
            }));
          });
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
                url: 'setting/removepage',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'pagId': $scope.paramId
                }
            }).then(function (response) {
              actionSvc.goToAction(16); //list pages
              alertSvc.showAlertByCode(4);
            });
          });
        };

        $scope.isEditingForm = function () {
            if (!$scope.editForm) $scope.editForm = true;
        }

        $scope.submitForm = function() {
          if (!$scope.frmPage.$invalid && $scope.paramAction=='edit') {
            $('#frmPage').removeClass('was-validated');
            //Ajax send
            var filesUpload = [];
            if ($scope.imageNew) filesUpload.push($scope.imageNew);
            mainSvc.callService({
                url: 'setting/updatepage',
                data: {
                  'fields': {
                    'usrId': $rootScope.userInfo.id,
                    'pagId': ($scope.paramAction=='new')?0:$scope.paramId,
                    'lang': $rootScope.lang,
                    'title':  $scope.formData.title,
                    'fileName':  $scope.formData.file,
                    'content':  encodeURIComponent($scope.formData.content)
                  }
                }
            }).then(function (response) {
              if (response.code==0) {
                actionSvc.goToAction(16); //list pages
                alertSvc.showAlertByCode(1);
              }
              else {
                alertSvc.showAlertByCode(response.code);
              }
            });
          }
          else {
            $('#frmPage').addClass('was-validated');
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
              actionSvc.goToAction(16); //list pages
            });
          }
          else {
            actionSvc.goToAction(16); //list pages
          }
        }

    }]);
