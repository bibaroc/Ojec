var app = angular.module('mainApp')
    .factory('Main', ['$http', '$localStorage', function ($http, $localStorage) {
        var baseUrl = 'http://localhost:8080';
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
                    // this callback will be called asynchronously
                    // when the response is available
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            },
            signup: function (data, success, error) {
                $http.post(baseUrl + '/signup', data);
            }
        };
    }]);