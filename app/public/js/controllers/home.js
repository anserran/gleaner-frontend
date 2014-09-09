angular.module('homeApp', ['gleanerServices', 'gleanerApp'])
    .controller('HomeCtrl', ['$scope', 'Games', "$window",
        function($scope, Games, $window) {
            $scope.createGame = function() {
                var game = new Games();
                game.title = 'Untitled game';
                game.$save(function() {
                    $window.location = "/app/data?game=" + game._id;
                });
            };
        }
    ]);