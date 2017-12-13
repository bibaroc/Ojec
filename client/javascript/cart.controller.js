angular.module('mainApp')
    .controller('cartController', ['$http', '$scope', '$window', 'cartSrv', function ($http, $scope, $window, cartSrv) {
        "use strict";
        $scope.items = cartSrv.getProducts();
        $scope.totalCost = function () {
            var money = 0;
            $scope.items.forEach(function (element) {
                money += element.item.price * element.qntt;
            });
            return money;
        };
        $scope.removeItem = function (item) {
            $http.post("/user/updateItem", { "id": item.item._id, "flag": "d" })
                .then(function successCallback(response) {
                    if (response.data.success) {
                        cartSrv.remove(item.item);
                        $scope.msg = response.data.msg;
                    } else
                        alert(response.data.msg);
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };
        $scope.updateItem = function (item) {
            $http.post("/user/updateItem", { "id": item.item._id, "flag": "u", "qnt": item.qntt })
                .then(function successCallback(response) {
                    if (!response.data.success) {
                        alert(response.data.msg);
                    }
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };
        $scope.buy = function () {
            $http.post("/user/buy")
                .then(function successCallback(response) {
                    alert(response.data.msg);
                    if (response.data.success) {
                        cartSrv.reset();
                        $window.location.href = '#!/index.html';
                        // $window.location.reload();
                    }
                }, function errorCallback(response) {
                    alert(JSON.stringify(response.data));
                });
        };

    }]);