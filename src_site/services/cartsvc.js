mainApp.factory('cartSvc', ['COOKIES', '$cookies', '$rootScope',
  function (COOKIES, $cookies, $rootScope) {
      var publicFunctions = {
        addItemCart: addItemCart,
        removeItemCart: removeItemCart,
        getCountCart: getCountCart,
        getItemList: getItemList,
        updateQuantity: updateQuantity,
        emptyCart: emptyCart
      };

      function addItemCart(item) {
        let retAction = 0;
        let cookieObjCart = [];
        let findItem = false;
        let idxItem = -1;
        if (!!$cookies.get(COOKIES.files.cart)) {
            let cookieStr = decodeURIComponent($cookies.get(COOKIES.files.cart).replace(/\+/g, '%20'));
            cookieObjCart = angular.fromJson(cookieStr);
            cookieObjCart.forEach(function (element, i) {
                if (element.id == item.id) {
                  idxItem = i;
                  findItem = true;
                };
            });
        };
        if (!findItem) {
          cookieObjCart.push(item);
          $rootScope.alerts.cart = cookieObjCart.length;
          retAction = 1;
        }
        else {
          cookieObjCart[idxItem] = item;
          retAction = 2;
        }
        //save cookie
        var expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 24);
        $cookies.put(COOKIES.files.cart, angular.toJson(cookieObjCart), (expireDate)?{'expires': expireDate}:{});
        return retAction;
      };

      function removeItemCart(_id) {
        if (!!$cookies.get(COOKIES.files.cart)) {
            let cookieStr = decodeURIComponent($cookies.get(COOKIES.files.cart).replace(/\+/g, '%20'));
            let cookieObjCart = angular.fromJson(cookieStr);
            let newObjCart = cookieObjCart.filter(function( element ) {
                return element.id !== _id;
            });
            $rootScope.alerts.cart = newObjCart.length;
            //save cookie
            var expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 24);
            $cookies.put(COOKIES.files.cart, angular.toJson(newObjCart), (expireDate)?{'expires': expireDate}:{});
        };
      };

      function getCountCart() {
        let countI = 0;
        if (!!$cookies.get(COOKIES.files.cart)) {
            let cookieStr = decodeURIComponent($cookies.get(COOKIES.files.cart).replace(/\+/g, '%20'));
            let cookieObjCart = angular.fromJson(cookieStr);
            countI = cookieObjCart.length;
        }
        $rootScope.alerts.cart = countI;
      };

      function getItemList() {
        let listI = [];
        if (!!$cookies.get(COOKIES.files.cart)) {
            let cookieStr = decodeURIComponent($cookies.get(COOKIES.files.cart).replace(/\+/g, '%20'));
            listI = angular.fromJson(cookieStr);
        }
        return listI;
      };

      function updateQuantity(_item) {
        if (!!$cookies.get(COOKIES.files.cart)) {
          let cookieStr = decodeURIComponent($cookies.get(COOKIES.files.cart).replace(/\+/g, '%20'));
          let cookieObjCart = angular.fromJson(cookieStr);
          let _idx = cookieObjCart.findIndex( record => record.id == _item.id );
          cookieObjCart[_idx].tokenPurchase = _item.tokenPurchase;
          //save cookie
          var expireDate = new Date();
          expireDate.setHours(expireDate.getHours() + 24);
          $cookies.put(COOKIES.files.cart, angular.toJson(cookieObjCart), (expireDate)?{'expires': expireDate}:{});
        }
      };

      function emptyCart() {
        if (!!$cookies.get(COOKIES.files.cart)) {
          $cookies.remove(COOKIES.files.cart);
          $rootScope.alerts.cart = 0;
        };
      };

      return publicFunctions;
  }]);
