app.controller('MainCtrl', ['$scope', '$state', function($scope, $state) {
    
    $scope.logout = function() {
        Parse.User.logOut();
        console.log("logout");
    };
    
    $scope.uiRouterState = $state;
    
}]); //End MainCtrl