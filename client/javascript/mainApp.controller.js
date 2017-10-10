angular.module('mainApp')
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        //$scope.msg = "dfsdf";
        $scope.signin = () => {
            var signInData = {
                'email': $scope.inemail,
                'password': $scope.inpassword
            };
            Main.signin(signInData, (message) => {
                $scope.signInMsg = message;
            });
        };
    }]);
