angular.module('gleanerApp', ['gleanerServices', 'xeditable'])
    .run(function(editableOptions) {
        editableOptions.theme = 'bs3';
    }).filter('prettyDate', function() {
        return function(_id) {
            return $.format.prettyDate(new Date(parseInt(_id.slice(0, 8), 16) * 1000));
        };
    }).filter('list', function() {
        return function(list) {
            if (!list || list.length === 0) {
                return 'Empty list';
            } else {
                var result = '';
                list.forEach(function(v) {
                    result += v + ', ';
                });
                return result;
            }
        };
    }).controller('GleanerCtrl', ['$scope', '$params', 'Games', 'Versions',
        function($scope, $params, Games, Versions) {
            $scope.loading = 0;

            $scope.games = Games.query(function() {
                var gameId = $params.game;
                if (gameId) {
                    for (var i = 0; i < $scope.games.length; i++) {
                        if ($scope.games[i]._id === gameId) {
                            $scope.selectedGame = $scope.games[i];
                        }
                    }
                }

                if (!$scope.selectedGame) {
                    $scope.selectedGame = $scope.games[0];
                }
                $scope.refreshVersions();
                $scope.loading--;
            });
            $scope.loading++;

            $scope.refreshVersions = function(callback) {
                if ($scope.selectedGame) {
                    $scope.form.selectedGame = $scope.selectedGame;
                    $scope.loading++;
                    $scope.versions = Versions.query({
                        gameId: $scope.selectedGame._id
                    }, function() {
                        $scope.selectedVersion = null;
                        var versionId = $params.version;
                        if (versionId) {
                            for (var i = 0; i < $scope.versions.length; i++) {
                                if ($scope.versions[i]._id === versionId) {
                                    $scope.selectedVersion = $scope.versions[i];
                                }
                            }
                        }

                        if (!$scope.selectedVersion) {
                            $scope.selectedVersion = $scope.versions[0];
                        }

                        $scope.form.selectedVersion = $scope.selectedVersion;

                        if (callback) {
                            callback();
                        }
                        $scope.loading--;
                    });
                }
            };

            $scope.form = {
                selectedGame: null,
                selectedVersion: null
            };

            $scope.$watch('form.selectedGame', function(selected) {
                if (selected) {
                    $scope.selectedGame = selected;
                    $scope.refreshVersions();
                }
            });

            $scope.$watch('form.selectedVersion', function(selected) {
                if (selected) {
                    $scope.selectedVersion = selected;
                }
            });
        }
    ]);