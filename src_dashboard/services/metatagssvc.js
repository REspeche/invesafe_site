mainApp.service('metaTagsSvc', ['$rootScope',
  function ($rootScope) {
    var self = this;

    // Set custom options or use provided fallback (default) options
    self.loadMetadata = function(metadata) {
      self.version = versionBuild;
      self.language = $rootScope.lang;
    };

    // Route change handler, sets the route's defined metadata
    $rootScope.$on('$stateChangeSuccess', function (event, newRoute) {
      self.loadMetadata(newRoute.metadata);
    });
  }]);
