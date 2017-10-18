angular.module('mainApp')
    .controller('watchListController', ['$scope', 'Main', '$http', 'itemsWatchingSrv', function ($scope, Main, $http, itemsWatchingSrv) {
        $scope.itemsWatching = [];
        $scope.itemsWatching = itemsWatchingSrv.getProducts();
        $scope.unWatch = function (item) {
            Main.unWatch(item, (data) => {
                $scope.message = data;
                if (itemsWatchingSrv.remove(item) == -1)
                    alert("something went wrong while deleting the item from your watchlist.");
            });
        };
    }]);