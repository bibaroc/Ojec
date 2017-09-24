var app = angular.module('mainApp')
    .factory('Main', ['$http', '$localStorage', '$window', function ($http, $localStorage, $window) {
        var baseUrl = 'http://localhost:8080/';
        return {
            signin: function (data, success, error) {
                $http({
                    'method': 'POST',
                    'url': baseUrl + 'signin',
                    'data': {
                        'email': data.email,
                        'password': data.password
                    }
                }).then(function successCallback(response) {
                    if (response.data.token) {
                        console.log(response.data.token);
                        $localStorage.ojecToken = response.data.token;
                        $window.location.href = '/index.html';
                    }
                }, function errorCallback(response) {
                    alert("Wrong email or password.")
                });
            },
            signup: function (data, success, error) {
                $http({
                    'method': 'POST',
                    'url': baseUrl + 'signup',
                    'data': {
                        'name': data.name,
                        'lastName': data.lastName,
                        'email': data.email,
                        'password': data.password
                    }
                }).then(function successCallback(response) {
                    if (response.data.token) {
                        console.log(response.data.token);
                        $localStorage.ojecToken = response.data.token;
                        $window.location.href = '/index.html';
                    }
                }, function errorCallback(response) {
                    alert("Something went wrong.")
                });
            }
        };
    }]);