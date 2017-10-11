angular.module('mainApp')
    .controller('meController', ['$scope', '$localStorage', 'Main', function ($scope, $localStorage, Main) {
        if ($localStorage.ojecToken) {
            $scope.logged = true;
            Main.getUserData(function gotta(data) {
                var user = {
                    "name": data.user.name,
                    "lastName": data.user.lastName,
                    "email": data.user.email,
                    "itemsWatching": data.user.itemsWatching,
                    "itemsSelling": data.user.itemsSelling,
                    "admin": data.user.admin
                }
                $scope.user = user;
            });
        } else {
            $scope.logged = false;
        }
        $scope.user = {
            "name": "undefined"
        }
        $scope.popup = false;
       
        $scope.logout = ()=>{
            Main.logout();
        }
    }]);