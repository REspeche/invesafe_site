angular.module('mainApp').controller('projectsController', ['$scope', 'mainSvc', 'BASE_URL',
    function ($scope, mainSvc, BASE_URL) {
      $scope.lstProjects = [];
      $scope.loadList = false;
      $scope.pathProject = BASE_URL.api + '/v1/common/viewFile?type=project&file=';

      $scope.loadMarketplace = function() {

        /* Load list categories */
        mainSvc.callService({
            url: 'project/getProjectsSite',
            params: {
              search: ''
            },
            secured: false
        }).then(function (response) {
          $scope.lstProjects = angular.copy(response);
          angular.forEach($scope.lstProjects, function(item, key){
            item.imgBg = {
                'background-image': 'url('+((item.image)?($scope.pathProject + item.image):'/assets/img/small/not-project.jpg')+')'
            };
            item.tokenPurchase = 1;
            item.estimatedAvailabilityStr = UnixTimeStampToDateTime(item.estimatedAvailabilityMiliSeconds);
            item.secondsToAvailability = (item.progress==1)?Math.round(item.estimatedAvailabilityMiliSeconds - (new Date().getTime() / 1000)):0;
            if (item.secondsToAvailability<86400) {
              setInterval(function(){
                item.secondsToAvailability--;
                $scope.$apply();
              }, 1000);
            };
          });
          $scope.loadList = true;
        });
      };

      $scope.quantityChange = function(idx) {
        let item = $scope.lstProjects[idx];
        if (!item.tokenPurchase) item.tokenPurchase=1;
      }

    }]);
