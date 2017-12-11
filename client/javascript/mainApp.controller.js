angular.module('mainApp')
    .controller('signInController', ['$scope', 'Main', function ($scope, Main) {
        "use strict";
        $scope.securityQuestion = "What is the first name of the person you first kissed?";
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
                'password': $scope.uppassword,
                "securityAnswer": $scope.securityAnswer,
                "securityQuestion": $scope.securityQuestion
            };
            Main.signup(data,(message)=>{
                $scope.signUpMsg = message;
            });
        };
    }]);
