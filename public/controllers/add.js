/*
* Chris Samuel
* 02-14-2015
* Add.js
*
* this script will be used for
* adding shows to  mongoDB database.
* When the angular Module  uses the Show function it will
* inject the service into controller.
*
*
* */

angular.module('MyApp')
    .controller('AddCtrl', function($scope, $alert, Show) {
        $scope.addShow = function() {
            Show.save({ showName: $scope.showName }).$promise
                .then(function() {
                    $scope.showName = '';
                    $scope.addForm.$setPristine();
                    $alert({
                        content: 'TV show has been added.',
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                })
                .catch(function(response) {
                    $scope.showName = '';
                    $scope.addForm.$setPristine();
                    $alert({
                        content: response.data.message,
                        animation: 'fadeZoomFadeDown',
                        type: 'material',
                        duration: 3
                    });
                });
        };
    });