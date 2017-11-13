angular.module('mainApp')
    .controller('frontPageController', ['$scope', '$location', 'Main', '$http','cartSrv', 'cartSrv', function ($scope, $location, Main, $http, cartSrv, cartSrv) {
        Main.getItems(null, (data) => {
            $scope.items = data;
        });
        $scope.rerout = (item) => {
            $location.path("/product/" + item._id);
        }
        $scope.addToCart = (item) => {
            $http.post("http://localhost:8080/user/addToCart", { "id": item._id, "qnt": $scope.chosen })
                .then(function successCallback(response) {
                    if (response.data.success)
                    cartSrv.remove(item);
                    cartSrv.addProduct(item, response.data.n);
                    $scope.cartMsg = response.data.msg;
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });

        };
    }]);