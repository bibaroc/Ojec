angular.module('mainApp')
    .controller('cartController', ['$http', '$scope', 'Main', 'cartSrv', function ($http, $scope, Main, cartSrv, ) {
        $scope.items = cartSrv.getProducts();
        $scope.totalCost = function () {
            var money = 0;
            $scope.items.forEach(function (element) {
                money += element.item.price * element.qntt;
            });
            return money;
        };
        $scope.removeItem = function (item) {
            $http.post("http://localhost:8080/user/updateItem", { "id": item.item._id, "flag": "d" })
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
            $http.post("http://localhost:8080/user/updateItem", { "id": item.item._id, "flag": "u", "qnt": item.qntt })
                .then(function successCallback(response) {
                    if (!response.data.success) {
                        alert(response.data.msg);
                    }
                    else console.log(response.data.msg);
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };

    }]);