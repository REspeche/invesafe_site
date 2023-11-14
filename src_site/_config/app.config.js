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

mainApp.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 01 Jan 2020 00:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  }]);