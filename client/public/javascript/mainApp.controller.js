angular.module('mainApp', ['ngStorage', 'ngMessages', 'ngRoute'])
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        $scope.submit = () => {
            var data = {
                "email": $scope.email,
                "password": $scope.password
            };
            console.log(data);
            Main.signin(data);
        };
    }])
    .controller('signUpController', ['$scope', 'Main', function ($scope, Main) {
        alert("sdfsd");
        $scope.submit = () => {
            var data = {
                "email": $scope.email,
                "password": $scope.password
            };
            console.log(data);
            Main.signin(data);
            alert("submitted");
        };
    }]);

