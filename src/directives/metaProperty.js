mainApp.directive('metaProperty', ['metaTagsSvc', function(metaTagsSvc) {
  return {
    restrict: 'A',
    scope: {
      metaProperty: '@'
    },
    link: function postLink(scope, element, attrs) {
      scope.default = element.attr('content');
      scope.metadata = metaTagsSvc;

      // Watch for metadata changes and set content
      scope.$watch('metadata', function (newVal, oldVal) {
        setContent(newVal);
      }, true);

      // Set the content attribute with new metadataService value or back to the default
      function setContent(metadata) {
        var content = metadata[scope.metaProperty] || scope.default;
        element.attr('content', content);
      }

      setContent(scope.metadata);
    }
  };
}]);
