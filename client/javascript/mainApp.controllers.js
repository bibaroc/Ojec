angular.module('mainApp')
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        $scope.submit = () => {
            var data = {
                'email': $scope.email,
                'password': $scope.password
            };
            console.log(data);
            Main.signin(data);
        };
    }])
    .controller('signUpController', ['$scope', 'Main', function ($scope, Main) {
        $scope.submit = () => {
            var data = {
                'name': $scope.firstName,
                'lastName': $scope.lastName,
                'email': $scope.email,
                'password': $scope.password
            };
            Main.signup(data);
        };
    }])
    .controller('me', ['$scope', 'Main', function ($scope, Main) {
        $scope.submit = () => {
            var data = {
                'name': $scope.firstName,
                'lastName': $scope.lastName,
                'email': $scope.email,
                'password': $scope.password
            };
            Main.signup(data);
        };
    }])

