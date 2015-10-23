app.controller('LoginCtrl', ['$scope', '$location', 'userService', function($scope, $location, userService) {
    
    $scope.loginError = false;
    
    $scope.login = function(userObj) {
        userService.login(userObj).then(function(user) {
            if (!user._sessionToken) {
                $scope.loginError = !$scope.loginError;
                $scope.loginErrorMsg = "We couldn't find your username or password. Please try again.";
            }
            else {
                $location.path('/admin');
            }
        });
    };
    
}]); //End LoginCtrl