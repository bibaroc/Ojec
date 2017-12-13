angular.module('mainApp')
    .controller('userController', ['$scope', '$localStorage', 'Main', '$http', 'itemsWatchingSrv', 'itemsSellingSrv', 'cartSrv', 'pastSrv', function ($scope, $localStorage, Main, $http, itemsWatchingSrv, itemsSellingSrv, cartSrv, pastSrv) {
        "use strict";
        if ($localStorage.ojecToken) {
            $scope.logged = true;
            Main.getUserData(function gotta(data) {
                var user = {
                    "name": data.user.name,
                    "lastName": data.user.lastName,
                    "email": data.user.email,
                    "admin": data.user.admin,
                    "itemsInCart": data.user.cart.length
                };
                $scope.user = user;
                if (itemsWatchingSrv.getProducts().length === 0) {
                    angular.forEach(data.user.itemsWatching, function (item) {
                        Main.getItems({ "id": item }, (data) => {
                            itemsWatchingSrv.addProduct(data.data);
                        });
                    });
                }
                if (cartSrv.getProducts().length === 0) {
                    angular.forEach(data.user.cart, function (item) {
                        Main.getItems({ "id": item.item }, (data) => {
                            cartSrv.addProduct(data.data, item.qnt);
                        });
                    });
                }
                // console.log(data.user);
                if (pastSrv.getProducts().length === 0) {
                    data.user.history.forEach(function (transaction) {
                        transaction.items.forEach(function (itemInTransaction) {
                            Main.getItems({ "id": itemInTransaction.item }, (data) => {
                                pastSrv.addProduct({
                                    "item": data.data,
                                    "qnt": itemInTransaction.qnt,
                                    "pricePerUnit": itemInTransaction.price,
                                    "date": transaction.date
                                });
                            });
                        });
                    });
                }
                if (data.user.admin && itemsSellingSrv.getProducts().length === 0) {
                    angular.forEach(data.user.itemsSelling, function (item) {
                        Main.getItems({ "id": item }, (data) => {
                            itemsSellingSrv.addProduct(data.data);
                        });
                    });
                }
                $scope.itemInCart = cartSrv.getProducts().length;
            });
        } else {
            $scope.logged = false;
            $scope.user = {
                "name": "undefined"
            };
        }
        $scope.logout = () => {
            Main.logout();
        };
    }]);