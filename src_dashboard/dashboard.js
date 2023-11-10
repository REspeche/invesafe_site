mainApp.controller('dashboardController', [ '$scope', 'actionSvc', 'BASE_URL', 'modalSvc', 'mainSvc', 'authenticationSvc',
      function ($scope, actionSvc, BASE_URL, modalSvc, mainSvc, authenticationSvc) {
        $scope.path = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';

        $scope.loadDashboard = function() {
          /* Scroll top */
          $('html, body').animate({
              scrollTop:0
          });

          $scope.$on('$viewContentLoaded', function() {
            if ($("#load_screen").length==1) {
              $("#load_screen").delay(1000).fadeOut(function () {
                  $('body').addClass('enable-scroll');
                  $("#load_screen").remove();
              });
            }
          });
        };

        $scope.loadSideNav = function() {
          var ps = new PerfectScrollbar(document.querySelector('.custom-scrollbar'), {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20
          });
        }

        $scope.clickSite = function() {
           actionSvc.goToSite(101); //site
        }

        $scope.clickItemMenu = function(action) {
            actionSvc.goToAction(action);
        };

        $scope.logout = function() {
          modalSvc.showModal({
                templateUrl: '/templates/modals/modalCloseSession.html',
                size: 'sm'
              },
              {
                goToSite: true,
                defer: false,
                beforeClose: function (scope) {
                  mainSvc.callService({
                      url: 'auth/logout'
                  }).then(function (response) {
                    authenticationSvc.logout();
                    if (scope.modalOptions.goToSite) {
                      actionSvc.goToSite(101); // go to home site
                    }
                    else {
                      actionSvc.goToExternal(2); // go to login
                    }
                  });
                }
              });
        };
      }
    ]);
