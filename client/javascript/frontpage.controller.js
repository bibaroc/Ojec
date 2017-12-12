angular.module('mainApp')
    .controller('frontPageController', ['$scope', '$location', 'Main', '$http', 'cartSrv', function ($scope, $location, Main, $http, cartSrv) {
        "use strict";
        Main.getItems(null, (data) => {
            $scope.items = data;
        });
        $scope.rerout = (item) => {
            $location.path("/product/" + item._id);
        };
        $scope.addToCart = (item) => {
            $http.post("/user/addToCart", { "id": item._id, "qnt": 1 })
                .then(function successCallback(response) {
                    if (response.data.success) {
                        cartSrv.remove(item);
                        cartSrv.addProduct(item, response.data.n);
                    }
                   else {
                       alert(response.data.msg);
                   }
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });

        };
    }]);