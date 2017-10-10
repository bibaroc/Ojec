angular.module('mainApp')
    .controller('sellItem', ['$scope', 'Main', function ($scope, Main) {
        $scope.postItem = () => {
            var fd = new FormData();
            angular.forEach($scope.fileArray, (item) => {
                fd.append('file', item);
            })
            fd.append("name", $scope.itemName);
            fd.append("description", $scope.itemDescription);
            fd.append("price", $scope.itemPrice);
            fd.append("weight", $scope.itemWeight);
            fd.append("quantity", $scope.itemQuantity);
            Main.postProduct(fd);
        };
    }]);

