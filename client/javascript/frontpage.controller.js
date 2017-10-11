angular.module('mainApp')
    .controller('frontPageController', ['$scope', 'Main', function ($scope, Main) {
        Main.getItems(null, (data) => {
            console.log(data);
            $scope.items = data;
        });

    }]);