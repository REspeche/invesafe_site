angular.module('mainApp').controller('panelController', ['$scope', 'mainSvc', 'actionSvc', 'modalSvc', '$translate', '$rootScope', 'alertSvc',
    function ($scope, mainSvc, actionSvc, modalSvc, $translate, $rootScope, alertSvc) {
        $scope.lstCounters = [{
          'donatios': 0,
          'deals': 0,
          'members': 0,
          'projects': 0,
          'projectsApproved': 0,
          'projectsSoponsored': 0
        }];
        $scope.lstLastMembers = [];
        $scope.lstRecentProjects = [];
        $scope.lstLast30Deals = [];

        $scope.loadPanel = function() {
          /* Load general panel */
          mainSvc.callService({
              url: 'home/getAllInfo'
          }).then(function (response) {
            $scope.lstCounters = angular.copy(response.lstCounters);
            $scope.lstLastMembers = angular.copy(response.lstLastMembers);
            $scope.lstRecentProjects = angular.copy(response.lstRecentProjects);
          });

          $(document).ready(function() {
            var data = {
                labels: [],
                datasets: [{
                    label: "Deals last 30 days",
                    data: [],
                    backgroundColor: "rgba(255,255,255,.5)"
                }]
            };

            var options = {
                responsive: true,
                tooltips: {
                    mode: 'single',
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        ticks: {
                          fontColor: "#fff", // this here
                        },
                    }],
                    yAxes: [{
                        ticks: {
                          fontColor: "#fff", // this here
                        }
                    }],
                }
            };

            mainSvc.callService({
                url: 'home/getLast30Deals'
            }).then(function (response) {
              $scope.lstLast30Deals = angular.copy(response);
              angular.forEach($scope.lstLast30Deals, function(item, key){
                data.labels.push(item.date)
                data.datasets[0].data.push(item.money)
              });
              // Get the context of the canvas element we want to select
              var ctx = document.getElementById("dealsLast30Days").getContext('2d');
              var myLineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
              }); //'Line' defines type of the chart.
            });

          });

        };

        $scope.clickItemHome = function(action, param) {
            setUrlQuery('/'+actionSvc.getURL(action)+((param)?'?'+param:''));
        };

        $scope.clickEditProject = function(item) {
          actionSvc.goToAction(10.1, {id: item.id, action: 'edit'}); //edit project
        }

        $scope.clickViewDetailProject = function(item) {
          actionSvc.goToSite(105, {id: item.id}, true); //view project
        }

        $scope.clickRemoveProject = function(item) {
          modalSvc.showModal({
            size: 'sm'
          },{
            closeButtonText: $translate.instant('BTN_NO'),
            actionButtonText: $translate.instant('BTN_YES'),
            bodyText: $translate.instant('MSG_REMOVE_ACTION', { name: item.title})
          }).then(function (result) {
            mainSvc.callService({
                url: 'project/removeproject',
                params: {
                  'usrId': $rootScope.userInfo.id,
                  'proId': item.id
                }
            }).then(function (response) {
              let index = $scope.lstRecentProjects.findIndex( record => record.id == item.id );
              $scope.lstRecentProjects.splice(index, 1);
              alertSvc.showAlertByCode(4);
            });
          });
        };

        $scope.changeStatusProject = function (item) {
          mainSvc.callService({
              url: 'project/changeStatusProject',
              params: {
                'usrId'  : $rootScope.userInfo.id,
                'proId'  : item.id
              }
          }).then(function (response) {
            let index = $scope.lstRecentProjects.findIndex( record => record.id == item.id );
            $scope.lstRecentProjects[index].status = ($scope.lstRecentProjects[index].status==1)?2:1;
          });
        }
    }]);
