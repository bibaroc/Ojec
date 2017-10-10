angular.module('mainApp')
    .controller('signUpController', ['$scope', 'Main', function ($scope, Main) {
        $scope.signup = () => {
            var data = {
                'name': $scope.firstName,
                'lastName': $scope.lastName,
                'email': $scope.upemail,
                'password': $scope.uppassword
            };
            Main.signup(data);
        };
    }]);

