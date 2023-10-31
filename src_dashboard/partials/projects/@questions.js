angular.module('mainApp').controller('questionsProjectsController', ['$scope', 'mainSvc', 'actionSvc', '$rootScope', '$translate', 'modalSvc', '$q', '$filter', 'alertSvc',
    function ($scope, mainSvc, actionSvc, $rootScope, $translate, modalSvc, $q, $filter, alertSvc) {
        $scope.projects = [];
        $scope.loadList = false;

        $scope.loadQuestionsProjects = function() {
          $scope.refreshList(true);
        }

        $scope.refreshList = function(isLoad) {
          $scope.loadList = false;
          /* Load Projects */
          mainSvc.callService({
              url: 'project/getquestionsprojects',
              params: {
                'usrId'   : $rootScope.userInfo.id
              }
          }).then(function (response) {
            $scope.projects = angular.copy(response);
            $scope.loadList = true;
            if (!isLoad) alertSvc.showAlertByCode(105);
          });
        }

        $scope.clickViewDetail = function(item) {
          actionSvc.goToSite(105, {id: item.proId}, true); //view project
        }

        $scope.clickRemove = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: $filter('trimString')(item.question) }),
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/removequestionsproject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'prqId': item.id
                }
            }).then(function (response) {
              let index = $scope.projects.findIndex( record => record.id == item.id );
              $scope.projects.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        }

        $scope.clickAnswer = function(item) {
          modalSvc.showModal({
                  templateUrl: '/templates/modals/modalNewAnswer.html'
              },
              {
                  closeButtonText: undefined,
                  width: '980px',
                  formDataAnswer: angular.copy(item),
                  defer: true,
                  beforeClose: function (scope) {
                    var defered = $q.defer();
                    var promise = defered.promise;

                    if (!scope.frmAnswer.$invalid) {
                      $('#frmAnswer').removeClass('was-validated');
                      mainSvc.callService({
                          url: 'project/updateAnswerProject',
                          params: {
                            'usrId': $rootScope.userInfo.id,
                            'prqId': item.id,
                            'answer': scope.modalOptions.formDataAnswer.answer
                          }
                      }).then(function (response) {
                        item.answer = scope.modalOptions.formDataAnswer.answer;
                        defered.resolve(true);
                        alertSvc.showAlertByCode(1);
                      });
                    }
                    else {
                      $('#frmAnswer').addClass('was-validated');
                      scope.invalidForm = true;
                      alertSvc.showAlertByCode(103);
                      defered.resolve(false);
                    };
                    return promise;
                  }
              });
        }

        $scope.changeActiveQuestion = function (item) {
          mainSvc.callService({
              url: 'project/changeActiveQuestion',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'prqId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.projects.findIndex( record => record.id == item.id );
            $scope.projects[index].active = ($scope.projects[index].active==1)?2:1;
          });
        }

    }]);
