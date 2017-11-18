angular.module('mainApp')
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        "use strict";
        $scope.signin = () => {
            var signInData = {
                'email': $scope.inemail,
                'password': $scope.inpassword
            };
            Main.signin(signInData, (message) => {
                $scope.signInMsg = message;
            });
        };

        $scope.signup = () => {
            var data = {
                'name': $scope.firstName,
                'lastName': $scope.lastName,
                'email': $scope.upemail,
                'password': $scope.uppassword
            };
            Main.signup(data,(message)=>{
                $scope.signUpMsg = message;
            });
        };
    }]);
