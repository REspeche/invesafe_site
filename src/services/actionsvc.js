mainApp.factory('actionSvc', ['$state',
		function ($state) {
			var _publicFunctions = {
				'goToAction': goToAction,
				'goToExternal': goToExternal,
				'getURL': getURL,
				'goToDashboard': goToDashboard,
				'goToSite': goToSite,
				'reload': reload,
				'refresh': refresh
			};

			function getURL(action) {
				var retRoute = '';
				switch (action) {

					/* Dashboard */
					case 1: retRoute = 'panel'; break;
					case 2: retRoute = 'login'; break;
					case 2.1: retRoute = "login?endSession=1"; break;
    			case 2.2: retRoute = "login?endToken=1"; break;
					case 3: retRoute = 'error-login'; break;
					case 4: retRoute = 'sign-up'; break;
					case 5: retRoute = 'forgot'; break;
					case 6: retRoute = 'account/details'; break;
					case 7: retRoute = 'account/password'; break;
					case 8: retRoute = 'alerts'; break;
					case 9: retRoute = 'contact'; break;
					case 10: retRoute = 'projects'; break;
					case 10.1: retRoute = 'projects/form'; break;
					case 10.2: retRoute = 'projects/view'; break;
					case 11: retRoute = 'categories'; break;
					case 11.1: retRoute = 'categories/form'; break;
					case 12: retRoute = 'settings/general'; break;
					case 13: retRoute = 'settings/limits'; break;
					case 14: retRoute = 'settings/payment'; break;
					case 15: retRoute = 'settings/social'; break;
					case 16: retRoute = 'settings/pages'; break;
					case 16.1: retRoute = 'settings/pages/form'; break;
					case 17: retRoute = 'projects/favorite'; break;
					case 18: retRoute = 'orders/purchase'; break;
					case 19: retRoute = 'members'; break;
					case 19.1: retRoute = 'members/form'; break;
					case 20: retRoute = 'projects/reported'; break;
					case 21: retRoute = 'projects/questions'; break;
					case 22: retRoute = 'projects/tosponsor'; break;
					case 23: retRoute = 'projects/deals'; break;
					case 24: retRoute = 'events'; break;
					case 24.1: retRoute = 'events/form'; break;
					case 25: retRoute = 'projects/invested'; break;
					case 26: retRoute = 'settings/sponsors'; break;
					case 26.1: retRoute = 'settings/sponsors/form'; break;
					case 27: retRoute = 'account/id-verification'; break;
					case 28: retRoute = 'portfolio'; break;
					case 29: retRoute = 'account/security'; break;
					case 30: retRoute = 'account/google-authenticator'; break;

					/* Site */
					case 101: retRoute = 'home'; break;
					case 102: retRoute = 'terms-of-use'; break;
					case 103: retRoute = 'privacy-policy'; break;
					case 104: retRoute = 'project'; break;
					case 105: retRoute = 'projects'; break;
					case 106: retRoute = 'cart'; break;
					case 107: retRoute = 'checkout'; break;
					case 108: retRoute = 'order-received'; break;
					case 109: retRoute = 'operative'; break;
					case 110: retRoute = 'about'; break;
					case 111: retRoute = 'contact'; break;
					case 112: retRoute = 'changelog'; break;
					case 113: retRoute = 'developers'; break;
					case 114: retRoute = 'careers'; break;
					case 115: retRoute = 'accessibility-statement'; break;
				}
				return retRoute;
			};

			function goToAction(action, param) {
				if (!param) $state.go(getURL(action));
				else $state.go(getURL(action), param);
			};

			function goToExternal(action) {
				$state.go('redirect-external', {
					page: getURL(action)
				});
			};

			function goToDashboard(action, param, newTab) {
				$state.goDashboard(getURL(action), (param)?param:{}, (newTab)?true:false);
			};

			function goToSite(action, param, newTab) {
				$state.goSite(getURL(action), (param)?param:{}, (newTab)?true:false);
			};

			function reload() {
				$state.reload();
			}

			function refresh() {
				location.reload();
			}

			return _publicFunctions;
		}
	]);
