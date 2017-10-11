'use strict'
var app = angular.module('mainApp')
    .factory('Main', ['$http', '$localStorage', '$window', '$route', function ($http, $localStorage, $window, $route) {
        var baseUrl = 'http://localhost:8080/';
        return {
            signin: function (data, error) {
                $http.post(baseUrl + 'signin', data)
                    .then(function successCallback(response) {
                        if (response.data.token) {
                            $localStorage.ojecToken = response.data.token;
                            $window.location.href = '#!/index.html';
                            $window.location.reload();
                        } else {
                            error(response.data.msg);
                        }
                    }, function errorCallback(response) {
                        alert("Wrong email or password.")
                    });
            },
            signup: function (data, error) {
                $http.post(baseUrl + 'signup', data)
                    .then(function successCallback(response) {
                        if (response.data.token) {
                            $localStorage.ojecToken = response.data.token;
                            $window.location.href = '#!/index.html';
                            $window.location.reload();
                        } else {
                            error(response.data.msg);
                        }
                    }, function errorCallback(response) {
                        alert("Something went wrong.")
                    });
            },
            logout: function () {
                delete $localStorage.ojecToken;
                $window.location.href = '#!/index.html';
                $window.location.reload();
            },
            getUserData: function (callback) {
                $http.get(baseUrl + 'user/userInfo')
                    .then(function successCallback(response) {
                        if (response.data.user) {
                            callback(response.data);
                        }
                    }, function errorCallback(response) {
                        alert("Something went wrong.")
                    });
            },
            postProduct: function (data) {
                $http.post(baseUrl + 'admin/addProduct', data, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': 'Bearer ' + $localStorage.ojecToken
                    }
                })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            alert("success");
                            $window.location.href = '#!/user.html';
                        }
                    }, function errorCallback(response) {
                        alert("Something went wrong.")
                    });
            },
            getItems: (query, callback) => {
                if (!query) {
                    $http.get(baseUrl + 'getItems')
                        .then((successResponse) => {
                            if (successResponse.data.data) {
                                callback(successResponse.data.data);
                            }
                        }, (errorResponse) => {
                            alert("Something went wrong.")
                        });
                }



            }
        };
    }]);