angular.module('mainApp')
    .controller('frontPageController', ['$scope', '$location', 'Main', '$http', 'cartSrv', function ($scope, $location, Main, $http, cartSrv) {
        "use strict";
        $scope.pageN = 1;
        $scope.sear = "";
        $scope.orderBy = "-d";
        $scope.itemsPP = 10;
        var f = function () {
            Main.getItems({
                "page": $scope.pageN,
                "name": $scope.sear,
                "order": $scope.orderBy,
                "itemPP": $scope.itemsPP
            }, (data) => {
                // console.log(data);
                $scope.items = data.data;
                $scope.pageN = data.metadata.pageN;
                $scope.tot = data.metadata.totalResults;
                $scope.pPossibl = Math.ceil(data.metadata.totalResults / $scope.itemsPP);
            });
        };

        f();
        $scope.look = f;
        $scope.rese = function () { $scope.pageN = 1; f(); }
        $scope.prev = function () { $scope.pageN -= 1; f(); };
        $scope.next = function () { $scope.pageN += 1; f(); };
        $scope.skip = function (integ) { $scope.pageN = integ; f(); };
        $scope.chan = function (integ) { $scope.itemsPP = integ; $scope.pageN = 1; f(); }
        // "success": true,
        // "msg": "Ya itemz bra.",
        // "data": fuckingItems,
        // "metadata": {
        //     "totalResults": objectsFound,
        //     "pageN": pageServed
        // }

        $scope.rerout = (item) => {
            $location.path("/product/" + item._id);
        };
        $scope.addToCart = (item) => {
            $http.post("/user/addToCart", { "id": item._id, "qnt": 1 })
                .then(function successCallback(response) {
                    if (response.data.success) {
                        cartSrv.remove(item);
                        cartSrv.addProduct(item, response.data.n);
                    }
                    else {
                        alert(response.data.msg);
                    }
                }, function errorCallback(response) {
                    // alert("Something went wrong.")
                });
        };
    }]);