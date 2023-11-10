mainApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

        $stateProvider
            .state('home', {
                url         : '/',
                templateUrl : 'templates/partials/home.html',
                controller  : 'homeController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/home.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE | Real estate crowdfunding platform'
                }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'templates/partials/about.html',
                metadata: {
                    title: 'INVESAFE - About us'
                }
            })
            .state('careers', {
                url: '/careers',
                templateUrl: 'templates/partials/careers.html',
                metadata: {
                    title: 'INVESAFE - Careers'
                }
            })
            .state('changelog', {
                url: '/changelog',
                templateUrl: 'templates/partials/changelog.html',
                controller  : 'changeLogController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/changelog.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE - Chage log'
                }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'templates/partials/contact.html',
                controller  : 'contactController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/contact.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE - Contactß us'
                }
            })
            .state('developers', {
                url: '/developers',
                templateUrl: 'templates/partials/developers.html',
                controller  : 'developersController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/developers.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE - I\'m a Developer'
                }
            })
            .state('operative', {
                url: '/operative',
                templateUrl: 'templates/partials/operative.html',
                metadata: {
                    title: 'INVESAFE - How we working?'
                }
            })
            .state('privacy-policy', {
                url: '/privacypolicy',
                templateUrl: 'templates/partials/privacypolicy.html',
                controller  : 'privacyPolicyController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/privacypolicy.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE - Privacy Policy'
                }
            })
            .state('terms-of-use', {
                url: '/termsofuse',
                templateUrl: 'templates/partials/termsofuse.html',
                controller  : 'termsOfUseController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/termsofuse.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE - Terms of use'
                }
            })
            .state('accessibility-statement', {
                url: '/accessibilitystatement',
                templateUrl: 'templates/partials/accessibilitystatement.html',
                controller  : 'accessibilityStatementController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/accessibilitystatement.js'
                            ]
                        }]);
                    }]
                },
                metadata: {
                    title: 'INVESAFE - Accessibility statement'
                }
            })
            .state('projects', {
                url: '/projects',
                templateUrl: 'templates/partials/projects.html',
                controller  : 'projectsController',
                params: {
                  search: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/projects.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'marketplace-page'
                },
                metadata: {
                    title: 'INVESAFE - Marketplace'
                }
            })
            .state('project', {
                url: '/project/:id',
                templateUrl: 'templates/partials/project.html',
                controller  : 'projectController',
                params: {
                  id: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/project.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'project-page'
                }
            })
            .state('cart', {
                url         : '/cart',
                templateUrl : 'templates/partials/cart.html',
                controller  : 'cartController',
                params: {
                  search: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/cart.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'cart-page'
                },
                metadata: {
                    title: 'INVESAFE - Cart'
                }
            })
            .state('checkout', {
                url         : '/checkout',
                templateUrl : 'templates/partials/checkout.html',
                controller  : 'checkoutController',
                params: {
                  search: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/checkout.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'checkout-page'
                },
                metadata: {
                    title: 'INVESAFE - Checkout'
                }
            })
            .state('order-received', {
                url         : '/order-received/:id/:hash',
                templateUrl : 'templates/partials/order-received.html',
                controller  : 'orderReceivedController',
                params: {
                    id: null,
                    hash: null
                },
                params: {
                  search: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/order-received.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'checkout-page'
                }
            })
            .state('callback/coinbase', {
                url         : '/callback/coinbase',
                templateUrl : 'templates/partials/callback/coinbase.html',
                controller  : 'coinbaseController',
                params: {
                  search: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'content/assets/js/partials/callback/coinbase.js'
                            ]
                        }]);
                    }]
                },
                data: {
                    bodyClasses: 'checkout-page'
                }
            });

        $urlRouterProvider.otherwise('/'); //page by default

        $ocLazyLoadProvider.config({
            name: 'mainApp',
            cssFilesInsertBefore: 'ng_load_plugins_before',
            debug: true,
            events: true,
            loadedModules:['MyApp']
        });
    }]);
