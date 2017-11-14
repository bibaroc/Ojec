angular.module('mainApp')
    .controller('aboutController', ['$http', '$scope', function ($http, $scope) {
        $http.get("http://localhost:8080/getSellers")
            .then(function successCallback(response) {
                if (response.data.success) {
                    $scope.sellers = response.data.sellers;
                }
            }, function errorCallback(response) {
                alert("Something went wrong.")
            });

    }]);