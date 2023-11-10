mainApp.directive('shareSocial', function() {

        return {
            restrict: 'E',
            scope: {
                project: '@'
            },
            templateUrl: 'templates/directives/shareSocial/shareSocial.html'
        };
    });
