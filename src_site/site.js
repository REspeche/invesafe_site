mainApp.controller('siteController', ['$scope', 'mainSvc', '$rootScope', 'actionSvc', 'authenticationSvc', 'BASE_URL', 'modalSvc', '$translate', '$q', '$timeout', '$location', 'cartSvc', 'alertSvc',
	function ($scope, mainSvc, $rootScope, actionSvc, authenticationSvc, BASE_URL, modalSvc, $translate, $q, $timeout, $location, cartSvc, alertSvc) {
		$scope.yearCopy = new Date().getFullYear();
		$scope.pathProfile = BASE_URL.api + '/v1/common/viewFile?type=profile&file=';
		$scope.countryCode = '';
		$scope.searchCriteria = '';
		$rootScope.itemRoute = '';
		$rootScope.counters = {};
		$scope.formSubscribe = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };

		$scope.loadSite = function () {
			/* Scroll top */
			$scope.scrollTop();

			var arrRoutes = $location.url().split('?')[0].split('/');
			$rootScope.itemRoute = arrRoutes[arrRoutes.length - 1];

			$.get("https://extreme-ip-lookup.com/json/", function (response) {
				$scope.countryCode = angular.copy(response.countryCode);
			}, "jsonp");

			$scope.$on('$viewContentLoaded', function () {
				if ($("#load_screen").length == 1) {
					$("#load_screen").delay(1000).fadeOut(function () {
						$('body').addClass('enable-scroll');
						$("#load_screen").remove();
					});
				}
			});

			$scope.runExtraActions(); //open modals or other functions when refresh page
		};

		$scope.scrollTop = function() {
			$('html, body').animate({
			  scrollTop:0
			});
		};

		$scope.runExtraActions = function () {
			switch (getQueryStringValue('modal', '')) {
				case 'login':
				case 'password':
					$scope.showLogin();
					break;
				case 'signup':
					$scope.showSignUp();
					break;
				case 'changepass':
					$scope.showChangePass();
					break;
				default:
					if ($rootScope.itemRoute == 'activeaccount') {
						$scope.runActiveAccount();
					};
					break;
			};
		};

		$scope.runActiveAccount = function () {
			mainSvc.callService({
				url: 'auth/activeaccount',
				params: {
					'email': getQueryStringValue('email', ''),
					'hash': getQueryStringValue('hash', ''),
					'isSite': 1
				},
				secured: false
			}).then(function (response) {
				if (response.token) {
					authenticationSvc.saveLogin({
						id: response.id,
						email: response.email,
						token: response.token,
						type: response.type,
						name: response.name,
						forceProfile: response.forceProfile,
						role: response.role,
						avatar: response.avatar
					});
					$scope._forceProfile = response.forceProfile;
					alertSvc.showAlertByCode(5);
					setTimeout(function () {
						$scope.showWelcomeSignUp();
					}, 2000);
				} else {
					alertSvc.showAlertByCode(310);
				};
				setQuery({});
				actionSvc.goToAction(101);
			});
		}

		$scope.clickAction = function (action, param) {
			$scope.searchCriteria = '';
			actionSvc.goToAction(action, param);
		};

		$scope.clickItemMenu = function (action) {
			actionSvc.goToDashboard(action);
		};

		$scope.clickShowLogin = function () {
			setQuery({
				modal: 'login'
			});
			$scope.showLogin();
		}

		$scope.clickSignUp = function () {
			setQuery({
				modal: 'signup'
			});
			$scope.showSignUp();
		}

		$scope.signUp = function () {
			actionSvc.goToDashboard(4); // go to signup
		}

		$scope.showWelcomeSignUp = function () {
			modalSvc.showModal({
				templateUrl: '/templates/modals/modalWelcomeSignUp.html',
				size: 'xl'
			}, {
				closeButtonText: undefined,
				defer: true,
				beforeClose: function (scope) {
					var defered = $q.defer();
					var promise = defered.promise;

					if (authenticationSvc.login().isLogin) {
						mainSvc.callService({
							url: 'auth/welcomeUnderstand',
							params: {
								'usrId': $rootScope.userInfo.id
							}
						}).then(function (response) {
							defered.resolve(true);
						});
					} else {
						defered.resolve(true);
					}

					return promise;
				}
			});
		}

		$scope.showLogin = function () {
			modalSvc.showModal({
				templateUrl: '/templates/modals/modalLogin.html'
			}, {
				closeButtonText: undefined,
				formDataLogin: {
					email: '',
					password: '',
					remember: false,
					isForgot: false
				},
				showValidateMsg: false,
				forgot: function (modalOptions) {
					setQuery({
						modal: 'password'
					});
					modalOptions.formDataLogin.isForgot = true;
				},
				login: function (modalOptions) {
					setQuery({
						modal: 'login'
					});
					modalOptions.formDataLogin.isForgot = false;
				},
				hideAndShowSignUp: function (modalOptions) {
					modalOptions.close();
					setTimeout(function () {
						$scope.clickSignUp();
					}, 200);
				},
				sendMailValidate: function (modalOptions) {
					if (!modalOptions.formDataLogin.email || !modalOptions.formDataLogin.password) {
						alertSvc.showAlertByCode(104);
						return false;
					}
					if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(modalOptions.formDataLogin.email)) {
						alertSvc.showAlertByCode(204);
						return false;
					}
					mainSvc.callService({
						url: 'auth/validateagain',
						params: {
							'email': modalOptions.formDataLogin.email,
							'password': modalOptions.formDataLogin.password,
							'isSite': 1
						},
						secured: false
					}).then(function (response) {
						modalOptions.showValidateMsg = false;
						alertSvc.showAlertByCode(102);
					});
				},
				defer: true,
				afterOpen: function (scope) {
					$timeout(function () {
						let paramModal = getQueryStringValue('modal', '');
						if (paramModal == 'password') scope.modalOptions.formDataLogin.isForgot = true;
					}, 500);
				},
				beforeClose: function (scope) {
					var defered = $q.defer();
					var promise = defered.promise;

					if (!scope.modalOptions.formDataLogin.isForgot) {
						if (!scope.modalOptions.formDataLogin.email || !scope.modalOptions.formDataLogin.password) {
							alertSvc.showAlertByCode(100);
							defered.resolve(false);
						} else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(scope.modalOptions.formDataLogin.email)) {
							alertSvc.showAlertByCode(204);
							defered.resolve(false);
						} else {
							mainSvc.callService({
								url: 'auth/login',
								params: {
									'email': scope.modalOptions.formDataLogin.email,
									'password': scope.modalOptions.formDataLogin.password
								},
								secured: false
							}).then(function (response) {
								if (response.code == 200) {
									scope.modalOptions.formDataLogin.password = "";
								} else if (response.code == 209) {
									scope.modalOptions.showValidateMsg = true;
								} else {
									if (response.token) {
										authenticationSvc.saveLogin({
											id: response.id,
											email: response.email,
											token: response.token,
											type: response.type,
											name: response.name,
											forceProfile: response.forceProfile,
											role: response.role,
											rememberLogin: scope.modalOptions.formDataLogin.remember,
											avatar: response.avatar
										});
										if (authenticationSvc.login().isLogin) {
											defered.resolve(true);
											actionSvc.reload();
										}
									}
								}
							});
						};
					} else {
						if (!scope.modalOptions.formDataLogin.email) {
							alertSvc.showAlertByCode(101);
							defered.resolve(false);
						} else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(scope.modalOptions.formDataLogin.email)) {
							alertSvc.showAlertByCode(204);
							defered.resolve(false);
						} else {
							mainSvc.callService({
								url: 'auth/forgotsite',
								params: {
									'email': scope.modalOptions.formDataLogin.email
								},
								secured: false
							}).then(function (response) {
								alertSvc.showAlertByCode(102);
								defered.resolve(true);
							});
						}
					}
					return promise;
				},
				afterClose: function () {
					setQuery({});
				}
			});
		}

		$scope.showChangePass = function () {
			modalSvc.showModal({
				templateUrl: '/templates/modals/modalChangePass.html',
				size: 'md'
			}, {
				closeButtonText: undefined,
				formDataChange: {
					email: '',
					hash: '',
					password: '',
					passwordR: ''
				},
				defer: true,
				afterOpen: function (scope) {
					$timeout(function () {
						scope.modalOptions.formDataChange.email = getQueryStringValue('email', '');
						scope.modalOptions.formDataChange.hash = getQueryStringValue('hash', '');
					}, 500);
				},
				beforeClose: function (scope) {
					var defered = $q.defer();
					var promise = defered.promise;

					//Validations
					if (scope.modalOptions.formDataChange.password.length < 7) {
						alertSvc.showAlertByCode(222);
						defered.resolve(false);
					} else if (!scope.modalOptions.formDataChange.password || !scope.modalOptions.formDataChange.passwordR) {
						alertSvc.showAlertByCode(101);
						defered.resolve(false);
					} else if (scope.modalOptions.formDataChange.password != scope.modalOptions.formDataChange.passwordR) {
						alertSvc.showAlertByCode(201);
						defered.resolve(false);
					} else {
						mainSvc.callService({
							url: 'auth/changepass',
							params: {
								'email': scope.modalOptions.formDataChange.email,
								'hash': scope.modalOptions.formDataChange.hash,
								'password': scope.modalOptions.formDataChange.password
							},
							secured: false
						}).then(function (response) {
							if (response.token) {
								authenticationSvc.saveLogin({
									id: response.id,
									email: response.email,
									token: response.token,
									type: response.type,
									name: response.name,
									forceProfile: response.forceProfile,
									role: response.role,
									avatar: response.avatar
								});
								if (authenticationSvc.login().isLogin) {
									alertSvc.showAlertByCode(2);
									actionSvc.reload();
									defered.resolve(true);
									setTimeout(function () {
										$scope.showWelcomeSignUp();
									}, 2000);
								}
							}
						});
					};
					return promise;
				},
				afterClose: function () {
					setQuery({});
				}
			});
		}

		$scope.showSignUp = function () {
			modalSvc.showModal({
				templateUrl: '/templates/modals/modalSignUp.html',
				size: 'md'
			}, {
				closeButtonText: undefined,
				formDataSignUp: {
					type: 1,
					firstName: '',
					lastName: '',
					phone: '',
					email: '',
					countryCode: $scope.countryCode,
					password: '',
					passwordR: '',
					agree: false,
					usaCitizen: 1
				},
				showValidateMsg: false,
				hideAndShowLogin: function (modalOptions) {
					modalOptions.close();
					setTimeout(function () {
						$scope.clickShowLogin();
					}, 200);
				},
				signUpOtherProfile: function (modalOptions) {
					modalOptions.close();
					actionSvc.goToDashboard(4); // go to dashboard signup
				},
				selectType: function (type, modalOptions) {
					modalOptions.formDataSignUp.type = type;
				},
				defer: true,
				afterOpen: function (scope) {
					$timeout(function () {
						initializeTooltips();
					}, 500);
				},
				beforeClose: function (scope) {
					var defered = $q.defer();
					var promise = defered.promise;

					//Validations
					if (!scope.modalOptions.formDataSignUp.firstName || !scope.modalOptions.formDataSignUp.lastName || !scope.modalOptions.formDataSignUp.email || !scope.modalOptions.formDataSignUp.password || !scope.modalOptions.formDataSignUp.passwordR) {
						alertSvc.showAlertByCode(101);
						defered.resolve(false);
					} else if (scope.modalOptions.formDataSignUp.password.length < 7) {
						alertSvc.showAlertByCode(222);
						defered.resolve(false);
					} else if (scope.modalOptions.formDataSignUp.password != scope.modalOptions.formDataSignUp.passwordR) {
						alertSvc.showAlertByCode(201);
						defered.resolve(false);
					} else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(scope.modalOptions.formDataSignUp.email)) {
						alertSvc.showAlertByCode(204);
						defered.resolve(false);
					} else if (!scope.modalOptions.formDataSignUp.usaCitizen) {
						alertSvc.showAlertByCode(221);
						defered.resolve(false);
					} else if (scope.modalOptions.formDataSignUp.type==1 && scope.modalOptions.formDataSignUp.usaCitizen==3) {
						alertSvc.showAlertByCode(223);
						defered.resolve(false);
					} else {
						//Ajax send
						mainSvc.callService({
							url: 'auth/signUpSite',
							params: {
								'type': scope.modalOptions.formDataSignUp.type,
								'firstName': scope.modalOptions.formDataSignUp.firstName,
								'lastName': scope.modalOptions.formDataSignUp.lastName,
								'email': scope.modalOptions.formDataSignUp.email,
								'phone': scope.modalOptions.formDataSignUp.phone,
								'countryCode': scope.modalOptions.formDataSignUp.countryCode,
								'password': scope.modalOptions.formDataSignUp.password,
								'usaCitizen': scope.modalOptions.formDataSignUp.usaCitizen
							},
							secured: false
						}).then(function (response) {
							alertSvc.showAlertByCode(102);
							defered.resolve(true);
						});
					};
					return promise;
				},
				afterClose: function () {
					setQuery({});
				}
			});
		}

		$scope.logout = function () {
			modalSvc.showModal({
				size: 'sm'
			}, {
				closeButtonText: $translate.instant('BTN_NO'),
				actionButtonText: $translate.instant('BTN_YES'),
				bodyText: $translate.instant('MSG_CONFIRM_LOGOUT')
			}).then(function (result) {
				mainSvc.callService({
					url: 'auth/logout'
				}).then(function (response) {
					authenticationSvc.logout(true);
					actionSvc.reload();
				});
			});
		};

		$scope.showPreviousProperties = function() {
			/* Load list categories */
			mainSvc.callService({
				url: 'project/getProjectsSite',
				params: {
				  search: ''
				},
				secured: false
			}).then(function (response) {
			  $scope.lstProjects = angular.copy(response);
			  angular.forEach($scope.lstProjects, function(item, key){
				item.title1 = item.title.split('|')[0];
				item.title2 = item.title.split('|')[1];
			  });

			  // Open modal
			  modalSvc.showModal({
					templateUrl: '/templates/modals/modalPreviousProperties.html',
					size: 'xl'
				  }, {
					closeButtonText: undefined,
					lstProjects: $scope.lstProjects,
					defer: false,
					clickAction: function (modalOptions, item) {
					  actionSvc.goToAction(104, {id: item.id});
					  modalOptions.close();
					}
			  });
			});
		};

		$scope.hideAndShowLogin = function () {
			$('#modalSignUpForm').modal('hide');
			setTimeout(function () {
				$scope.showLogin();
			}, 500);
		}

		$scope.newProject = function () {
			if (authenticationSvc.getUserInfo().isLogin) {
				actionSvc.goToDashboard(10.1, {
					id: 0,
					action: 'new'
				}); //new project
			} else alertSvc.showAlertByCode(214);
		}

		$scope.searchProjects = function () {
			actionSvc.goToAction(109, {
				search: angular.copy($scope.searchCriteria)
			});
		};

		$scope.addCart = function(item) {
			var retAction = cartSvc.addItemCart({
				id       	  			: item.id,
				tokenPurchase			: item.tokenPurchase,
				assetTicketPrice		: item.assetTicketPrice,
				fees         			: 0,
				title		  				: (item.title)?item.title:item.address,
				image		  				: item.image,
				maxTokenPurchase	: item.maxTokenPurchase
			});
			switch (retAction) {
				case 1: alertSvc.showAlertByCode(6); break;
				case 2: alertSvc.showAlertByCode(7); break;
			}
		};

		$scope.viewDisclaimer = function() {
			window.open('/content/files/disclaimer-'+$rootScope.lang+'.pdf', '_blank');
		};

		$scope.toSubscribe = function () {
        var optAlert = { "positionClass": "toast-bottom-left" };
        if ($scope.formSubscribe.name != '' && $scope.formSubscribe.email != '') {
            $scope.isBusy = true;
            alertSvc.showAlert(optAlert).notifyInfo($translate.instant('MSG_BUSSY'));
						mainSvc.callService({
							url: 'common/subscribeNewsletters',
							params: $scope.formSubscribe,
							secured: false
						}).then(function (response) {
							if (response.code === 0) {
									$scope.formSubscribe = {
											name: '',
											email: '',
											phone: '',
											message: ''
									};
									alertSvc.showAlert(optAlert).notifySuccess($translate.instant('MSG_THANKS_SUSCRIBED'));
							}
							else {
									alertSvc.showAlert(optAlert).notifyError($translate.instant('MSG_ERROR_PROCESS'));
							}
						});
        }
        else alertSvc.showAlert(optAlert).notifyWarning($translate.instant('MSG_FIELD_INCOMPLETE'));
    }

    $scope.initCarrueselLogo = function (id) {
        var timer = 4000;

        var i = 0;
        var max = $("#" + id + " > li").length;

        $("#" + id + " > li").eq(i).addClass('active').css('left', '0');
        $("#" + id + " > li").eq(i + 1).addClass('active').css('left', '25%');
        $("#" + id + " > li").eq(i + 2).addClass('active').css('left', '50%');
        $("#" + id + " > li").eq(i + 3).addClass('active').css('left', '75%');


        setInterval(function () {
            $("#" + id + " > li").removeClass('active');

            $("#" + id + " > li").eq(i).css('transition-delay', '0.25s');
            $("#" + id + " > li").eq(i + 1).css('transition-delay', '0.5s');
            $("#" + id + " > li").eq(i + 2).css('transition-delay', '0.75s');
            $("#" + id + " > li").eq(i + 3).css('transition-delay', '1s');

            if (i < max - 4) {
                i = i + 4;
            }

            else {
                i = 0;
            }

            $("#" + id + " > li").eq(i).css('left', '0').addClass('active').css('transition-delay', '1.25s');
            $("#" + id + " > li").eq(i + 1).css('left', '25%').addClass('active').css('transition-delay', '1.5s');
            $("#" + id + " > li").eq(i + 2).css('left', '50%').addClass('active').css('transition-delay', '1.75s');
            $("#" + id + " > li").eq(i + 3).css('left', '75%').addClass('active').css('transition-delay', '2s');

        }, timer);
    }

	}
]);
