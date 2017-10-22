angular.module('mainApp')
    .controller('userController', ['$scope', '$localStorage', 'Main', '$http', 'itemsWatchingSrv', 'itemsSellingSrv', 'cartSrv', function ($scope, $localStorage, Main, $http, itemsWatchingSrv, itemsSellingSrv, cartSrv) {
        if ($localStorage.ojecToken) {
            $scope.logged = true;
            Main.getUserData(function gotta(data) {
                var user = {
                    "name": data.user.name,
                    "lastName": data.user.lastName,
                    "email": data.user.email,
                    "admin": data.user.admin
                }
                $scope.user = user;
                if (itemsWatchingSrv.getProducts().length === 0)
                    angular.forEach(data.user.itemsWatching, function (item) {
                        Main.getItems({ "id": item }, (data) => {
                            itemsWatchingSrv.addProduct(data);
                        });
                    });
                // $scope.itemsWatching = itemsWatchingSrv.getProducts;
                // console.log(itemsWatching);
                if (data.user.admin && itemsSellingSrv.getProducts().length === 0) {
                    angular.forEach(data.user.itemsSelling, function (item) {
                        Main.getItems({ "id": item }, (data) => {
                            itemsSellingSrv.addProduct(data);
                        });
                    });
                }
                if (cartSrv.getProducts().length === 0) {
                    angular.forEach(data.user.cart, function (item) {
                        Main.getItems({ "id": item }, (data) => {
                           cartSrv.addProduct(data);
                        });
                    });
                }
            });
        } else {
            $scope.logged = false;
            $scope.user = {
                "name": "undefined"
            }
        }
        $scope.popup = false;

        $scope.logout = () => {
            Main.logout();
        };
    }]);