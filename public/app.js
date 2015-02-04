/*

  ===================================
  Using the $locationProvider and why
  ===================================

  The location provider is a built-in AngularJS service for configuring
  application linking paths. Using this service you can enable HTML pushState
  to change the URL Prefix from # to something like #!
  for example i would like to use Disqus comments in my angularJS application.
  by adding the $locationProvider parameter to the config's callback
  function is enough to tell AngularJS to inject that service to make it
  available.

*/
/*
angular.module has several strings within the array.
the name of the service to inject for the corresponding parameter.
*/

angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$locationProvider','$routeProvider', function($locationProvider, $routeProvider)  {
    $locationProvider.html5Mode(true);

    /*

        We will inject the $routeProvider and add the following routes
        =================================================
        Home - display a list of popular shows
        Detail - information about one particular TV show.
        Login - user login form.
        Signup - user signup form.
        Add - add a new show form.
        =================================================

    */

    /* inject $routeProvider in config then add these routes: */

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('shows/:id',{
        templateUrl:'views/details.html',
        controller: 'DetailCtrl'
      })
      .when('login/',{
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'SignupCtrl'
        })
      .when('/add',{
        templateUrl: 'views/add.html',
        controller: 'AddCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

}]);
      /*

        For each route there is a template and a controller
        You only need a controller if you have a page used for dynamic content/
        otherwise the need for specified controller is irrelevant.

      */
