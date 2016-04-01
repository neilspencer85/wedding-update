Parse.initialize("pv2dMyXIqGOj7YefpKKmCBSVQCbZo4cjQp9FQCC1", "PrqgGnvbM0q09YsOTnQTUkS7JlzjXJg1OG4oUxjT");

var app = angular.module('Fotofly', ['ui.router', 'ngAnimate', 'ngMaterial', 'ui.bootstrap', 'bootstrapLightbox'
    // , 'parse-angular'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', 'LightboxProvider', function ($stateProvider, $urlRouterProvider, $mdThemingProvider, LightboxProvider) {
        
    // LightboxProvider.templateUrl = 'views/exportPhotosModal.html';
  	
  	$mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default' : '700'
        })
        
        .accentPalette('blue');

        // .backgroundPalette('light-green', {
        //     'default' : '50',
        //     'hue-1'   : '300',
        //     'hue-2'   : '200',
        //     'hue-3'   : '50'
        // })
        
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        .state('login', {
            url: '/login',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'MainCtrl'
                },
                'content': {
                    templateUrl: 'views/loginTmpl.html',
                    controller: 'LoginCtrl'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                    controller: 'MainCtrl'
                }
            }
        })
        .state('admin', {
            url: '/admin',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'MainCtrl'
                },
                'content': {
                    templateUrl: 'views/adminTmpl.html',
                    controller: 'AdminCtrl'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                    controller: 'MainCtrl'
                }
            },
            resolve: {
                isAuthed: function(userService) {
                    return Parse.User.current();
                }
            }
        })
        .state('event', {
            url: '/event',
            views: {
                'header': {
                    templateUrl: 'views/header.html',
                    controller: 'MainCtrl'
                },
                'content': {
                    templateUrl: 'views/eventTmpl.html',
                    controller: 'EventCtrl'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                    controller: 'MainCtrl'
                }
            },
            resolve: {
                isAuthed: function(userService) {
                    return Parse.User.current();
                }
            }
        })
        
        //eventId can be called anywhere with $stateParams.eventId -See EventCtrl.js
        // '/event/' + id is called to route to this event -see AdminCtrl.js ---- you must include the whole endpoint ('/event/' + id) 
        .state('eventId', {
            url: '/event/:eventId',
            views: {
                'header': {
                    templateUrl: 'views/eventHeader.html',
                    controller: 'MainCtrl'
                },
                'content': {
                    templateUrl: 'views/eventTmpl.html',
                    controller: 'EventCtrl'
                },
                'footer': {
                    templateUrl: 'views/footer.html',
                    controller: 'MainCtrl'
                }
            },
            resolve: {
                isAuthed: function(userService) {
                    return Parse.User.current();
                }
            }
        });
        
}]); // end .config

app.run(function () {
    Parse.initialize('pv2dMyXIqGOj7YefpKKmCBSVQCbZo4cjQp9FQCC1', 'PrqgGnvbM0q09YsOTnQTUkS7JlzjXJg1OG4oUxjT');
})
        
        
// var newEvent = Parse.Object.extend("newEvent");
// var addEvent = new newEvent();

// addEvent.set("name", name);
// addEvent.set("key", key);
// addEvent.set("eventDate", eventDate);
// addEvent.set("fbAdmin", fbAdmin);
// addEvent.set("instaAdmin", instaAdmin);
// addEvent.set("createdAt", date);

// addEvent.save(null, {
//     success : function(addEvent) {
//         // Execute any logic that should take place after the object is saved.
//         console.log('New event was saved for: ' + addEvent.id);
//     },
//     error : function(addEvent, error) {
//         // Execute any logic that should take place if the save fails.
//         // error is a Parse.Error with an error code and message.
//         console.log('Failed to create new object, with error code: ' + error.message);
//     }
// });