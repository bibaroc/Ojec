angular.module('mainApp')
    .controller('meController', ['$scope', '$localStorage', 'Main', 'productService', function ($scope, $localStorage, Main, productService) {
        if ($localStorage.ojecToken) {
            $scope.logged = true;
            Main.getUserData(function gotta(data) {
                var user = {
                    "name": data.user.name,
                    "lastName": data.user.lastName,
                    "email": data.user.email,
                    "itemsWatching": data.user.itemsWatching,
                    "itemsSelling": data.user.itemsSelling,
                    "admin": data.user.admin
                }
                $scope.user = user;
                // console.log(data.user.itemsWatching);
                // angular.forEach(data.user.itemsWatching, function (key, value) {
                // productService.addProduct(value + '  ' + key);
                // });
                // console.log(productService.getProducts());
                var itemsWatching = [];
                angular.forEach(data.user.itemsWatching, function (item) {
                    Main.getItems({ "id": item }, (data) => {
                        itemsWatching.push(data);
                    });
                });
                $scope.itemsWatching = itemsWatching;
                console.log(itemsWatching);
            });
        } else {
            $scope.logged = false;
        }
        $scope.user = {
            "name": "undefined"
        }
        $scope.popup = false;

        $scope.unWatch = function (item) {
            alert("unwaching");
            Main.unWatch(item, (data) => {
                $scope.message = data;
            });

        };

        $scope.logout = () => {
            Main.logout();
        }
    }]);