angular.module('mainApp')
    .controller('productPageController', ['$scope', 'Main', '$window', function ($scope, Main, $window) {
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
    }]);