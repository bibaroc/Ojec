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
            Main.signup(data, (message) => {
                $scope.signUpMsg = message;
            });
        };
    }])

    .controller('forgotController', ["$scope", "$http", function ($scope, $http) {
        $scope.data = 'nil';
        $scope.ask = function () {
            $http.get("/forget/" + $scope.email)
                .then(
                function succ(response) {
                    $scope.emailMsg = response.data.msg;
                    $scope.data = response.data.data;
                },
                function fail(response) {
                    alert(JSON.stringify(response));
                });
        };
        $scope.please = function () {
            $http.post("/forget/" + $scope.email, { "securityAnswer": $scope.securityAnswer })
                .then(
                function succ(response) {
                    $scope.resetMsg = response.data.msg;
                },
                function fail(response) {
                    alert(JSON.stringify(response));
                });
        };

    }]);
