mainApp.config(['$provide', 'BASE_URL',
  function ($provide, BASE_URL) {
    $provide.decorator('$state', ['$delegate', '$window',
        function ($delegate, $window) {
            var extended = {
                goNewTab: function (stateName, params) {
                    $window.open(
                        $delegate.href(stateName, params, { absolute: true }), '_blank');
                },
                goDashboard: function (stateName, params, newTab) {
                  var strParams = '';
                  angular.forEach(params, function(item, key){
                    strParams+='/'+item;
                  });
                  var url = BASE_URL.dashboard+stateName+strParams;
                  $window.open(url, (newTab)?'_blank':'_self');
                }
            };
            angular.extend($delegate, extended);
            return $delegate;
        }]);
  }]);

mainApp.config(['$translateProvider',
  function($translateProvider) {
    $translateProvider
	  .registerAvailableLanguageKeys(['es','en'], {
        'es_*': 'es',
        'en_*': 'en'
      })
      .useStaticFilesLoader({
        files: [
          {
              prefix: '/translations/general-',
              suffix: '.json'
          },
          {
              prefix: '/translations/site-',
              suffix: '.json'
          },
          {
              prefix: '/translations/meta-',
              suffix: '.json'
          },
          {
              prefix: '/translations/operative-',
              suffix: '.json'
          }
        ]
      })
      .preferredLanguage('es')
      .useLocalStorage()
      .useSanitizeValueStrategy('sanitizeParameters');
  }]);
