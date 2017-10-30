angular.module('mainApp')
    .controller('productPageController', ['$scope', 'Main', '$window', '$http', 'itemsWatchingSrv', function ($scope, Main, $window, $http, itemsWatchingSrv) {
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
    }]);