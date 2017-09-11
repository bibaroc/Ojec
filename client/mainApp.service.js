var app = angular.module('mainApp')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
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
                    if (res.data.token)
                        $localStorage.ojecToken = res.data.token;
					else 
				        console.log("One day, I don't know why the server crashed, no mater how hard I tried.");
                }
                    );
            },
            signup: function (data, success, error) {
                $http.post(baseUrl + '/signup', data);
            }
        };
    }]);