angular.module('realTimeApp', ['gleanerServices', 'gleanerApp'])
    .controller('RealtimeCtrl', ['$scope',
        function($scope) {

            var refreshGraph = function() {
                if ($scope.selectedVersion && $scope.selectedVersion._id) {
                    $.get('/api/games/' + $scope.selectedGame._id + '/versions/' + $scope.selectedVersion._id + '/rt', function(data) {
                        data.forEach(function(gameplay) {
                            $scope.zonesgraph.zone(gameplay._id, gameplay.zone);
                        });
                        $('.number-players').text('Players: ' + data.length);
                    });
                }
            };

            $scope.$watch('selectedVersion', function() {
                $scope.zonesgraph = Gleaner.zonesgraph('#zones-graph', $scope.selectedVersion.zones);
            });

            setInterval(refreshGraph, 5000);
        }
    ]);