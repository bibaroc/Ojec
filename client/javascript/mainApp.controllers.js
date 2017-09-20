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
        alert('SignUpControllerLoaded');
        $scope.submit = () => {
            var data = {
                'email': $scope.email,
                'password': $scope.password
            };
            console.log(data);
            Main.signin(data);
        };
    }]);

