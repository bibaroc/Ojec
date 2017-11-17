angular.module('mainApp')
    .controller('sellListController', ['$scope', 'Main', '$http', 'itemsSellingSrv', function ($scope, Main, $http, itemsSellingSrv) {
        "use strict";
        $scope.itemsSelling = itemsSellingSrv.getProducts();
       
        $scope.deleteItem = (item) => {
            if (confirm("Are you sure you want to delete the insertion?")) {
                $http.post("http://localhost:8080/admin/deleteItem", { "id": item._id })
                    .then(function successCallback(response) {
                        if (response.data.success) {
                            alert(response.data.msg);
                            itemsSellingSrv.remove(item);
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
                        alert(response.data.msg);
                    });
            }
        };

    }]);