mainApp.directive('bannerPage', function() {

        return {
            restrict: 'E',
            scope: {
                title: '@',
                text: '@',
                image: '@',
                showSocials: '@',
                size: '@',
                align: '@'
            },
            controller: ['$scope',
              function ($scope) {
                if (!$scope.size) $scope.size = 'lg';
                if (!$scope.align) $scope.align = 'end';
            }],
            templateUrl: 'templates/directives/bannerPage/bannerPage.html'
        };
    });
