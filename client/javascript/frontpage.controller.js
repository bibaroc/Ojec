angular.module('mainApp')
    .controller('frontPageController', ['$scope', '$location', 'Main', '$http','itemsWatchingSrv', 'cartSrv', function ($scope, $location, Main, $http, itemsWatchingSrv, cartSrv) {
        Main.getItems(null, (data) => {
            $scope.items = data;
        });
        $scope.rerout = (item) => {
            $location.path("/product/" + item._id);
        }
        $scope.addToCart = (id) => {
            $http.post("http://localhost:8080/user/addToCart", { "id": id, "qnt": $scope.chosen })
                .then(function successCallback(response) {
                    if (response.data.success)
                        itemsWatchingSrv.addProduct($scope.item);
                    $scope.cartMsg = response.data.msg;
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });

        };
    }]);