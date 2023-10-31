mainApp.factory('mainSvc', ['BASE_URL', '$rootScope', '$http', '$state', '$q', '$timeout', 'CONSTANTS', 'actionSvc', '$translate', '$cookies', 'COOKIES', 'alertSvc',
		function (BASE_URL, $rootScope, $http, $state, $q, $timeout, CONSTANTS, actionSvc, $translate, $cookies, COOKIES, alertSvc) {

			var _paramSvc = {
				path: '',
				version: 1,
				url: '',
				params: {},
				data: undefined,
				method: 'post',
				secured: BASE_URL.secured, //[true:default]
				timeout: CONSTANTS.timeout_ajax,
				concatURL: true,
				isFileResponse: false
			};

			toastr.options = {
				"closeButton": true,
				"positionClass": "toast-bottom-right",
				"preventDuplicates": true
			};

			var _publicFunctions = {
				'callService': callService,
				'getDateFormat': getDateFormat,
				'convertDateFromString': convertDateFromString
			};

			function runCallService(paramReq) {
				var requestTimeout = $timeout(function () {
					alertSvc.showAlert().notifyWarning($translate.instant('MSG_REQUEST_TIME_OUT'));
				}, paramReq.timeout);
				var defered = $q.defer();
				var promise = defered.promise;
				var headers = (paramReq.secured && $rootScope.userInfo) ? {
					'Content-Type': (paramReq.data) ? undefined : 'application/json',
					'x-access-token': $rootScope.userInfo.token
				} : {
					'Content-Type': (paramReq.data) ? undefined : 'application/json'
				};
				$rootScope.isBusy = true;
				$http({
					'url': paramReq.path + paramReq.url,
					'method': paramReq.method,
					'params': (!paramReq.params.usrId && $rootScope.userInfo)?Object.assign({}, {'usrId':$rootScope.userInfo.id}, paramReq.params):paramReq.params,
					'data': paramReq.data,
					'headers': headers,
					'cache': false,
					'encoding': null,
					'timeout': requestTimeout,
					'transformRequest': (paramReq.data)?function (data, headersGetter) {
					    var formData = undefined;
							if (data) {
								formData = new FormData();
								if (data.fields) {
									angular.forEach(data.fields, function(item, key){
										formData.append(key, item);
									});
								}
								if (data.files && data.files.length > 0) {
									for (var i = 0; i < data.files.length; i++) {
										formData.append("files[" + i + "]", data.files[i]);
									}
								}
								if (data.gallery && data.gallery.length > 0) {
									for (var i = 0; i < data.gallery.length; i++) {
										formData.append("gallery[" + i + "]", data.gallery[i]);
									}
								}
							}
					    return formData;
					}:angular.identity
				}).then(function (response) {
					var processMesage = function(response) {
						var status = (response.data.code)?parseInt(response.data.code):0;
						if (status > 0 && status < 400) { // 1 and 399
							alertSvc.showAlertByCode(status);
							return (status >= 300 && status < 400) ? false : true; //error
						};
					}
					$timeout.cancel(requestTimeout);
					$rootScope.isBusy = false;
					if (response.status == 200) {
						if (paramReq.isFileResponse) defered.resolve(response.data);
						else {
							if (response.data.action == null || response.data.action == 0) {
								if (response.data.code > 0) {
									if (processMesage(response)) defered.resolve(response.data.data);
									else defered.reject(response.data.data);
								} else defered.resolve(response.data.data);
							} else actionSvc.goToAction(response.data.action);
						}
					} else {
						alertSvc.showAlertByCode(301);
						defered.reject(undefined);
					}
				}).catch(function (err) {
					$rootScope.isBusy = false;
					if (err.status == 401 && err.data.code == 309) {
						$cookies.remove(COOKIES.files.main);
						actionSvc.goToExternal(2.2);
					}
					else if (err.status != -1) alertSvc.showAlertByCode(300);
					defered.reject(undefined);
				});
				return promise;
			}

			//Public Functions
			function callService(paramSvc) {
				var version = '';
				var p = Object.assign({}, _paramSvc, paramSvc);
				if (p.version!='') version = '/v' + p.version;
				if (p.concatURL) p.path = BASE_URL.api + version + '/' + ((p.secured) ? 'secured/' : '');
				return runCallService(p);
			}

			function getDateFormat(pMilliseconds) {
				var vDate = new Date(pMilliseconds);
				var dd = vDate.getDate();
				var mm = vDate.getMonth() + 1; //January is 0!
				var yyyy = vDate.getFullYear();
				if (dd < 10) dd = '0' + dd;
				if (mm < 10) mm = '0' + mm;
				return dd + '/' + mm + '/' + yyyy;
			}

			function convertDateFromString(pStrDate) {
				var parts = pStrDate.split('/');
				return new Date(parts[2], parts[1] - 1, parts[0]);
			}

			return _publicFunctions;
		}
	]);
