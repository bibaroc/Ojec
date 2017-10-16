angular.module('mainApp')
    .controller('productPageController', ['$scope', 'Main', '$window', '$http', function ($scope, Main, $window, $http) {
        $scope.current = 0;
        var size = 0;
        Main.getItems({ 'id': $window.location.href.split("/product/")[1] }, (responseData) => {
            $scope.item = responseData;
            size = responseData.img.length;
            // console.log(responseData.img);
            // console.log(responseData.img.length);
        });

        $scope.next = () => {
            if (++$scope.current == size) {
                $scope.current = 0;
            }
        };

        $scope.addToWishist = () => {
            $http.post("http://localhost:8080/user/addToWishist", { "id": $window.location.href.split("/product/")[1] })
                .then(function successCallback(response) {
                    $scope.added = response.data.msg;
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };
    }]);