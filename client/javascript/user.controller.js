angular.module('mainApp')
    .controller('userController', ['$scope', '$localStorage', 'Main', '$http', function ($scope, $localStorage, Main, $http) {
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
                // console.log(itemsWatching);
                if (data.user.admin) {
                    var itemsSelling = [];
                    angular.forEach(data.user.itemsSelling, function (item) {
                        Main.getItems({ "id": item }, (data) => {
                            itemsSelling.push(data);
                        });
                    });
                    $scope.itemsSelling = itemsSelling;
                }
            });
        } else {
            $scope.logged = false;
            $scope.user = {
                "name": "undefined"
            }
        }
        $scope.popup = false;

        $scope.unWatch = function (item) {
            Main.unWatch(item, (data) => {
                $scope.message = data;
            });

        };

        $scope.deleteItem = (item) => {
            if (confirm("Are you sure you want to delete the insertion?")) {
                $http.post("http://localhost:8080/admin/deleteItem", { "id": item._id })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            alert(response.data.msg);
                            $scope.itemsSelling.splice($scope.itemsSelling.indexOf(item));
                        } else
                            alert(response.dat.msg);
                    }, function errorCallback(response) {
                        // alert("Something went wrong.")
                    });
            }
        };
        $scope.updateItemInfo = (item) => {
            if (confirm("Are you sure you want to update the insertion?")) {
                $http.post("http://localhost:8080/admin/updateItem",
                    {
                        "id": item._id,
                        "name": item.name,
                        "description": item.description,
                        "quantity": item.quantity,
                        "price": item.price,
                        "weight": item.weight
                    })
                    .then(function successCallback(response) {
                        alert(response.data.msg);
                    }, function errorCallback(response) {
                        // alert("Something went wrong.")
                    });
            }
        };
        $scope.logout = () => {
            Main.logout();
        };
    }]);