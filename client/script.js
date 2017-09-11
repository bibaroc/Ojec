var app = angular.module('app', ['ui.bootstrap', 'ngAnimate']);

app.controller('carouselCtrl',['$scope', '$animate', function ($scope, $animate) {
    
    // will work as normal, if globaly disabled
    $animate.enabled(true); 
    
    $scope.slides = [
        { image: 'http://lorempixel.com/400/200/', text: 'Uomo' },    
        { image: 'http://lorempixel.com/400/200/', text: 'Donna' },
        { image: 'http://lorempixel.com/400/200/', text: 'Sveglie' }, 
		{ image: 'http://lorempixel.com/400/200/', text: 'About Us' }, 
    ]
        
}]);

