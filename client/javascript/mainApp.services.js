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
                            alert(response.data.msg);
                            $window.location.href = '#!/user.html';
                        }
                    }, function errorCallback(response) {
                        alert("Something went wrong.")
                    });
            },
            getItems: (query, callback) => {
                //No query
                if (!query) {
                    $http.post(baseUrl + 'getItems')
                        .then((successResponse) => {
                            if (successResponse.data.data) {
                                callback(successResponse.data.data);
                            }
                        }, (errorResponse) => {
                        });
                }
                //Some query
                else {
                    $http.post(baseUrl + 'getItems', query)
                        .then((successResponse) => {
                            if (successResponse.data.data) {
                                callback(successResponse.data.data);
                            }
                        }, (errorResponse) => {
                        });
                }
            },
            unWatch: (item, callback) => {
                $http.post(baseUrl + 'user/unwatch', {"id":item._id})
                    .then((successResponse) => {
                        if (successResponse.data.msg) {
                            callback(successResponse.data.msg);
                        }
                    }, (errorResponse) => {
                    });
            }
        };
    }])
    .service('productService', function () {
        var productList = [];

        var addProduct = function (newObj) {
            productList.push(newObj);
        };

        var getProducts = function () {
            return productList;
        };

        return {
            addProduct: addProduct,
            getProducts: getProducts
        };

    });