app.service('userService', ['$q', function($q) {
    
    this.login = function(user) {
        var dfr = $q.defer();
        Parse.User.logIn(user.username, user.password, {
            success: function(user) {
                console.log("user: ", user);
                dfr.resolve(user);
            },
            error: function(user, error) {
                console.log("error: ", error, " user: ", user);
                dfr.resolve(error);
            }
        });
        return dfr.promise;
    };
    
}]); //End userService