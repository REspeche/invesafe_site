mainApp.directive('badgeStatus', function() {

        return {
            restrict: 'E',
            scope: {
                id: '@',
                type: '@'
            },
            controller: ['$scope', '$translate', '$rootScope',
              function ($scope, $translate, $rootScope) {

                $scope.$watch('id', function() {
                  $scope.color = 'light';
                  $scope.label = '';
                  if ($scope.type=='project') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.label = $translate.instant('BUD_DRAFT');
                        break;
                      case 2:
                        $scope.color = 'primary';
                        $scope.label = $translate.instant('BUD_TO_APPROVE');
                        break;
                      case 3:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_ACTIVE');
                        break;
                      case 4:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_REJECTED');
                        break;
                    }
                  }
                  else if ($scope.type=='category') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_ON');
                        break;
                      case 2:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_OFF');
                        break;
                    }
                  }
                  else if ($scope.type=='progress') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'info';
                        $scope.label = $translate.instant('BUD_COMING_SOON');
                        break;
                      case 2:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_PROGRESS');
                        break;
                      case 3:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_SOLD_OUT');
                        break;
                      case 4:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_READY_SALE');
                        break;
                    }
                  }
                  else if ($scope.type=='userType') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.label = $translate.instant('BUD_ENTREPRENEUR');
                        break;
                      case 2:
                        $scope.color = 'primary';
                        $scope.label = $translate.instant('BUD_COMPANY');
                        break;
                      case 3:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_MENTOR');
                        break;
                      case 4:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_PERSON');
                        break;
                      }
                  }
                  else if ($scope.type=='userRole') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.label = $translate.instant('BUD_NORMAL');
                        break;
                      case 2:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_ADMINISTRATOR');
                        break;
                    }
                  }
                  else if ($scope.type=='statusPartner') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_NO');
                        break;
                      case 2:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_YES');
                        break;
                    }
                  }
                  else if ($scope.type=='shipping') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_SHIPPING1');
                        break;
                      case 2:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_SHIPPING2');
                        break;
                      case 3:
                        $scope.color = 'warning';
                        $scope.label = $translate.instant('BUD_SHIPPING3');
                        break;
                    }
                  }
                  else if ($scope.type=='event') {
                    switch (parseInt($scope.id)) {
                      case 1:
                        $scope.color = 'primary';
                        $scope.label = $translate.instant('BUD_TO_APPROVE');
                        break;
                      case 2:
                        $scope.color = 'success';
                        $scope.label = $translate.instant('BUD_ACTIVE');
                        break;
                      case 3:
                        $scope.color = 'danger';
                        $scope.label = $translate.instant('BUD_REJECTED');
                        break;
                    }
                  }
                }, true);
            }],
            template: '<div class="badge badge-pill badge-{{color}} py-1 px-2">{{label}}</div>'
        };
    });
