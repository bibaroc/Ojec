angular.module('mainApp')
    .controller('frontPageController', ['$scope', '$location', 'Main', function ($scope, $location, Main) {
        Main.getItems(null, (data) => {
            $scope.items = data;
        });
        $scope.rerout = (item) => {
            $location.path("/product/" + item._id);
        }
    }]);