angular.module('mainApp')
    .config(['$httpProvider', '$locationProvider', '$routeProvider', function ($httpProvider, $locationProvider, $routeProvider) {

        $routeProvider
            .when('/signup', {
                templateUrl: '/partials/signup.html',
                controller: 'signInController'
            })
            .when('/user', {
                templateUrl: '/partials/user.html',
                controller: 'meController'
            })
            .when('/watchList', {
                templateUrl: 'partials/watchList.html',
                controller: 'meController'
            })
            .when('/addItemToSell', {
                templateUrl: '/partials/sellItem.html',
                controller: 'sellItem'
            })
            .when('/about', {
                templateUrl: '/partials/about.html'
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
                        $location.path('/404')
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
    ]);
