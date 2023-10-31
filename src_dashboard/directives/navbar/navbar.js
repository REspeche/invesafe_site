mainApp.directive('navBar', function() {

        return {
            restrict: 'E',
            controller: ['$scope', 'actionSvc', 'mainSvc', '$rootScope',
            function ($scope, actionSvc, mainSvc, $rootScope) {
              $scope.lstAlerts = [];

              $scope.loadTopBar = function() {
                $(document).ready(function() {
                  // SideNav Initialization
                  $("#slide-out").show();
                  $(".button-collapse").sideNav(_sideNavDefault);
                });
              };

              $scope.getListAlerts = function () {
                mainSvc.callService({
                    url: 'common/getlistalerts',
                    params: {
                      'usrId': $rootScope.userInfo.id,
                      'limit': 5
                    }
                }).then(function (response) {
                    $scope.lstAlerts = response;
                });
              };

              $scope.getTime = function(seconds) {
                if (seconds > 60) {
                  var minutes = seconds/60;
                  if (minutes > 60) {
                    var hours = minutes/60;
                    if (hours > 24) {
                      var days = hours/24;
                      return Math.floor(days)+' días';
                    }
                    else {
                      return Math.floor(hours)+' hor';
                    }
                  }
                  else {
                    return Math.floor(minutes)+' min';
                  }
                }
                else {
                  return Math.floor(seconds)+' seg';
                }
              };

              $scope.setViewedAlert = function (item) {
                mainSvc.callService({
                    url: 'common/setViewedAlert',
                    params: {
                      'axuId': item.id
                    }
                }).then(function (response) {
                    $rootScope.alerts.notifications--;
                    actionSvc.goToAction(item.action);
                });
              };

              $scope.viewAllAlerts = function () {
                actionSvc.goToAction(8); //alerts
              };

              $scope.clickContact = function (param) {
                if (param) {
                  setUrlQuery('/'+actionSvc.getURL(14)+((param)?'?'+param:''));
                }
                else {
                  actionSvc.goToAction(9); //contact
                }
              };

              $scope.clickItemMenu = function(action) {
                  actionSvc.goToAction(action);
              };

              $scope.clickSite = function() {
                 actionSvc.goToSite(101); //site
              }

            }],
            templateUrl: 'templates/directives/navbar/navbar.html'
        };
    });
