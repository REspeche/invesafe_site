mainApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('login', {
                url         : '/login',
                templateUrl : 'templates/partials/login/login.html',
                controller  : 'loginController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/login/login.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('verify-login', {
                url         : '/verify-login',
                templateUrl : 'templates/partials/login/verify-login.html',
                controller  : 'verifyLoginController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/login/verify-login.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'load-screen'
                }
            })
            .state('forgot', {
                url         : '/forgot',
                templateUrl : 'templates/partials/login/forgot.html',
                controller  : 'forgotController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/login/forgot.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('changepass', {
                url         : '/changepass',
                templateUrl : 'templates/partials/login/changepass.html',
                controller  : 'changePassController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/login/changepass.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('activeaccount', {
                url         : '/activeaccount',
                templateUrl : 'templates/partials/account/activeaccount.html',
                controller  : 'activeAccountController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/account/activeaccount.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('sign-up', {
                url         : '/sign-up',
                templateUrl : 'templates/partials/login/signup.html',
                controller  : 'signUpController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/login/signup.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('error-login', {
                url         : '/error-login',
                templateUrl : 'templates/partials/login/error-login.html',
                access: {
                  isFree: true
                }
            })
            .state('redirect-external', {
                url         : '/redirect-external/:page',
                templateUrl : 'templates/partials/login/redirect-external.html',
                controller  : 'redirectExternalController',
                params: {
                    page: null,
                    url: null,
                    backurl: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/login/redirect-external.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'load-screen'
                }
            })
            .state('panel', {
                url         : '/panel',
                templateUrl : 'templates/partials/panel/panel.html',
                controller  : 'panelController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/panel/panel.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('account/details', {
                url         : '/account/details',
                templateUrl : 'templates/partials/account/details.html',
                controller  : 'profileController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/account/details.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('account/security', {
                url         : '/account/security',
                templateUrl : 'templates/partials/account/security.html',
                controller  : 'securityController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/account/security.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('account/password', {
                url         : '/account/password',
                templateUrl : 'templates/partials/account/password.html',
                controller  : 'accountController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/account/password.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('account/google-authenticator', {
                url         : '/account/google-authenticator',
                templateUrl : 'templates/partials/account/google_authenticator.html',
                controller  : 'googleAuthenticatorController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/account/google_authenticator.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('alerts', {
                url         : '/alerts',
                templateUrl : 'templates/partials/alert/alert.html',
                controller  : 'alertController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/alert/alert.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('contact', {
                url         : '/contact',
                templateUrl : 'templates/partials/contact/contact.html',
                controller  : 'contactController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/contact/contact.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects', {
                url         : '/projects',
                templateUrl : 'templates/partials/projects/projects.html',
                controller  : 'projectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/projects.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/form', {
                url         : '/projects/form/:action/:id',
                templateUrl : 'templates/partials/projects/project_form.html',
                controller  : 'projectFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/project_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('categories', {
                url         : '/categories',
                templateUrl : 'templates/partials/categories/categories.html',
                controller  : 'categoriesController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/categories/categories.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('categories/form', {
                url         : '/categories/form/:action/:id',
                templateUrl : 'templates/partials/categories/category_form.html',
                controller  : 'categoryFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/categories/category_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/general', {
                url         : '/settings/general',
                templateUrl : 'templates/partials/settings/general.html',
                controller  : 'settingsGeneralFormController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/general.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/limits', {
                url         : '/settings/limits',
                templateUrl : 'templates/partials/settings/limits.html',
                controller  : 'settingsLimitsFormController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/limits.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/payment', {
                url         : '/settings/payment',
                templateUrl : 'templates/partials/settings/payment.html',
                controller  : 'settingsPaymentFormController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/payment.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/social', {
                url         : '/settings/social',
                templateUrl : 'templates/partials/settings/social.html',
                controller  : 'settingsSocialFormController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/social.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/pages', {
                url         : '/settings/pages',
                templateUrl : 'templates/partials/settings/pages.html',
                controller  : 'settingsPagesController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/pages.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/pages/form', {
                url         : '/settings/pages/form/:action/:id',
                templateUrl : 'templates/partials/settings/pages_form.html',
                controller  : 'settingsPagesFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/pages_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/sponsors', {
                url         : '/settings/sponsors',
                templateUrl : 'templates/partials/settings/sponsors.html',
                controller  : 'settingsSponsorsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/sponsors.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('settings/sponsors/form', {
                url         : '/settings/sponsors/form/:action/:id',
                templateUrl : 'templates/partials/settings/sponsors_form.html',
                controller  : 'settingsSponsorsFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/settings/sponsors_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/favorite', {
                url         : '/projects/favorite',
                templateUrl : 'templates/partials/projects/favorite.html',
                controller  : 'favoriteProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/favorite.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/deals', {
                url         : '/projects/deals',
                templateUrl : 'templates/partials/projects/deals.html',
                controller  : 'dealsProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/deals.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('orders/purchase', {
                url         : '/orders/purchase',
                templateUrl : 'templates/partials/orders/purchase.html',
                controller  : 'purchaseProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/orders/purchase.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('members', {
                url         : '/members',
                templateUrl : 'templates/partials/members/members.html',
                controller  : 'membersController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/members/members.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('members/form', {
                url         : '/members/form/:action/:id',
                templateUrl : 'templates/partials/members/members_form.html',
                controller  : 'membersFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/members/members_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/reported', {
                url         : '/projects/reported',
                templateUrl : 'templates/partials/projects/reported.html',
                controller  : 'reportedProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/reported.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/questions', {
                url         : '/projects/questions',
                templateUrl : 'templates/partials/projects/questions.html',
                controller  : 'questionsProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/questions.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/invested', {
                url         : '/projects/invested',
                templateUrl : 'templates/partials/projects/invested.html',
                controller  : 'investedProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/invested.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('projects/tosponsor', {
                url         : '/projects/tosponsor',
                templateUrl : 'templates/partials/projects/tosponsor.html',
                controller  : 'tosponsorProjectsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/tosponsor.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('events', {
                url         : '/events',
                templateUrl : 'templates/partials/events/events.html',
                controller  : 'eventsController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/events/events.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('events/form', {
                url         : '/events/form/:action/:id',
                templateUrl : 'templates/partials/events/event_form.html',
                controller  : 'eventFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/events/event_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('account/id-verification', {
                url         : '/account/id-verification',
                templateUrl : 'templates/partials/account/id_verification.html',
                controller  : 'idVerificationController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/account/id_verification.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('portfolio', {
                url         : '/portfolio',
                templateUrl : 'templates/partials/projects/portfolio.html',
                controller  : 'portfolioController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects/portfolio.js'
                            ]
                        }]);
                    }]
                }
            });

        $urlRouterProvider.otherwise('/verify-login'); //page by default

        $ocLazyLoadProvider.config({
            name: 'mainApp',
            cssFilesInsertBefore: 'ng_load_plugins_before',
            debug: true,
            events: true,
            loadedModules:['MyApp']
        });

    }]);
