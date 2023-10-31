mainApp.service('metaTagsSvc', ['$rootScope',
  function ($rootScope) {
    var self = this;

    // Set custom options or use provided fallback (default) options
    self.loadMetadata = function(metadata) {
      let titleM = 'INVESAFE';
      let descriptionM = 'Web platform for smart investors in Real Estate.';
      if (metadata) {
        self.title = document.title = metadata.title || titleM;
        self.description = metadata.description || descriptionM;
      }
      else {
        self.title = document.title = titleM;
        self.description = descriptionM;
      }
      self.version = versionBuild;
      self.language = $rootScope.lang;
    };

    // Route change handler, sets the route's defined metadata
    $rootScope.$on('$stateChangeSuccess', function (event, newRoute) {
      self.loadMetadata(newRoute.metadata);
    });
  }]);
