angular.module('mainApp')
    .controller('productPageController', ['$scope', 'Main', '$window', '$http', 'itemsWatchingSrv', 'cartSrv', function ($scope, Main, $window, $http, itemsWatchingSrv, cartSrv) {
        //Fucking angularjs adding <option value="? undefined:undefined"> DONT TOUCH
        $scope.current = 0;
        $scope.chosen = 1;
        var size = 0;
        Main.getItems({ 'id': $window.location.href.split("/product/")[1] }, (responseData) => {
            $scope.item = responseData;
            size = responseData.img.length;
        });

        $scope.next = () => {
            if (++$scope.current == size) {
                $scope.current = 0;
            }
        };
        $scope.addToCart = () => {
            $http.post("http://localhost:8080/user/addToCart", { "id": $window.location.href.split("/product/")[1], "qnt": $scope.chosen })
                .then(function successCallback(response) {
                    if (response.data.success){
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
            $http.post("http://localhost:8080/user/addToWishist", { "id": $window.location.href.split("/product/")[1] })
                .then(function successCallback(response) {
                    if (response.data.success)
                        itemsWatchingSrv.addProduct($scope.item);
                    $scope.watchingMsg = response.data.msg;
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };

        $('.thumb img').click(function(){
            $('.largeImg').attr('src',$(this).attr('src').replace('thumb','large'));
        });
    }]);