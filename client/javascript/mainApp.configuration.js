angular.module('mainApp')
    .config(['$httpProvider', '$locationProvider', '$routeProvider', function ($httpProvider, $locationProvider, $routeProvider) {
        "use strict";
        $routeProvider
            .when('/signup', {
                templateUrl: '/partials/signup.html',
                controller: 'signInController'
            })
            .when('/user', {
                templateUrl: '/partials/user.html',
                controller: 'userController'
            })
            .when('/watchList', {
                templateUrl: 'partials/watchList.html',
                controller: 'watchListController'
            })
            .when("/itemsSelling", {
                templateUrl: "partials/itemsCurrentlySelling.html",
                controller: "sellListController"
            })
            .when('/cart', {
                templateUrl: '/partials/cart.html',
                controller: 'cartController'
            })
            .when('/addItemToSell', {
                templateUrl: '/partials/sellItem.html',
                controller: 'sellItem'
            })
            .when('/forgot', {
                templateUrl: 'partials/forgot.html'
            })
            .when('/about', {
                templateUrl: '/partials/about.html',
                controller : 'aboutController'
            })
            .when('/contact', {
                templateUrl: 'partials/contact.html'
            })
            .when('/frontpage', {
                templateUrl: 'partials/frontpage.html',
                controller: 'frontPageController'
            })
            .when('/product/:productID', {
                templateUrl: "partials/productPage.html",
                controller: "productPageController"
            })
            .when('/404', {
                template: "<h1>404 NON FOUND</h1>"
            })
            .when('/sell', {
                templateUrl: 'partials/sell.html'
            })
            .when('/past', {
                templateUrl: 'partials/past.html',
                controller : "pastController"
            })
            .otherwise({
                redirectTo: "/frontpage"
            });

        $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.ojecToken) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.ojecToken;
                    }
                    return config;
                },
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/signup');
                    } else if (response.status === 404) {
                        $location.path('/404');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
    ]);
