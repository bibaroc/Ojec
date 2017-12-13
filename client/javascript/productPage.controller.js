angular.module('mainApp')
    .controller('productPageController', ['$scope', 'Main', '$window', '$http', 'itemsWatchingSrv', 'cartSrv', function ($scope, Main, $window, $http, itemsWatchingSrv, cartSrv) {
        "use strict";
        //Fucking angularjs adding <option value="? undefined:undefined"> DONT TOUCH
        $scope.chosen = 1;
        //I know this is ugly, i dont even care
        var imges = [];
        Main.getItems({ 'id': $window.location.href.split("/product/")[1] }, (responseData) => {
            $scope.item = responseData.data;
            $scope.selected = responseData.data.img[0];
            imges = responseData.data.img;
        });
        $scope.addToCart = () => {
            $http.post("/user/addToCart", { "id": $window.location.href.split("/product/")[1], "qnt": $scope.chosen })
                .then(function successCallback(response) {
                    if (response.data.success) {
                        cartSrv.remove($scope.item);
                        cartSrv.addProduct($scope.item, response.data.n);
                    }
                    // cartSrv.addProduct($scope.item, $scope.chosen);
                    $scope.cartMsg = response.data.msg;
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });

        };
        $scope.addToWishist = () => {
            $http.post("/user/addToWishist", { "id": $window.location.href.split("/product/")[1] })
                .then(function successCallback(response) {
                    if (response.data.success)
                        itemsWatchingSrv.addProduct($scope.item);
                    $scope.watchingMsg = response.data.msg;
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };
        $scope.select = function (int) {
            $scope.selected = imges[int > imges.length - 1 ? 0 : int];
        }
    }]);