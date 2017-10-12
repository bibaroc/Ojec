angular.module('mainApp')
    .controller('productPageController', ['$scope', 'Main', '$window', function ($scope, Main, $window) {
        var data = {
            'id': $window.location.href.split("/product/")[1]
        };
        Main.getItems(data, (responseData) => {
            $scope.item = responseData;
        });

    }]);