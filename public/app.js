angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
    .config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
        $locationProvider.html5Mode(true);



/*
*
 Home - display a list of popular shows.
 Detail - information about one particular TV show.
 Login - user login form.
 Signup - user signup form.
 Add - add a new show form.
*
* */

$routeProvider
    .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
    })
    .when('/shows/:id', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })
    .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
    })
    .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'AddCtrl'
    })
    .otherwise({
        redirectTo: '/'

    });
    }]);