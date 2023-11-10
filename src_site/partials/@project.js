angular.module('mainApp').controller('projectController', ['$scope', 'BASE_URL', 'mainSvc', '$stateParams', 'authenticationSvc', 'alertSvc', 'metaTagsSvc',
    function ($scope, BASE_URL, mainSvc, $stateParams, authenticationSvc, alertSvc, metaTagsSvc) {
      var isLoadQuestions = false;
      var isLoadStory = false;
      var isLoadUpdate = false;
      $scope.item = {};
      $scope.itemFeatures = {};
      $scope.lstMentors = [];
      $scope.pathProject = BASE_URL.api + '/v1/common/viewFile?type=project&file=';
      $scope.pathProfile = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';
      $scope.pathGallery = BASE_URL.api + '/v1/common/viewFile?type=gallery&file=';
      $scope.loadPage = false;
      $scope.projectExist = false;
      $scope.lstQuestions = [];
      $scope.theStory = '';
      $scope.lstUpdates = [];
      $scope.lstItemsGallery = [];
      $scope.slideActive = 0;
      $scope.htmlStory = '';

      $scope.loadProject = function() {
        $scope.paramId = $stateParams.id;
        var hash = window.location.hash.split('?')[0].substring(1);
        if (hash && hash!='') {
          $("#projectTab").find("a.nav-link.active").removeClass('active');
          $("#projectTabContent").find("div.tab-pane.active").removeClass('active').removeClass('show');
          $("a[aria-controls="+hash+"]").addClass('active');
          $("#"+hash+"").addClass('active show');
        }

        /* Load list projects */
        mainSvc.callService({
            url: 'project/getProjectSite',
            secured: false,
            params: {
              proId: $scope.paramId
            }
        }).then(function (response) {
          if (response) {
            $scope.item = angular.copy(response.main);
            // Dynamically set metadata
            metaTagsSvc.loadMetadata({
              title: 'Invesafe | ' + $scope.item.title,
              description: $scope.item.subtitle
            });
            if (response.meta) {
              $scope.itemMeta = angular.copy(response.meta);
              $scope.itemMeta.strAssetRentStartDate = dateFormat(UnixTimeStampToDate($scope.itemMeta.assetRentStartDate, true),"yyyy-mm-dd");
              $scope.item.assetTicketPrice = $scope.itemMeta.assetTicketPrice;
            }
            if ($scope.item.gallery) {
              if (!$scope.item.imgBg) $scope.item.imgBg = ($scope.item.image)?($scope.pathProject + $scope.item.image):'/content/assets/img/back/back_projects1.jpg';
              $scope.lstItemsGallery = JSON.parse($scope.item.gallery);
              $scope.slideActive = Math.floor(Math.random() * $scope.lstItemsGallery.length);
            }
            $scope.getStory();
            $scope.item.estimatedAvailabilityStr = UnixTimeStampToDateTime($scope.item.estimatedAvailabilityMiliSeconds);
            $scope.item.secondsToAvailability = ($scope.item.progress==1)?Math.round($scope.item.estimatedAvailabilityMiliSeconds - (new Date().getTime() / 1000)):0;
            if ($scope.item.secondsToAvailability<86400) {
              setInterval(function(){
                $scope.item.secondsToAvailability--;
                $scope.$apply();
              }, 1000);
            };
            $scope.item.tokenPurchase = 1;
            $scope.projectExist = true;
          }
          $scope.loadPage = true;
        });

      };

      $scope.clickFavorite = function(item) {
        if (authenticationSvc.getUserInfo().isLogin) {
          mainSvc.callService({
              url: 'project/setFavoriteProject',
              params: {
                proId: item.id
              }
          }).then(function (response) {
            if (response.code==0) {
              item.isFavorite = angular.copy(response.id);
            }
          });
        }
        else alertSvc.showAlertByCode(214);
      }

      $scope.getStory = function() {
        if (!isLoadStory) {
          mainSvc.callService({
              url: 'project/getStoryByProject',
              params: {
                proId: $scope.paramId
              },
              secured: false
          }).then(function (response) {
            $scope.htmlStory = angular.copy(response.story);
            isLoadStory = true;
          });
        }
      };

      $scope.quantityChange = function() {
        if (!$scope.item.tokenPurchase) $scope.item.tokenPurchase=1;
      };

    }]);

function renderMap() {
  var mapProp= {
    center:new google.maps.LatLng(51.508742,-0.120850),
    zoom:5,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
};
