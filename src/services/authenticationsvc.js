mainApp.factory('authenticationSvc', ['COOKIES', '$cookies', '$rootScope',
  function (COOKIES, $cookies, $rootScope) {
      var publicFunctions = {
        saveLogin: saveLogin,
        login: login,
        verifyLogin: verifyLogin,
        logout: logout,
        logoutRefresh: logoutRefresh,
        getUserInfo: getUserInfo,
        updateUserInfo: updateUserInfo
      };

      var _data = {
        isLogin         : false,
        id              : 0,
        email           : undefined,
        token           : undefined,
        type            : 1,
        name            : undefined,
        forceProfile    : false,
        role            : 1,
        rememberLogin   : false,
        avatar          : undefined
      };

      function updateUserInfo(userInfo) {
        $rootScope.userInfo = saveLogin(userInfo);
      }

      function saveLogin(userInfo) {
        _data = {
          isLogin         : true,
          id              : userInfo.id,
          email           : userInfo.email,
          token           : userInfo.token,
          type            : userInfo.type,
          name            : userInfo.name,
          forceProfile    : userInfo.forceProfile,
          role      	    : userInfo.role,
          rememberLogin   : (userInfo.rememberLogin)?true:false,
          avatar      	  : userInfo.avatar,
        };
        var expireDate = undefined;
        if (_data.rememberLogin==true) {
          expireDate = new Date();
          expireDate.setYear(expireDate.getFullYear() + 1);
        }
        $cookies.put(COOKIES.files.main, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
        return _data;
      }

      function login(updateScope) {
        if (!!$cookies.get(COOKIES.files.main)) {
          var cookieStr = decodeURIComponent($cookies.get(COOKIES.files.main).replace(/\+/g, '%20'));
          var cookieObjMain = angular.fromJson(cookieStr);
          _data = {
            isLogin         : true,
            id              : cookieObjMain.id,
            email           : cookieObjMain.email,
            token           : cookieObjMain.token,
            type            : cookieObjMain.type,
            name            : cookieObjMain.name,
            forceProfile    : cookieObjMain.forceProfile,
            role            : cookieObjMain.role,
            rememberLogin   : cookieObjMain.rememberLogin,
            avatar          : cookieObjMain.avatar
          };
          if (cookieObjMain.tabRefreshed) $cookies.put(COOKIES.files.main, angular.toJson(_data));
          if (updateScope) $rootScope.userInfo = _data;
        }
        else {
          _data = {
            isLogin : false,
            id      : 0,
            email   : undefined,
            token   : undefined,
            type    : 1,
            name    : undefined,
            forceProfile : false,
            role    : 1,
            rememberLogin : false,
            avatar  : undefined
          };
        }
        return _data;
      }

      function verifyLogin() {
        return (!!$cookies.get(COOKIES.files.main));
      }

      function logout(updateScope) {
        $cookies.remove(COOKIES.files.main);
        _data = {
          isLogin : false,
          id      : 0,
          email   : undefined,
          token   : undefined,
          type    : 1,
          name    : undefined,
          forceProfile : false,
          role    : 1,
          rememberLogin : false,
          avatar  : undefined
        };
        if (updateScope) $rootScope.userInfo = _data;
      }

      function logoutRefresh() {
        if (_data && _data.isLogin && !_data.rememberLogin) {
          var expireDate = undefined;
          expireDate = new Date();
          expireDate.setSeconds(expireDate.getSeconds() + 5); //5 seconds
          _data.tabRefreshed = true;
          $cookies.put(COOKIES.files.main, angular.toJson(_data), (expireDate)?{'expires': expireDate}:{});
        }
      }

      function getUserInfo() {
        return _data;
      }

      return publicFunctions;
  }]);
