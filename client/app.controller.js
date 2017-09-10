angular.module('mainApp', [])
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        alert("fagot, imma store log in controller");
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