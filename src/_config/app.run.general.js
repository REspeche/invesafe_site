mainApp.run(['$rootScope', 'authenticationSvc',
    function ($rootScope, authenticationSvc) {

      //Verify if user logged in last time when tab was hidden
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
          var tempId = 0;
          var tempName = undefined;
          var tempAvatar = undefined;
          if ($rootScope.userInfo) {
            var tempId = angular.copy($rootScope.userInfo.id);
            var tempName = angular.copy($rootScope.userInfo.name);
            var tempAvatar = angular.copy($rootScope.userInfo.avatar);
          }
          if (authenticationSvc.login().id!=tempId || authenticationSvc.login().name!=tempName || authenticationSvc.login().avatar!=tempAvatar) {
            console.log('Page refreshed!')
            location.reload();
            return false;
          }
        }
      });
      window.addEventListener('beforeunload', function(e) {
        authenticationSvc.logoutRefresh();
      });

    }]);
