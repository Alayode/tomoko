angular.module('MyApp')
  .controller('MainCtrl',['$scope','Show',function($scope,Show){

    $scope.alphabet = ['0-9', 'A','B'];

    $scope.genres = ['Action', 'Adventure','Animation','Children', 'Comedy','Crime'];

    $scope.headTitle = 'Top 12 Shows' ;

    $scope.shows = Show.query();

    $scope.filterByGenre = function(genre) {
      $scope.shows = Show.query({genre: genre});
      $scope.headingTitle = genre;
    };

    $scope.filterByAlphabet = function (char) {
      $scope.shows = Show.query({alphabet: char });
      $scope.headingTitle = char;
    };
  }]); 
