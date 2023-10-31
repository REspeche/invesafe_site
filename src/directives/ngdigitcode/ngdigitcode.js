mainApp
    .directive('ngDigitCode', function () {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                ngModel: '='
            },
            controller: ['$scope',
                function ($scope) {
                    var nameObj = "#" + $scope.name + "_group #digit_";

                    $scope.$watch('ngModel', function() {
                        if ($scope.ngModel=='') {
                            for (var t = 1; t < 7; t++) {
                                $(nameObj + t).val('');
                            };
                        };
                    }, true);

                    $scope.next = function (actual, event) {
                        var next = actual + 1;
                        var prev = actual - 1;
                        var keyCode = event.keyCode;
                        if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
                            if (next < 7) $(nameObj + next).focus();
                            $(nameObj + actual).val($scope.getNumberFromKeyEvent(keyCode));
                        }
                        else if (keyCode==8) {
                            if (prev > 0) $(nameObj + prev).focus();
                            $(nameObj + actual).val("");
                        }
                        $scope.ngModel = '';
                        for (var t = 1; t < 7; t++) {
                            $scope.ngModel += $(nameObj + t).val() + '';
                        }
                    };

                    $scope.focus = function (actual) {
                        $(nameObj + actual).val("");
                    }

                    $scope.getNumberFromKeyEvent = function (keyCode) {
                        if (keyCode >= 96 && keyCode <= 105) {
                            return keyCode - 96;
                        } else if (keyCode >= 48 && keyCode <= 57) {
                            return keyCode - 48;
                        }
                        return null;
                    }
                }],
            compile: function () {
                return {
                    pre: function (scope, element, attrs) {
                        scope.ngModel = '';
                    }
                };
            },
            templateUrl: 'templates/directives/ngdigitcode/ngdigitcode.html'
        };
    });
