var app = angular.module('mainApp')
    .factory('Main', ['$http', function ($http) {
        var baseUrl = "localhost:8080";
        return {
            signin: function (data, success, error) {
                $http({
                    "method": "POST",
                    "url": "http://localhost:8080/signin",
                    "data": {
                        "email": data.email,
                        "password": data.password
                    }
                }).then(function success(res) {
                    alert(res.data.success + "   " + res.data.msg);
                    if (res.data.token)
                        alert(res.data.token);
                }
                    );
            },
            signup: function (data, success, error) {
                $http.post(baseUrl + '/signup', data);
            }
        };
    }]);