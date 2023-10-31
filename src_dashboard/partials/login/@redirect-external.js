angular.module('mainApp').controller('redirectExternalController', ['CONSTANTS', '$scope', '$window', '$stateParams', '$translate',
    function (CONSTANTS, $scope, $window, $stateParams, $translate) {
      $translate.onReady(function() {
        $scope.labelPage = $translate.instant('LOADING_PAGE');
      });

      $scope.loadRedirectExternal = function() {
        var page = '/'+$stateParams.page;
        if (page) $window.open(page, '_self');
        else $scope.labelPage = 'Error al redireccionar. Presione <a href="'+page+'">aqui</a> para continuar.'
      }
    }]);
