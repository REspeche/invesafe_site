mainApp.directive('countDown', function() {

    return {
        restrict: 'E',
        scope: {
            seconds: '@'
        },
        controller: ['$scope',
          function ($scope) {
            $scope.$watch('seconds', function() {
                $scope.visible = ($scope.seconds>0 && $scope.seconds<86400);
                $scope.label = '';
                let valS = $scope.seconds;
                let _h = Math.floor(valS/60/60);
                let _m = Math.floor(valS/60)-_h*60;
                let _s = Math.floor(valS)-Math.floor(valS/60)*60;
                $scope.label = ((_h<10)?'0':'')+_h+'h '+((_m<10)?'0':'')+_m+'m '+((_s<10)?'0':'')+_s+'s';
            }, true);
        }],
        template: '<div class="reverse-count" ng-show="visible">{{label}}</div>'
    };
});
