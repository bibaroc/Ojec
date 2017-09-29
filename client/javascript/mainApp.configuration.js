angular.module('mainApp')
    .config(['$httpProvider', '$locationProvider', '$routeProvider', function ($httpProvider, $locationProvider, $routeProvider) {

        $routeProvider
            .when('/signup', {
                templateUrl: '/partials/signup.html',
                controller: 'signUpController'
            })
            .when('/user', {
                templateUrl: '/partials/user.html',
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
                      $location.path('/signin');
                   }
                  return $q.reject(response);
               }
           };
         }]);

    }
    ]);
