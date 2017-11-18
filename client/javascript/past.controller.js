angular.module('mainApp')
    .controller('pastController', ['$scope', 'pastSrv', function ($scope, pastSrv) {
        "use strict";
        $scope.items = pastSrv.getProducts();

        $scope.gdate = (integer) => {
            return (new Date(integer)).toDateString();
        };
    }]);