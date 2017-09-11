angular.module('mainApp', ['ngStorage'])
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        alert("fagot, imma store log in controller");
        $scope.submit = () => {
            var data = {
                "email": $scope.email,
                "password": $scope.password
            };
            console.log(data);
            Main.signin(data);
            alert("submitted");
        };
    }])

.config(['$httpProvider', function ($httpProvider) {

  //  $routeProvider.
    //    when('/', {
   //         templateUrl: 'partials/home.html',
     //       controller: 'HomeCtrl'
       // }).
        //when('/signin', {
         //   templateUrl: 'partials/signin.html',
         //   controller: 'HomeCtrl'
        //}).
        //when('/signup', {
           // templateUrl: 'partials/signup.html',
         //   controller: 'HomeCtrl'
        //}).
        //when('/me', {
        //    templateUrl: 'partials/me.html',
        //    controller: 'HomeCtrl'
        //}).
        //otherwise({
        //    redirectTo: '/'
        //});

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
            return {
                'request': function (config) {
                    config.headers = config.headers || {};
                    if ($localStorage.ojecToken) {
                        config.headers.Authorization = 'Bearer ' + $localStorage.ojecToken;
                    }
                    return config;
                },
                'responseError': function(response) {
                    if(response.status === 401 || response.status === 403) {
                        $location.path('/signin');
                    }
                    return $q.reject(response);
                }
            };
        }]);

    }
]);
